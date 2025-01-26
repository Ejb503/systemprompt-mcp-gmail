# systemprompt-mcp-gmail

[![npm version](https://img.shields.io/npm/v/systemprompt-mcp-gmail.svg)](https://www.npmjs.com/package/systemprompt-mcp-gmail)
[![smithery badge](https://smithery.ai/badge/@Ejb503/systemprompt-mcp-gmail)](https://smithery.ai/server/@Ejb503/systemprompt-mcp-gmail)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Twitter Follow](https://img.shields.io/twitter/follow/tyingshoelaces_?style=social)](https://twitter.com/tyingshoelaces_)
[![Discord](https://img.shields.io/discord/1255160891062620252?color=7289da&label=discord)](https://discord.com/invite/wkAbSuPWpr)

[Website](https://systemprompt.io) | [Documentation](https://systemprompt.io/documentation) | [Blog](https://tyingshoelaces.com) | [Get API Key](https://systemprompt.io/console)

A specialized Model Context Protocol (MCP) server that enables you to search, read, delete and send emails from your Gmail account, leveraging an AI Agent to help with each operation. The server is designed to work with the [multimodal-mcp-client](https://github.com/Ejb503/multimodal-mcp-client), a voice-powered MCP client that provides the frontend interface.

An API KEY is required to use this server. This is currently free, although this may change in the future. You can get one [here](https://systemprompt.io/console).

This server uses Sampling and Notification functionality from the [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk).

This will only work with advanced MCP clients that support these features.

## Required Client

This server is designed to work with the [multimodal-mcp-client](https://github.com/Ejb503/multimodal-mcp-client) - a voice-powered MCP client that provides the frontend interface. Please make sure to set up both components for the full functionality.

## Why Use This Server?

Send emails
Search emails
Read emails

## Installation

### Installing via Smithery

To install systemprompt-mcp-gmail for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@Ejb503/systemprompt-mcp-gmail):

```bash
npx -y @smithery/cli install @Ejb503/systemprompt-mcp-gmail --client claude
```

This server requires GOOGLE_CREDENTIALS and GOOGLE_TOKEN environment variables to be set. These must be base64 encoded strings of the credentials and token. There is a script to help with this in the [multimodal-mcp-client](https://github.com/Ejb503/multimodal-mcp-client) repository. Follow the instructions here: https://github.com/Ejb503/multimodal-mcp-client/blob/master/scripts/google-auth/README.md

After generating your base64 encoded strings, you can run the server with npx.

## Features

#### Core Functionality

- **MCP Protocol Integration**: Full implementation of Model Context Protocol for seamless AI agent interactions
- **Voice-Powered Interface**: Compatible with voice commands through multimodal-mcp-client
- **Real-Time Processing**: Supports streaming responses and real-time interactions
- **Type-Safe Implementation**: Full TypeScript support with proper error handling

#### Sampling & Notifications

- Advanced sampling capabilities for AI responses
- Real-time notification system for agent events
- Configurable sampling parameters
- Event-driven architecture for notifications

#### Integration Features

- API Key management and authentication
- User status and billing information tracking
- Subscription management
- Usage monitoring and analytics

## 🎥 Demo & Showcase

Watch our video demonstration to see Systemprompt MCP Gmail in action:

[▶️ Watch Demo Video](https://www.youtube.com/watch?v=n94JtRXXqec)

The demo showcases:

- Voice-controlled AI interactions
- Multimodal input processing
- Tool execution and workflow automation
- Real-time voice synthesis

## Installation

## Related Links

- [Multimodal MCP Client](https://github.com/Ejb503/multimodal-mcp-client) - Voice-powered MCP client
- [systemprompt.io Documentation](https://systemprompt.io/docs)
