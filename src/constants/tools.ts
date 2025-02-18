import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const TOOL_ERROR_MESSAGES = {
  UNKNOWN_TOOL: "Unknown tool:",
  TOOL_CALL_FAILED: "Tool call failed:",
} as const;

export const TOOL_RESPONSE_MESSAGES = {
  ASYNC_PROCESSING: "Request is being processed asynchronously",
} as const;

export const TOOLS: Tool[] = [
  {
    name: "gmail_list_emails",
    description: "Lists recent Gmail messages from the user's inbox with optional filtering.",
    inputSchema: {
      type: "object",
      properties: {
        maxResults: {
          type: "number",
          description:
            "Maximum number of emails to return. Default 5. Never more than 10, for token limits.",
        },
        after: {
          type: "string",
          description:
            "Return emails after this date. Format: YYYY/MM/DD or RFC3339 timestamp (e.g. 2024-03-20T10:00:00Z)",
        },
        before: {
          type: "string",
          description:
            "Return emails before this date. Format: YYYY/MM/DD or RFC3339 timestamp (e.g. 2024-03-20T10:00:00Z)",
        },
        sender: {
          type: "string",
          description: "Filter emails by sender email address. Can be a partial match.",
        },
        to: {
          type: "string",
          description: "Filter emails by recipient email address. Can be a partial match.",
        },
        subject: {
          type: "string",
          description: "Filter emails by subject line. Can be a partial match.",
        },
        hasAttachment: {
          type: "boolean",
          description:
            "If true, only return emails with attachments. If false, only return emails without attachments.",
        },
        label: {
          type: "string",
          description:
            "Filter emails by Gmail label name (e.g. 'INBOX', 'SENT', 'IMPORTANT', or custom labels).",
        },
      },
    },
  },
  {
    name: "gmail_get_email",
    description: "Retrieves the full content of a specific Gmail message by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description:
            "The unique ID of the Gmail message to retrieve. This can be obtained from list_emails or search_messages results.",
        },
      },
      required: ["messageId"],
    },
  },
  {
    name: "gmail_search_emails",
    description: "Searches Gmail messages using Gmail's search syntax.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Gmail search query using Gmail's search operators (e.g. 'from:example@gmail.com has:attachment')",
        },
        maxResults: {
          type: "number",
          description:
            "Maximum number of search results to return. Defaults to 10 if not specified.",
        },
        after: {
          type: "string",
          description:
            "Return emails after this date. Format: YYYY/MM/DD or RFC3339 timestamp (e.g. 2024-03-20T10:00:00Z)",
        },
        before: {
          type: "string",
          description:
            "Return emails before this date. Format: YYYY/MM/DD or RFC3339 timestamp (e.g. 2024-03-20T10:00:00Z)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "gmail_send_email_ai",
    description:
      "Uses AI to generate and send an email or reply based on user instructions. User must specify AI or manual. This is AI.",
    inputSchema: {
      type: "object",
      properties: {
        to: {
          type: "string",
          description:
            "Recipient email address(es). Multiple addresses can be comma-separated. Must be a valid email address",
        },
        userInstructions: {
          type: "string",
          description:
            "Detailed user instructions for an AI system to generate a HTML email. Should be a description of the email contents used to guide AI to generate the content.",
        },
        replyTo: {
          type: "string",
          description:
            "Optional message ID to reply to. If provided, this will be treated as a reply to that email",
        },
      },
      required: ["to", "userInstructions"],
    },
  },
  {
    name: "gmail_send_email_manual",
    description:
      "Sends an email or reply with the provided content directly. User must specify AI or manual. This is manual.",
    inputSchema: {
      type: "object",
      properties: {
        to: {
          type: "string",
          description: "Recipient email address(es). Multiple addresses can be comma-separated.",
        },
        subject: {
          type: "string",
          description: "Email subject line. Not required if this is a reply (replyTo is provided)",
        },
        body: {
          type: "string",
          description: "Email body content",
        },
        cc: {
          type: "string",
          description: "CC recipient email address(es)",
        },
        bcc: {
          type: "string",
          description: "BCC recipient email address(es)",
        },
        isHtml: {
          type: "boolean",
          description: "Whether the body content is HTML",
        },
        replyTo: {
          type: "string",
          description:
            "Optional message ID to reply to. If provided, this will be treated as a reply to that email",
        },
      },
      required: ["to", "body"],
    },
  },
  {
    name: "gmail_trash_message",
    description: "Moves a Gmail message to the trash by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description:
            "The unique ID of the Gmail message to move to trash. This can be obtained from list_emails or search_messages results.",
        },
      },
      required: ["messageId"],
    },
  },
  {
    name: "gmail_get_draft",
    description: "Retrieves the full content of a specific Gmail draft by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        draftId: {
          type: "string",
          description:
            "The unique ID of the Gmail draft to retrieve. This can be obtained from list_drafts results.",
        },
      },
      required: ["draftId"],
    },
  },
  {
    name: "gmail_create_draft_ai",
    description:
      "Uses AI to generate and send an email or reply based on user instructions. User must specify AI or manual. This is AI.",
    inputSchema: {
      type: "object",
      properties: {
        to: {
          type: "string",
          description:
            "Recipient email address(es). Multiple addresses can be comma-separated. Must be a valid email address",
        },
        userInstructions: {
          type: "string",
          description:
            "Detailed user instructions for an AI system to generate a HTML email. Should be a description of the email contents used to guide AI to generate the content.",
        },
        replyTo: {
          type: "string",
          description:
            "Optional message ID to reply to. If provided, this will be treated as a reply to that email",
        },
      },
      required: ["to", "userInstructions"],
    },
  },
  {
    name: "gmail_edit_draft_ai",
    description:
      "Uses AI to generate and send an email or reply based on user instructions. User must specify AI or manual. This is AI.",
    inputSchema: {
      type: "object",
      properties: {
        draftId: {
          type: "string",
          description: "The ID of the draft email to edit",
        },
        userInstructions: {
          type: "string",
          description:
            "Detailed user instructions for an AI system to generate a HTML email. Should be a description of the email contents used to guide AI to generate the content.",
        },
      },
      required: ["draftId", "userInstructions"],
    },
  },

  {
    name: "gmail_list_drafts",
    description: "Lists all draft emails in the user's account.",
    inputSchema: {
      type: "object",
      properties: {
        maxResults: {
          type: "number",
          description: "Maximum number of draft emails to return. Defaults to 10 if not specified.",
        },
      },
    },
  },
  {
    name: "gmail_delete_draft",
    description: "Deletes a draft email by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        draftId: {
          type: "string",
          description:
            "The unique ID of the draft email to delete. This can be obtained from list_drafts results.",
        },
      },
      required: ["draftId"],
    },
  },
];
