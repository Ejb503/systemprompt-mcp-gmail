import { Implementation, ServerCapabilities } from "@modelcontextprotocol/sdk/types.js";

export const serverConfig: Implementation = {
  name: "systemprompt-mcp-gmail",
  version: "1.0.10",
  metadata: {
    name: "System Prompt MCP Gmail",
    description:
      "A specialized Model Context Protocol (MCP) server that enables you to search, read, delete and send emails from your Gmail account, leveraging an AI Agent to help with each operation.",
    icon: "solar:align-horizontal-center-line-duotone",
    color: "primary",
    serverStartTime: Date.now(),
    environment: process.env.NODE_ENV,
    customData: {
      serverFeatures: ["agent", "prompts", "systemprompt"],
    },
  },
};

export const serverCapabilities: { capabilities: ServerCapabilities } = {
  capabilities: {
    resources: {
      listChanged: true,
    },
    tools: {},
    prompts: {
      listChanged: true,
    },
    sampling: {},
    logging: {},
  },
};
