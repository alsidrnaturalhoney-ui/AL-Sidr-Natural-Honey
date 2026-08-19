import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "al-sidr-ai-os",
  version: "1.0.0",
});

server.registerResource(
  "system-manifest",
  "alsidr://ai-os/manifest",
  {
    title: "AL SIDR AI OS Manifest",
    description: "Canonical architecture and operating principles.",
    mimeType: "text/markdown",
  },
  async () => ({
    contents: [{
      uri: "alsidr://ai-os/manifest",
      mimeType: "text/markdown",
      text: "KNOWLEDGE → SKILLS → AGENTS → ORCHESTRATOR → TOOLS/MCP/APIs → EXECUTION → QA → MEMORY → CEO INTELLIGENCE",
    }],
  }),
);

server.registerTool(
  "health_check",
  {
    description: "Return a deterministic health result for the AL SIDR AI OS MCP server.",
    inputSchema: z.object({ scope: z.string().default("core") }),
  },
  async ({ scope }) => ({
    content: [{ type: "text", text: JSON.stringify({ ok: true, scope, server: "al-sidr-ai-os", version: "1.0.0" }) }],
  }),
);

server.registerTool(
  "execution_policy",
  {
    description: "Explain the permission policy used by the AL SIDR orchestrator.",
    inputSchema: z.object({}),
  },
  async () => ({
    content: [{
      type: "text",
      text: JSON.stringify({
        read: "automatic",
        reversible_write: "allowed_with_verification",
        production_write: "approval_required_when_material",
        destructive: "explicit_approval_required",
      }),
    }],
  }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
