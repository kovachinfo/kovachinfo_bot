# Telegram Bot Architecture for Business Funnel

## 1. System Prompt for Future Design Work

You are acting as a solution architect and senior n8n automation engineer for a modular Telegram funnel bot for a personal business brand.

Your job is to design the bot as a reliable business entrypoint where leads from website, social networks, paid traffic, direct outreach, and messaging campaigns converge into one controlled Telegram experience.

The bot must:
- greet new users clearly and professionally;
- explain who the expert is and what value the user can get;
- offer useful free entry actions such as a free audit, lead magnet, contact request, or guided menu navigation;
- gradually move the user deeper into the funnel;
- optionally redirect the user into a human-managed dialogue when intent becomes commercial or support-related;
- support three interface languages: Russian, English, and Serbian;
- remain modular so that individual features can be added, disabled, or replaced without rebuilding the whole bot.

Architecture constraints:
- backend orchestration is built primarily in n8n;
- persistent data is stored in PostgreSQL on the same server as n8n;
- database access is performed through configured PostgreSQL Credentials inside n8n;
- the PostgreSQL credential name in n8n for this project is `kovach_bot_db`;
- Telegram Bot API is the main delivery channel;
- the solution should favor orchestration, routing, state handling, and integrations over heavy computation;
- modules should be isolated by responsibility;
- state transitions must be explicit and recoverable;
- human handoff must work through a proxy-bot model using Telegram Topics and PostgreSQL session mapping;
- menus, callbacks, commands, user state, and analytics must be normalized through a common input contract.

Design principles:
- keep the core bot thin and modular;
- separate transport, normalization, navigation, business logic, and human handoff;
- build every module so it can operate as an independent workflow or sub-workflow in n8n;
- prefer deterministic routing for menu actions and callbacks;
- use a localized command-map layer so the same business intent can be reached from RU / EN / SR labels and callback payloads;
- use AI only where it provides clear value, not as a replacement for navigation logic;
- log enough events to understand funnel progression, intent, and drop-off;
- preserve clean escalation from bot to human manager;
- design with future additions in mind: mini apps, CRM sync, lead scoring, booking, content utilities, paid products, segmented follow-up.

When proposing implementation:
- define the domain boundaries first;
- define the normalized event schema second;
- define database tables and ownership third;
- define n8n workflows and triggers fourth;
- define user states, menus, and callback maps fifth;
- only then define message copy and UI details.

Success criteria:
- the bot is understandable as a funnel system, not just a chat bot;
- each module has one responsibility;
- all important actions are traceable in DB;
- the handoff to a live manager is seamless;
- the architecture supports phased rollout from MVP to more advanced automations.


## 2. Product Framing

This bot is the lower layer of the business funnel. Its role is not only answering messages, but:
- centralizing inbound demand from multiple acquisition channels;
- qualifying or warming up users;
- distributing users into relevant menu branches and offers;
- capturing lead intent and contact context;
- escalating high-value conversations to a human;
- storing behavior/state so the experience is consistent over time.

Language model for MVP:
- default interface language is Russian;
- English and Serbian are optional interface languages available from the main menu;
- there should be no mandatory language-selection step for new users by default;
- language switching should be a first-class menu action available after onboarding;
- business intents must stay language-independent even when labels differ by locale.

The first release should optimize for:
- stable onboarding;
- clear menu navigation;
- one lead capture scenario;
- one human handoff scenario;
- basic analytics and state persistence.


## 3. Domain-Based Architecture

### A. Transport and Inbound Layer
Responsibility:
- receive all Telegram updates;
- distinguish message, callback, command, media, voice, and manager-topic events;
- pass all input into a normalized contract.

n8n implementation:
- one primary `Telegram Trigger` workflow;
- immediate branching into `private user chat`, `manager group topic`, `callback_query`, `media`, `voice`, `system`.

Reference pattern adopted from existing bots:
- dedicated normalization step like `Set input _ normalized` / `Normalize Input`;
- unified access to `chat_id`, `user_id`, `text`, `callback_data`, `input_type`, `lang`, `state`.

### B. Input Normalization Layer
Responsibility:
- convert raw Telegram update into one canonical structure for downstream routing.

Normalized fields recommended:
- `event_id`
- `source` (`telegram_private`, `telegram_group_topic`, `telegram_callback`)
- `chat_id`
- `user_id`
- `message_id`
- `message_thread_id`
- `input_type` (`text`, `callback`, `command`, `photo`, `video`, `document`, `voice`, `system`)
- `raw_text`
- `text_normalized`
- `callback_data`
- `lang`
- `ui_lang`
- `intent_candidate`
- `current_state`
- `is_new_user`
- `utm_source`, `utm_campaign`, `entry_point` if available
- `received_at`

Important rule:
- every module after this layer must consume normalized input only.

### C. Session and State Layer
Responsibility:
- persist user identity, language, current state, funnel stage, and last meaningful action;
- restore context on each new update;
- support both deterministic menu flows and manager handoff sessions.

Recommended user states for MVP:
- `new`
- `welcome`
- `main_menu`
- `language_settings`
- `about`
- `free_audit_intro`
- `free_audit_form`
- `lead_captured`
- `resources_menu`
- `contact_menu`
- `handoff_pending`
- `handoff_active`
- `closed`

Recommendation from the reference bots:
- keep `lang` and `state` in PostgreSQL as first-class fields;
- route menus primarily by `intent + current_state`;
- update state explicitly after each branch.

### D. Navigation and Command Resolution Layer
Responsibility:
- resolve user input into menu commands or business intents;
- handle back buttons, main menu returns, callbacks, and fallback responses.

Recommended routing model:
- `ResolveLocalizedCommandMap`
- `ResolveCommand`
- `ResolveIntent`
- `State-aware Navigation Switch`
- `Back Resolver`

Intent groups for MVP:
- `start`
- `menu_usecases`
- `case_1`
- `case_2`
- `case_3`
- `case_4`
- `menu_hot_news`
- `menu_contacts`
- `menu_creative`
- `change_language`
- `set_lang_ru`
- `set_lang_en`
- `set_lang_sr`
- `reset_memory`
- `talk_to_manager`
- `back`
- `main_menu`
- `unknown`

Architectural rule:
- use deterministic mapping for menu/callback logic;
- map localized labels into canonical internal intent keys before business routing;
- use AI classification only as a fallback for free-text ambiguity, not as the primary router.

### E. Lead Capture and Funnel Layer
Responsibility:
- collect lead data and commercial intent;
- structure users into stages;
- create actionable leads for follow-up.

MVP lead capture and engagement scenarios:
- use-case exploration (case #1 ... case #4);
- contact request from menu;
- creative dialogue session with persistent memory;
- optional manager handoff;
- hot news digest consumption from a prepared publication pipeline.

Suggested lead stages:
- `visitor`
- `engaged`
- `requested_value`
- `qualified`
- `manager_requested`
- `in_handoff`
- `converted`
- `lost`

Data to capture:
- Telegram identity;
- first name, username;
- acquisition source if known;
- selected service or interest;
- free-text problem statement;
- preferred contact method;
- qualification notes;
- timestamp of key actions.

### F. Content and Utility Modules
Responsibility:
- expose useful sections inside the menu without bloating the core flow.

Examples:
- use-case library (`case_1` ... `case_4`);
- hot news digest feed;
- contacts and resources posts;
- creative module for text/voice communication;
- optional files, checklists, links, and mini app extensions;
- language switch section in main menu;
- channel subscription prompt;
- website/social links;
- mini app entrypoint later.

Architectural rule:
- each utility branch should be a separate sub-workflow or clearly isolated route group.

### G. Human Handoff Module
Responsibility:
- transfer the conversation from bot to human manager seamlessly.

Adopted architecture:
- proxy-bot model via Telegram Topics;
- `chat_sessions` table in Supabase;
- one topic per client in manager supergroup;
- bot relays client messages into topic and manager replies back to client.

Key states:
- `handoff_pending`
- `handoff_active`
- `handoff_closed`

Key DB fields:
- `user_id`
- `message_thread_id`
- `status`
- `manager_id`
- `opened_at`
- `closed_at`
- `handoff_reason`

Operational rule:
- human handoff remains an autonomous skill/module and can be called by business rules or later by AI intent analysis.

### H. Analytics and Administration Layer
Responsibility:
- track funnel progression;
- monitor drop-off and usage;
- measure which entrypoints and menu items perform.

Must-have metrics:
- new users per day;
- source breakdown;
- clicks on main menu items;
- free audit requests;
- handoff requests;
- completed handoffs;
- inactive users after first interaction;
- conversion by source and by module.

Implementation:
- event logging table in PostgreSQL;
- optional admin notifications in Telegram;
- later: dashboard in Metabase / Grafana / Looker Studio.


## 4. Infrastructure Note

Infrastructure assumption for this project:
- PostgreSQL is hosted on the same server as n8n;
- n8n connects to PostgreSQL through saved Credentials in the n8n credential store;
- the PostgreSQL credential for this bot is named `kovach_bot_db`;
- workflow nodes should use the shared PostgreSQL credential rather than hardcoded connection parameters;
- the architecture should rely on standard PostgreSQL capabilities and remain independent from Supabase-specific features.


## 5. Recommended Database Schema

### `bot_users`
Purpose:
- master user profile and current state.

Fields:
- `user_id` bigint primary key
- `chat_id` bigint not null
- `username` text
- `first_name` text
- `last_name` text
- `language` text
- `language_detected` text
- `state` text
- `funnel_stage` text
- `entry_point` text
- `utm_source` text
- `utm_campaign` text
- `last_intent` text
- `last_seen_at` timestamptz
- `created_at` timestamptz
- `updated_at` timestamptz

### `bot_events`
Purpose:
- append-only event log for analytics and debugging.

Fields:
- `id` bigint generated
- `user_id` bigint
- `chat_id` bigint
- `event_type` text
- `input_type` text
- `intent` text
- `state_before` text
- `state_after` text
- `payload_json` jsonb
- `created_at` timestamptz

### `lead_requests`
Purpose:
- structured lead capture for audit/contact/project requests.

Fields:
- `id` bigint generated
- `user_id` bigint
- `lead_type` text
- `lead_status` text
- `service_interest` text
- `problem_text` text
- `contact_preference` text
- `source_context` text
- `manager_notes` text
- `created_at` timestamptz
- `updated_at` timestamptz

### `chat_sessions`
Purpose:
- live-manager handoff sessions.

Fields:
- `id` bigint generated
- `user_id` bigint not null
- `message_thread_id` bigint not null
- `status` text not null
- `manager_id` bigint
- `handoff_reason` text
- `opened_at` timestamptz
- `closed_at` timestamptz
- `created_at` timestamptz

### `hot_news_digests`
Purpose:
- store generated AI/digital marketing digest items with moderation lifecycle.

Fields:
- `id` bigint generated
- `lang` text
- `title` text
- `digest_text` text
- `source_links_json` jsonb
- `status` text (`draft`, `pending_approval`, `approved`, `rejected`, `published`)
- `created_by_workflow` text
- `created_at` timestamptz
- `approved_by` bigint
- `approved_at` timestamptz
- `published_at` timestamptz
- `published_message_id` bigint

### `bot_content_items`
Purpose:
- store editable menu content blocks (cases, contacts, menu posts) per language.

Fields:
- `id` bigint generated
- `module_key` text
- `item_key` text
- `lang` text
- `title` text
- `body` text
- `media_type` text
- `media_file_id` text
- `sort_order` int
- `is_active` boolean
- `created_at` timestamptz
- `updated_at` timestamptz

### `menu_actions_map`
Purpose:
- optional config table for callback and menu mapping.

Fields:
- `action_key` text primary key
- `action_type` text
- `target_module` text
- `target_state` text
- `lang` text
- `is_active` boolean

### `menu_command_map`
Purpose:
- localized mapping from visible button text or callback payload to a canonical internal intent.

Fields:
- `id` bigint generated
- `lang` text
- `input_value` text
- `input_type` text
- `intent_key` text
- `target_state` text
- `is_active` boolean
- `created_at` timestamptz


## 6. n8n Workflow Topology

Recommended decomposition:

### WF-00 `tg_inbound_gateway`
Trigger:
- Telegram Trigger

Does:
- receives update;
- detects source type;
- calls normalization;
- fetches user state;
- routes into proper module.

### WF-01 `tg_normalize_input`
Does:
- builds canonical payload;
- extracts text/callback/media/thread context;
- enriches with DB state and entry metadata.

### WF-02 `tg_user_state_store`
Does:
- get/create user;
- update `last_seen_at`;
- persist `state`, `lang`, `funnel_stage`;
- return enriched normalized payload.

### WF-03 `tg_navigation_router`
Does:
- resolve localized command-map values into canonical intents;
- resolve command and callback map;
- execute state-aware routing;
- send user into specific module.

### WF-10 `mod_welcome_onboarding`
Does:
- `/start`;
- welcome block;
- first CTA set;
- move user to `main_menu`.

Rule:
- default language is `ru`;
- language switch is offered from `main_menu`, not as mandatory onboarding.

### WF-11 `mod_main_menu`
Does:
- render main menu;
- route to `menu_usecases`, `menu_hot_news`, `menu_contacts`, `menu_creative`, and `change_language`.

Must support:
- localized labels for RU / EN / SR;
- canonical callback keys so button text can vary by language without changing routing logic.

### WF-12 `mod_usecases`
Does:
- render use-cases submenu;
- serve case #1 ... case #4 content from content storage;
- support `back` and `main_menu` from each case page.

### WF-13 `mod_hot_news_reader`
Does:
- fetch latest `published` digest item by user language;
- deliver digest text/media to user;
- fallback gracefully if digest is not yet published.

### WF-14 `mod_contacts`
Does:
- deliver one or multiple contacts/resource posts;
- support inline links/buttons;
- keep content replaceable without router edits.

### WF-15 `mod_creative_dialogue`
Does:
- process free text and voice inputs;
- maintain per-user chat memory in PostgreSQL chat history;
- expose `reset_memory` action;
- support optional escalation to manager.

### WF-16 `mod_hot_news_pipeline_generate`
Does:
- run in separate workflow (cron/manual);
- collect source inputs for AI and digital marketing digest;
- generate digest drafts;
- store drafts with `pending_approval` status;
- notify pre-publication reviewer/admin.

### WF-17 `mod_hot_news_pipeline_moderate_publish`
Does:
- process approve/reject callbacks;
- on approval: mark digest approved/published and send to target channel/feed;
- on reject: keep audit trail with reason.

### WF-20 `mod_human_handoff_proxy`
Does:
- create/find Telegram Topic;
- persist `chat_sessions`;
- relay messages both directions;
- close/reopen session.

### WF-30 `mod_analytics_logger`
Does:
- append events to `bot_events`;
- optionally notify admin on key conversions.

### WF-90 `shared_send_message`
Does:
- unified Telegram send wrapper for text/photo/document/callback answer.

### WF-91 `shared_render_menu`
Does:
- standard menu keyboard rendering by `state`, `lang`, `module`.

### WF-92 `shared_command_map_resolver`
Does:
- convert localized button text and callback payloads into canonical keys;
- support RU / EN / SR variants for the same action;
- allow adding new locales or labels without rewriting main routing logic.

### WF-93 `shared_memory_reset`
Does:
- reset user conversation memory (same pattern as in psychologist bot);
- clear relevant rows in `n8n_chat_histories` by `session_id`;
- confirm reset to user in current language.


## 7. Practical Routing Rules

Recommended priority order:
1. If event is from manager topic and `is_topic_message = true` -> route to `mod_human_handoff_proxy`.
2. If active `chat_sessions.status = open` for user -> route client messages to `mod_human_handoff_proxy`.
3. If event is callback query -> route to `tg_navigation_router`.
4. If event is `/start` or user is new -> route to `mod_welcome_onboarding`.
5. If event is deterministic menu command -> route to mapped module.
6. If state is `creative_chat` and input is text/voice -> route to `mod_creative_dialogue`.
7. If intent is `reset_memory` -> route to `shared_memory_reset`.
8. If event is free text outside creative mode -> route to current deterministic state handler.
9. If event is ambiguous free text -> optionally use AI intent classification fallback.
10. If nothing matches -> return user to main menu with a graceful fallback.


## 8. Reusable Patterns Taken from the Reference Bots

From `Yana Pastel Bot FULL`:
- explicit normalization before business logic;
- `state + language` persisted in PostgreSQL;
- deterministic `ResolveCommand` and `Switch: Navigation`;
- callback-driven menu navigation;
- localized labels resolved into shared navigation logic;
- isolated content branches;
- event-like booking records for important actions.

From `goldman_psy_bot_latviasrv_1`:
- stronger normalized schema with `input_type`, `callback_data`, `intent`, `lang`, timestamps;
- separation of `Input Type Router`, `Intent Router`, and `Callback Router`;
- support for voice/media alongside text;
- usage counters and thresholds;
- AI module used as a specialized branch, not the whole architecture.

What to reuse in the new bot:
- the normalization contract from Goldman;
- the deterministic navigation/state model from Yana;
- the localized command-map principle from Yana, extended from 2 languages to 3;
- the proxy handoff module as a separate business capability;
- one shared schema for commands, callbacks, state transitions, and analytics.


## 9. MVP Module Set

The first build should include only:
- onboarding with default Russian language;
- main menu;
- language switch in main menu;
- use-cases section with 4 case entries;
- hot news reader section;
- contact section;
- creative text/voice dialogue with memory and reset action;
- human handoff proxy;
- analytics logging.

Do not add in MVP unless needed immediately:
- large AI free-chat mode;
- vector search/RAG;
- complex personalization;
- too many content branches;
- broad CRM fan-out.


## 10. Recommended Build Order

Phase 1:
- create DB schema;
- create normalization workflow;
- create localized command map for RU / EN / SR;
- create user state workflow;
- create onboarding and main menu.

Phase 2:
- create use-cases/contact/content branches;
- create hot news read endpoint in bot menu;
- create creative dialogue branch with text/voice handling and memory reset;
- create admin notifications.

Phase 3:
- integrate human handoff proxy with Telegram Topics and `chat_sessions`;
- support media relay and session close.

Phase 4:
- add analytics dashboarding;
- add hot news moderation and publication automation;
- add optional AI intent fallback outside creative module;
- add mini app / booking / CRM sync if needed.


## 11. Architecture Decision Summary

The correct base architecture for this bot is:
- event-driven;
- modular;
- stateful;
- mostly deterministic;
- orchestrated in n8n;
- persisted in PostgreSQL via n8n Credentials;
- extended by independent modules;
- with live-manager handoff as a first-class subsystem rather than an afterthought.

The bot should be treated as a funnel operating system, not just a Telegram chat flow.
