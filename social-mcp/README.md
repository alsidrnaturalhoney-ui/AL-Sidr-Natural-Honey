# AL SIDR Unified Social MCP

First-party MCP server for Instagram, Facebook, Pinterest, Telegram, X, and Threads.

## Install

```bash
cd social-mcp
npm install
cp .env.example .env
npm run check
npm run dev
```

## Credentials
Use brand-owned official API credentials only. Never commit `.env`.

- Meta: `META_ACCESS_TOKEN`, `INSTAGRAM_BUSINESS_ACCOUNT_ID`, `FACEBOOK_PAGE_ID`
- Pinterest: `PINTEREST_ACCESS_TOKEN`
- Telegram: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- X: `X_BEARER_TOKEN`
- Threads: `THREADS_ACCESS_TOKEN`, `THREADS_USER_ID`

## Current tools
- `social_config_status`
- `instagram_get_profile`
- `facebook_get_page`
- `pinterest_get_user_account`
- `telegram_send_message`
- `x_get_me`
- `threads_get_profile`
- `social_publish_text` for Facebook, Telegram, Threads

Instagram media publishing, Pinterest Pin creation, and X posting need media/upload or OAuth/write-scope flows and should be added after the corresponding app permissions are configured.
