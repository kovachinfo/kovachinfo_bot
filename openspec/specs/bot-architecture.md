---
id: bot-architecture
type: architecture-design
title: Kovach Bot — Архитектура
status: active
parent: bot-overview
tags:
  - architecture
  - n8n
  - postgresql
  - telegram
---

## Принципы проектирования

- **Разделение слоёв** — транспорт, нормализация, разрешение intent, роутинг, бизнес-модули и логирование идут последовательно в одном основном workflow.
- **Детерминированная навигация** — меню, callback и команды разрешаются кодом (`Code - Resolve Intent Key` + `Code - Extend Intent Key`), без AI.
- **AI только где нужно** — свободный диалог после онбординга и в разделе консультации; для роутинга меню не используется.
- **Свободный текст не перехватывается меню** — в состояниях диалога с AI частичные совпадения с пунктами меню отключены.
- **Явные состояния** — переходы между состояниями конечны и восстановимы.
- **Событийный лог** — значимые действия записываются в `bot_events`.

## Структура слоёв

```
┌─────────────────────────────┐
│   Telegram Bot API          │  ← входящие обновления
├─────────────────────────────┤
│   Transport & Inbound       │  ← Telegram Trigger
├─────────────────────────────┤
│   Input Normalization       │  ← Set - Normalize Telegram Update
├─────────────────────────────┤
│   Session, State & Dedupe   │  ← загрузка bot_users, дедуп update_id, обновление username
├─────────────────────────────┤
│   Intent Resolution         │  ← Code-узлы: text / callback / command → intent_key
├─────────────────────────────┤
│   Navigation Switch         │  ← Switch - Route By Intent Key (24 выхода)
├─────────────────────────────┤
│   Business Modules          │  ← онбординг, аудит-заявка, AI, кейсы, дайджест, контакты, язык
├─────────────────────────────┤
│   Lead Alerts               │  ← Telegram + email владельцу
├─────────────────────────────┤
│   Analytics & Logging       │  ← bot_events, lead_requests
└─────────────────────────────┘
```

## Технологический стек

| Слой | Технология |
|------|-----------|
| Оркестрация | n8n (self-hosted, основной workflow + sub-workflow админки дайджестов) |
| База данных | PostgreSQL (на одном сервере с n8n) |
| Канал доставки | Telegram Bot API (узел Telegram v1.2) |
| AI-диалог | n8n AI Agent + OpenAI `gpt-5.4-mini` |
| Память диалога | Postgres Chat Memory (`n8n_chat_histories`), ключ сессии — `user_id`, окно 30 сообщений |
| Транскрибация голоса | Groq API, модель `whisper-large-v3` |
| Email-уведомления | SMTP (узел emailSend) |
| Дайджесты | AI-генерация + Human-in-the-Loop модерация |

## Версии workflow

| Версия | Файл | Узлов | Статус |
|--------|------|-------|--------|
| MVP | `n8n_telegram_funnel_bot_mvp_skeleton.json` | 46 | Легаси |
| V1 | `n8n_telegram_funnel_bot_onboarding_hybrid_ready_v1.json` | 75 | Легаси |
| V2 | `n8n_telegram_funnel_bot_onboarding_hybrid_ready_v2.json` | 76 | Легаси |
| V5 | `kovach_bot Funnel Bot Hybrid Onboarding + Lead Profile Ready V5 Structural Fixes.json` | 99 | Легаси |
| V6 | `kovach_bot Funnel Bot Hybrid Onboarding + Lead Profile Ready V6 Audit Request + Lead Alerts.json` | 143 | Легаси |
| **V7** | `kovach_bot Funnel Bot V7 Three-Step Chain + Lead Fixes.json` | **147** | **Текущая** |

### Что изменилось в V7 относительно V6

- Онбординг сжат с 5 шагов до 3 (вариант `v3`), см. `onboarding-funnel`.
- Лид создаётся только по настоящему описанию бизнеса; «привет» и короткие вопросы лидом не считаются.
- Карточка лида владельцу содержит все ответы цепочки, источник (`entry_point`), телефон и ссылку `tg://user?id=…`, если нет username.
- Добавлен сбор телефона кнопкой «📱 Отправить мой номер» для пользователей без username.
- `/start <метка>` распознаётся как старт; метка сохраняется в `entry_point`.
- Свободный текст в диалоге с AI больше не перехватывается пунктами меню (порог частичного совпадения ≥ 0,7 и только вне диалога).
- Username, имя и `entry_point` существующих пользователей обновляются при каждом обращении.
- Шаги онбординга пишутся в `bot_events` (`onboarding_step`).
- Системный промпт AI переписан: стадия лида, флаг заявки, заявка на аудит как единственный способ передачи владельцу.
- Убраны искусственная задержка ответа AI и повторные «печатает…».
- Дневной лимит AI-запросов — 30; сербские тексты приведены к латинице с диакритикой.

Миграции БД для V7 не требуются.

## Нормализованный контракт входа

На выходе из `Set - Normalize Telegram Update` каждое событие содержит:

| Поле | Тип | Источник |
|------|-----|---------|
| `event_id` | text | dedup-ключ (Telegram update_id) |
| `source` | text | Тип источника обновления |
| `chat_id` | bigint | Telegram chat |
| `user_id` | bigint | Telegram user |
| `message_id` | bigint | Telegram message |
| `message_thread_id` | bigint | Telegram topic (зарезервировано под handoff) |
| `input_type` | enum | `text`, `callback`, `voice`, `contact` и др. |
| `voice_file_id` | text | Файл голосового сообщения |
| `raw_text` | text | Исходный текст |
| `text_normalized` | text | Очищенный текст |
| `callback_data` | text | Callback payload |
| `username`, `first_name`, `last_name` | text | Профиль Telegram |
| `entry_point` | text | Метка из `/start <метка>` |
| `contact_phone` | text | Номер из сообщения-контакта (для `input_type = contact`) |
| `received_at` | timestamptz | Временная метка |

После загрузки контекста из `bot_users` к событию добавляются `language`, `current_state`, `is_new_user`, `onboarding_profile_json`, `onboarding_status`. Username, имя и (если пришла новая метка) `entry_point` существующего пользователя при этом обновляются в базе.

## Разрешение intent

1. **`Code - Resolve Intent Key`** — точная карта (метки кнопок на трёх языках, callback-ключи, команды), затем частичные правила.
   - `/start` и `/start <метка>` → `start` (но `/startup …` — нет).
   - Частичные правила отключены в состояниях `ai_entry` / `creative_chat` и для callback; в остальных случаях совпадение должно покрывать ≥ 70 % текста.
2. **`Code - Extend Intent Key`** — уточнения: `onb_*` callback → одноимённый intent; `mcase_<key>` → `marketing_case`; `input_type = contact` → `lead_contact_shared`; `talk_to_manager` → `menu_contacts` (relay не реализован).
3. **`Switch - Route By Intent Key`** — 24 выхода; всё нераспознанное в состояниях диалога уходит в `ai_default`.

Slash-команды: `/start`, `/restart`, `/menu`, `/help`.

Таблица `menu_command_map` в схеме существует, но основной workflow её не читает — карта команд живёт в коде узлов. Подписи кнопок — в `menu_labels` узла `Set - Runtime Limits And Variant Config`.

## Runtime-конфигурация

Узел `Set - Runtime Limits And Variant Config`:

| Параметр | Значение |
|----------|----------|
| `onboarding_variant` | `v3` |
| `ai_daily_limit` | 30 запросов за 24 часа |
| `ai_max_chars` | 1800 |
| `ai_lock_seconds` | 120 |
| `menu_labels` | Подписи кнопок на ru / en / sr |

## Порядок выполнения веток

Workflow работает в режиме `executionOrder: v1`: параллельные ветки из одного узла выполняются по позиции на холсте — сверху вниз, затем слева направо. От положения трёх узлов зависит поведение, их нельзя опускать ниже соседних веток:

| Узел | Должен быть выше | Зачем |
|------|------------------|-------|
| `Telegram - Answer Callback Query` | ветки handoff/основной обработки | «Часики» на кнопке гаснут сразу |
| Ветка уведомления о лиде онбординга | `Postgres - AI Guard And Acquire Lock` | Карточка уходит владельцу до ответа AI |
| `Telegram - Send Typing Action For AI` | `AI Agent - Main Dialogue` | «Печатает…» появляется до генерации |

Между `If - AI Request Can Proceed` и AI Agent нельзя вставлять узлы: ключ памяти берётся из `user_id` входного элемента агента.

## База данных

Основные таблицы (подробнее см. `kovach_bot_schema.sql`):

| Таблица | Назначение |
|---------|-----------|
| `bot_users` | Профили, состояние, язык, воронка, `onboarding_profile_json`, `entry_point`, `is_admin` |
| `bot_events` | Append-only событийный лог (`ai_request`, `onboarding_step`, …) |
| `lead_requests` | Лиды: `onboarding_v2` (описание бизнеса), `audit_request` (заявка на аудит) |
| `hot_news_digests` | Дайджесты с жизненным циклом модерации |
| `bot_content_items` | Редактируемый контент (кейсы маркетинга, контакты) |
| `n8n_chat_histories` | Память AI-диалога |
| `chat_sessions` | Сессии handoff — зарезервировано, relay не реализован |
| `menu_command_map` | Зарезервировано, основным workflow не используется |

Получатели уведомлений о лидах — пользователи с `bot_users.is_admin = TRUE`.

## Вспомогательные workflow

| Workflow | Назначение | Тип |
|----------|-----------|-----|
| `Kovach Bot DB Setup (Run Once)` | Создание схемы БД | Разовый |
| `Kovach Bot - Digest Admin (Human In The Loop)` | Модерация дайджестов (вызывается из основного через Execute Workflow) | Постоянный |
| `Kovach Bot - Case Media Loader (run once)` | Загрузка скриншотов кейсов в Telegram | Разовый |
| `Kovach Bot - Migration Marketing Cases` | Наполнение `bot_content_items` кейсами | Разовый |
| `Kovach Bot - Migration Hot News Admin` | Миграция админки дайджестов | Разовый |

## Ключевые состояния пользователя

```
new → onb_v3_s1 → onb_v3_s2 → onb_v3_s3 → ai_entry (AI-ассистент, funnel_stage = consultation)
                                              │
главное меню ←────────────────────────────────┘
  ├── автоматизация (юзкейсы) → кейс N
  ├── кейсы маркетинга (список → кейс)
  ├── digital digest
  ├── контакты
  ├── creative_chat (AI-консультация)
  ├── смена языка
  └── (back / main_menu из любого подменю; «Перезапустить» → onb_v3_s1)
```

Состояния, от которых зависит логика: `new`, `onb_v3_sN`, `ai_entry`, `creative_chat`. В двух последних свободный текст уходит AI-ассистенту.

Заявка на аудит и передача телефона состояние не меняют — они доступны из любого места.
