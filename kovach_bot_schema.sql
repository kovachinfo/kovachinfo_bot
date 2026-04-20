-- KOVACH BOT - PostgreSQL schema and seed data
-- Target credential in n8n: kovach_bot_db
-- Safe to run multiple times (idempotent DDL/seed pattern).

BEGIN;

CREATE TABLE IF NOT EXISTS bot_users (
  user_id            BIGINT PRIMARY KEY,
  chat_id            BIGINT NOT NULL,
  username           TEXT,
  first_name         TEXT,
  last_name          TEXT,
  language           TEXT NOT NULL DEFAULT 'ru' CHECK (language IN ('ru', 'en', 'sr')),
  language_detected  TEXT,
  state              TEXT NOT NULL DEFAULT 'main_menu',
  prev_state         TEXT,
  funnel_stage       TEXT NOT NULL DEFAULT 'visitor',
  entry_point        TEXT,
  utm_source         TEXT,
  utm_campaign       TEXT,
  last_intent        TEXT,
  last_seen_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bot_users_chat_id ON bot_users (chat_id);
CREATE INDEX IF NOT EXISTS idx_bot_users_state ON bot_users (state);
CREATE INDEX IF NOT EXISTS idx_bot_users_language ON bot_users (language);

CREATE TABLE IF NOT EXISTS bot_events (
  id                 BIGSERIAL PRIMARY KEY,
  user_id            BIGINT,
  chat_id            BIGINT,
  event_type         TEXT NOT NULL,
  input_type         TEXT,
  intent             TEXT,
  state_before       TEXT,
  state_after        TEXT,
  payload_json       JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bot_events_user_id ON bot_events (user_id);
CREATE INDEX IF NOT EXISTS idx_bot_events_chat_id ON bot_events (chat_id);
CREATE INDEX IF NOT EXISTS idx_bot_events_created_at ON bot_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bot_events_intent ON bot_events (intent);

CREATE TABLE IF NOT EXISTS lead_requests (
  id                 BIGSERIAL PRIMARY KEY,
  user_id            BIGINT NOT NULL,
  lead_type          TEXT NOT NULL,
  lead_status        TEXT NOT NULL DEFAULT 'new',
  service_interest   TEXT,
  problem_text       TEXT,
  contact_preference TEXT,
  source_context     TEXT,
  manager_notes      TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_requests_user_id ON lead_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_lead_requests_status ON lead_requests (lead_status);
CREATE INDEX IF NOT EXISTS idx_lead_requests_created_at ON lead_requests (created_at DESC);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id                 BIGSERIAL PRIMARY KEY,
  user_id            BIGINT NOT NULL,
  message_thread_id  BIGINT NOT NULL,
  status             TEXT NOT NULL CHECK (status IN ('open', 'closed')),
  manager_id         BIGINT,
  handoff_reason     TEXT,
  opened_at          TIMESTAMPTZ,
  closed_at          TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions (status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_thread_id ON chat_sessions (message_thread_id);

CREATE TABLE IF NOT EXISTS hot_news_digests (
  id                   BIGSERIAL PRIMARY KEY,
  lang                 TEXT NOT NULL CHECK (lang IN ('ru', 'en', 'sr')),
  title                TEXT NOT NULL,
  digest_text          TEXT NOT NULL,
  source_links_json    JSONB,
  status               TEXT NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'published')),
  created_by_workflow  TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_by          BIGINT,
  approved_at          TIMESTAMPTZ,
  published_at         TIMESTAMPTZ,
  published_message_id BIGINT
);

CREATE INDEX IF NOT EXISTS idx_hot_news_digests_status ON hot_news_digests (status);
CREATE INDEX IF NOT EXISTS idx_hot_news_digests_lang_status_created
  ON hot_news_digests (lang, status, created_at DESC);

CREATE TABLE IF NOT EXISTS bot_content_items (
  id                 BIGSERIAL PRIMARY KEY,
  module_key         TEXT NOT NULL,
  item_key           TEXT NOT NULL,
  lang               TEXT NOT NULL CHECK (lang IN ('ru', 'en', 'sr')),
  title              TEXT,
  body               TEXT,
  media_type         TEXT,
  media_file_id      TEXT,
  sort_order         INT NOT NULL DEFAULT 100,
  is_active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_bot_content_items UNIQUE (module_key, item_key, lang)
);

CREATE INDEX IF NOT EXISTS idx_bot_content_items_module
  ON bot_content_items (module_key, lang, is_active, sort_order);

CREATE TABLE IF NOT EXISTS menu_command_map (
  id           BIGSERIAL PRIMARY KEY,
  lang         TEXT NOT NULL CHECK (lang IN ('ru', 'en', 'sr', '*')),
  input_value  TEXT NOT NULL,
  input_type   TEXT NOT NULL CHECK (input_type IN ('text', 'callback', 'command')),
  intent_key   TEXT NOT NULL,
  target_state TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_menu_command_map UNIQUE (lang, input_value, input_type)
);

CREATE INDEX IF NOT EXISTS idx_menu_command_map_lookup
  ON menu_command_map (lang, input_type, lower(input_value), is_active);
CREATE INDEX IF NOT EXISTS idx_menu_command_map_intent ON menu_command_map (intent_key);

CREATE TABLE IF NOT EXISTS tg_usage (
  chat_id      BIGINT PRIMARY KEY,
  msg_count    INT NOT NULL DEFAULT 0,
  last_msg_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed: callback and command map (language-agnostic)
INSERT INTO menu_command_map (lang, input_value, input_type, intent_key, target_state, is_active)
VALUES
  ('*', '/start', 'command', 'start', 'main_menu', TRUE),
  ('*', '/menu', 'command', 'main_menu', 'main_menu', TRUE),
  ('*', '/reset_memory', 'command', 'reset_memory', NULL, TRUE),

  ('*', 'main_menu', 'callback', 'main_menu', 'main_menu', TRUE),
  ('*', 'back', 'callback', 'back', NULL, TRUE),
  ('*', 'menu_usecases', 'callback', 'menu_usecases', 'usecases_menu', TRUE),
  ('*', 'menu_hot_news', 'callback', 'menu_hot_news', 'hot_news_menu', TRUE),
  ('*', 'menu_contacts', 'callback', 'menu_contacts', 'contacts_menu', TRUE),
  ('*', 'menu_creative', 'callback', 'menu_creative', 'creative_chat', TRUE),
  ('*', 'change_language', 'callback', 'change_language', 'language_settings', TRUE),
  ('*', 'set_lang_ru', 'callback', 'set_lang_ru', 'main_menu', TRUE),
  ('*', 'set_lang_en', 'callback', 'set_lang_en', 'main_menu', TRUE),
  ('*', 'set_lang_sr', 'callback', 'set_lang_sr', 'main_menu', TRUE),
  ('*', 'case_1', 'callback', 'case_1', 'usecases_case_1', TRUE),
  ('*', 'case_2', 'callback', 'case_2', 'usecases_case_2', TRUE),
  ('*', 'case_3', 'callback', 'case_3', 'usecases_case_3', TRUE),
  ('*', 'case_4', 'callback', 'case_4', 'usecases_case_4', TRUE),
  ('*', 'reset_memory', 'callback', 'reset_memory', NULL, TRUE)
ON CONFLICT (lang, input_value, input_type) DO NOTHING;

-- Seed: RU text labels with emoji
INSERT INTO menu_command_map (lang, input_value, input_type, intent_key, target_state, is_active)
VALUES
  ('ru', '📚 Юзкейсы', 'text', 'menu_usecases', 'usecases_menu', TRUE),
  ('ru', '🔥 Hot News', 'text', 'menu_hot_news', 'hot_news_menu', TRUE),
  ('ru', '📞 Контакты', 'text', 'menu_contacts', 'contacts_menu', TRUE),
  ('ru', '🎨 Креатив', 'text', 'menu_creative', 'creative_chat', TRUE),
  ('ru', '🌐 Сменить язык', 'text', 'change_language', 'language_settings', TRUE),

  ('ru', '🧩 Кейс №1', 'text', 'case_1', 'usecases_case_1', TRUE),
  ('ru', '🧩 Кейс №2', 'text', 'case_2', 'usecases_case_2', TRUE),
  ('ru', '🧩 Кейс №3', 'text', 'case_3', 'usecases_case_3', TRUE),
  ('ru', '🧩 Кейс №4', 'text', 'case_4', 'usecases_case_4', TRUE),

  ('ru', '⬅️ Назад', 'text', 'back', NULL, TRUE),
  ('ru', '🏠 Главное меню', 'text', 'main_menu', 'main_menu', TRUE),
  ('ru', '🧹 Сбросить память', 'text', 'reset_memory', NULL, TRUE),

  ('ru', '🇷🇺 Русский', 'text', 'set_lang_ru', 'main_menu', TRUE),
  ('ru', '🇬🇧 English', 'text', 'set_lang_en', 'main_menu', TRUE),
  ('ru', '🇷🇸 Srpski', 'text', 'set_lang_sr', 'main_menu', TRUE)
ON CONFLICT (lang, input_value, input_type) DO NOTHING;

-- Seed: EN text labels with emoji
INSERT INTO menu_command_map (lang, input_value, input_type, intent_key, target_state, is_active)
VALUES
  ('en', '📚 Use Cases', 'text', 'menu_usecases', 'usecases_menu', TRUE),
  ('en', '🔥 Hot News', 'text', 'menu_hot_news', 'hot_news_menu', TRUE),
  ('en', '📞 Contacts', 'text', 'menu_contacts', 'contacts_menu', TRUE),
  ('en', '🎨 Creative', 'text', 'menu_creative', 'creative_chat', TRUE),
  ('en', '🌐 Change Language', 'text', 'change_language', 'language_settings', TRUE),

  ('en', '🧩 Case #1', 'text', 'case_1', 'usecases_case_1', TRUE),
  ('en', '🧩 Case #2', 'text', 'case_2', 'usecases_case_2', TRUE),
  ('en', '🧩 Case #3', 'text', 'case_3', 'usecases_case_3', TRUE),
  ('en', '🧩 Case #4', 'text', 'case_4', 'usecases_case_4', TRUE),

  ('en', '⬅️ Back', 'text', 'back', NULL, TRUE),
  ('en', '🏠 Main Menu', 'text', 'main_menu', 'main_menu', TRUE),
  ('en', '🧹 Reset Memory', 'text', 'reset_memory', NULL, TRUE),

  ('en', '🇷🇺 Russian', 'text', 'set_lang_ru', 'main_menu', TRUE),
  ('en', '🇬🇧 English', 'text', 'set_lang_en', 'main_menu', TRUE),
  ('en', '🇷🇸 Serbian', 'text', 'set_lang_sr', 'main_menu', TRUE)
ON CONFLICT (lang, input_value, input_type) DO NOTHING;

-- Seed: SR text labels with emoji (Latin script)
INSERT INTO menu_command_map (lang, input_value, input_type, intent_key, target_state, is_active)
VALUES
  ('sr', '📚 Studije slucaja', 'text', 'menu_usecases', 'usecases_menu', TRUE),
  ('sr', '🔥 Hot News', 'text', 'menu_hot_news', 'hot_news_menu', TRUE),
  ('sr', '📞 Kontakti', 'text', 'menu_contacts', 'contacts_menu', TRUE),
  ('sr', '🎨 Kreativa', 'text', 'menu_creative', 'creative_chat', TRUE),
  ('sr', '🌐 Promeni jezik', 'text', 'change_language', 'language_settings', TRUE),

  ('sr', '🧩 Slucaj #1', 'text', 'case_1', 'usecases_case_1', TRUE),
  ('sr', '🧩 Slucaj #2', 'text', 'case_2', 'usecases_case_2', TRUE),
  ('sr', '🧩 Slucaj #3', 'text', 'case_3', 'usecases_case_3', TRUE),
  ('sr', '🧩 Slucaj #4', 'text', 'case_4', 'usecases_case_4', TRUE),

  ('sr', '⬅️ Nazad', 'text', 'back', NULL, TRUE),
  ('sr', '🏠 Glavni meni', 'text', 'main_menu', 'main_menu', TRUE),
  ('sr', '🧹 Resetuj memoriju', 'text', 'reset_memory', NULL, TRUE),

  ('sr', '🇷🇺 Ruski', 'text', 'set_lang_ru', 'main_menu', TRUE),
  ('sr', '🇬🇧 Engleski', 'text', 'set_lang_en', 'main_menu', TRUE),
  ('sr', '🇷🇸 Srpski', 'text', 'set_lang_sr', 'main_menu', TRUE)
ON CONFLICT (lang, input_value, input_type) DO NOTHING;

COMMIT;
