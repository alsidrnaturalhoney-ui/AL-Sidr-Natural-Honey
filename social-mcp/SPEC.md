# AL SIDR Unified Social MCP

## Value Proposition
Provide one MCP server for Al Sidr Natural Honey to inspect and act on brand-owned social channels without exposing credentials to the assistant.

## Core Actions
1. Check connector configuration without revealing secrets.
2. Read connected account/profile data for Instagram, Facebook, Pinterest, X and Threads.
3. Publish text to supported brand channels with explicit platform-scoped write tools; Telegram uses Bot API.

## Why MCP / LLM
Natural-language intent can route one request to the correct social platform while the MCP server holds platform-specific API logic and credentials. The assistant does not receive token values.

## Product Context
- Instagram + Facebook: official Meta Graph API.
- Threads: official Threads API on graph.threads.net.
- Pinterest: official Pinterest API v5.
- Telegram: official Telegram Bot API.
- X: X API v2.
- No scraping, cookie-session automation, or private-account bypasses in the first-party server.

## Security
- Credentials are environment variables only and never returned by tools.
- `social_config_status` returns missing variable names, not values.
- Writes are exposed only as explicit tools; read profile tools are separate.
- Third-party MCP servers are not automatically trusted. PolicyLayer precheck must succeed before any third-party server is connected.

## Deployment
The current implementation uses MCP stdio transport for Brainbase/local agent hosting. A future HTTP transport may be added for remote hosting after authentication and deployment architecture are verified.
