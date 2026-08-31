import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'al-sidr-social-mcp',
  version: '0.1.0'
});

const Platform = z.enum(['instagram','facebook','pinterest','telegram','x','threads']);

const requiredEnv: Record<z.infer<typeof Platform>, string[]> = {
  instagram: ['META_ACCESS_TOKEN','INSTAGRAM_BUSINESS_ACCOUNT_ID'],
  facebook: ['META_ACCESS_TOKEN','FACEBOOK_PAGE_ID'],
  pinterest: ['PINTEREST_ACCESS_TOKEN'],
  telegram: ['TELEGRAM_BOT_TOKEN','TELEGRAM_CHAT_ID'],
  x: ['X_BEARER_TOKEN'],
  threads: ['THREADS_ACCESS_TOKEN','THREADS_USER_ID']
};

function configStatus(platform: z.infer<typeof Platform>) {
  const needed = requiredEnv[platform];
  const missing = needed.filter((key) => !process.env[key]);
  return { platform, configured: missing.length === 0, missing };
}

async function jsonFetch(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const text = await res.text();
  let body: unknown;
  try { body = JSON.parse(text); } catch { body = text; }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${text.slice(0, 500)}`);
  return body;
}

server.tool('social_config_status', 'Check which social connectors are configured without revealing secrets.', {
  platform: Platform.optional()
}, async ({ platform }) => ({
  content: [{ type: 'text', text: JSON.stringify(platform ? configStatus(platform) : Platform.options.map(configStatus), null, 2) }]
}));

server.tool('instagram_get_profile', 'Read the connected Instagram Business/Creator profile via Meta Graph API.', {}, async () => {
  const { configured, missing } = configStatus('instagram');
  if (!configured) throw new Error(`Instagram not configured. Missing: ${missing.join(', ')}`);
  const id = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!;
  const token = process.env.META_ACCESS_TOKEN!;
  const url = `https://graph.facebook.com/v23.0/${id}?fields=id,username,name,biography,website,followers_count,follows_count,media_count&access_token=${encodeURIComponent(token)}`;
  return { content: [{ type: 'text', text: JSON.stringify(await jsonFetch(url), null, 2) }] };
});

server.tool('facebook_get_page', 'Read the connected Facebook Page profile.', {}, async () => {
  const { configured, missing } = configStatus('facebook');
  if (!configured) throw new Error(`Facebook not configured. Missing: ${missing.join(', ')}`);
  const id = process.env.FACEBOOK_PAGE_ID!;
  const token = process.env.META_ACCESS_TOKEN!;
  const url = `https://graph.facebook.com/v23.0/${id}?fields=id,name,about,link,fan_count,followers_count&access_token=${encodeURIComponent(token)}`;
  return { content: [{ type: 'text', text: JSON.stringify(await jsonFetch(url), null, 2) }] };
});

server.tool('telegram_send_message', 'Send a message to the configured Telegram chat/channel using the Bot API.', {
  text: z.string().min(1).max(4096)
}, async ({ text }) => {
  const { configured, missing } = configStatus('telegram');
  if (!configured) throw new Error(`Telegram not configured. Missing: ${missing.join(', ')}`);
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const chatId = process.env.TELEGRAM_CHAT_ID!;
  const body = await jsonFetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text })
  });
  return { content: [{ type: 'text', text: JSON.stringify(body, null, 2) }] };
});

server.tool('pinterest_get_user_account', 'Read the authenticated Pinterest user account.', {}, async () => {
  const { configured, missing } = configStatus('pinterest');
  if (!configured) throw new Error(`Pinterest not configured. Missing: ${missing.join(', ')}`);
  const token = process.env.PINTEREST_ACCESS_TOKEN!;
  const body = await jsonFetch('https://api.pinterest.com/v5/user_account', { headers: { Authorization: `Bearer ${token}` } });
  return { content: [{ type: 'text', text: JSON.stringify(body, null, 2) }] };
});

server.tool('x_get_me', 'Read the authenticated X account using API v2.', {}, async () => {
  const { configured, missing } = configStatus('x');
  if (!configured) throw new Error(`X not configured. Missing: ${missing.join(', ')}`);
  const token = process.env.X_BEARER_TOKEN!;
  const body = await jsonFetch('https://api.x.com/2/users/me?user.fields=id,name,username,description,public_metrics', { headers: { Authorization: `Bearer ${token}` } });
  return { content: [{ type: 'text', text: JSON.stringify(body, null, 2) }] };
});

server.tool('threads_get_profile', 'Read the connected Threads profile.', {}, async () => {
  const { configured, missing } = configStatus('threads');
  if (!configured) throw new Error(`Threads not configured. Missing: ${missing.join(', ')}`);
  const id = process.env.THREADS_USER_ID!;
  const token = process.env.THREADS_ACCESS_TOKEN!;
  const url = `https://graph.threads.net/v1.0/${id}?fields=id,username,name,threads_profile_picture_url,threads_biography&access_token=${encodeURIComponent(token)}`;
  return { content: [{ type: 'text', text: JSON.stringify(await jsonFetch(url), null, 2) }] };
});

server.tool('social_publish_text', 'Publish text where the platform API supports a direct text endpoint. Writes are explicit and platform-scoped.', {
  platform: z.enum(['facebook','telegram','threads']),
  text: z.string().min(1).max(5000)
}, async ({ platform, text }) => {
  if (platform === 'telegram') {
    const { configured, missing } = configStatus('telegram');
    if (!configured) throw new Error(`Telegram not configured. Missing: ${missing.join(', ')}`);
    const body = await jsonFetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN!}/sendMessage`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID!, text })
    });
    return { content: [{ type: 'text', text: JSON.stringify(body, null, 2) }] };
  }
  if (platform === 'facebook') {
    const { configured, missing } = configStatus('facebook');
    if (!configured) throw new Error(`Facebook not configured. Missing: ${missing.join(', ')}`);
    const params = new URLSearchParams({ message: text, access_token: process.env.META_ACCESS_TOKEN! });
    const body = await jsonFetch(`https://graph.facebook.com/v23.0/${process.env.FACEBOOK_PAGE_ID!}/feed`, {
      method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: params
    });
    return { content: [{ type: 'text', text: JSON.stringify(body, null, 2) }] };
  }
  const { configured, missing } = configStatus('threads');
  if (!configured) throw new Error(`Threads not configured. Missing: ${missing.join(', ')}`);
  const token = process.env.THREADS_ACCESS_TOKEN!;
  const userId = process.env.THREADS_USER_ID!;
  const create = await jsonFetch(`https://graph.threads.net/v1.0/${userId}/threads`, {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ media_type: 'TEXT', text, access_token: token })
  }) as { id?: string };
  if (!create.id) throw new Error('Threads media container id missing');
  const publish = await jsonFetch(`https://graph.threads.net/v1.0/${userId}/threads_publish`, {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ creation_id: create.id, access_token: token })
  });
  return { content: [{ type: 'text', text: JSON.stringify(publish, null, 2) }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
