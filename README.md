# Kovach Bot - Initial n8n Configuration (Sanitized)

Initial architecture and workflow skeletons for a multilingual Telegram bot (`ru/en/sr`) with:
- menu command map in PostgreSQL,
- use cases section,
- hot news reader + moderation pipeline skeleton,
- contacts section,
- creative dialogue section (text/voice) with memory reset pattern.

## Files
- `telegram_bot_architecture.md` - architecture and module map.
- `kovach_bot_schema.sql` - DB schema + seed data for command map.
- `n8n_kovach_bot_db_setup_once.json` - one-time DB init workflow (`Manual Trigger -> Postgres Execute Query`).
- `n8n_telegram_funnel_bot_mvp_skeleton.json` - main bot workflow skeleton.
- `n8n_hot_news_pipeline_skeleton.json` - draft/moderation/publication pipeline skeleton.
- `bot_user_flow_scenario_ru.md` - user flow description in Russian.

## Sensitive Data
Sensitive values are intentionally **not** committed.

Set these manually in n8n after import:
- PostgreSQL credential: `kovach_bot_db`
- Telegram credentials on Telegram nodes
- Hot news reviewer chat id in:
  - `Telegram - Notify Reviewer With Draft` (`REVIEWER_CHAT_ID`)
  - `Telegram - Confirm Moderation Result` fallback reviewer id
- Publication destination in:
  - `Telegram - Publish Digest Message` (`TARGET_CHANNEL_OR_CHAT_ID`)

## Notes
- `talk_to_manager` is not exposed as a separate main-menu button in this version.
- Handoff can be triggered by dialogue logic or later rule-based escalation.
