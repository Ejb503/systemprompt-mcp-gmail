import { SamplingPrompt } from "../types/sampling.js";
import { EMAIL_SEND_INSTRUCTIONS } from "./instructions.js";
import {
  EMAIL_SEND_RESPONSE_SCHEMA,
  EMAIL_REPLY_RESPONSE_SCHEMA,
  DRAFT_EMAIL_RESPONSE_SCHEMA,
} from "../types/sampling-schemas.js";

const promptArgs = [
  {
    name: "userInstructions",
    description: "Instructions for the email operation",
    required: true,
  },
];

// Email Send Prompt
export const SEND_EMAIL_PROMPT: SamplingPrompt = {
  name: "gmail_send_email",
  description: "Sends an email or reply based on user instructions",
  arguments: [
    ...promptArgs,
    {
      name: "to",
      description: "Recipient email address(es)",
      required: true,
    },
    {
      name: "messageId",
      description: "Optional message ID to reply to",
      required: false,
    },
  ],
  messages: [
    {
      role: "assistant",
      content: {
        type: "text",
        text: EMAIL_SEND_INSTRUCTIONS,
      },
    },
    {
      role: "user",
      content: {
        type: "text",
        text: `<input>
          <userInstructions>{{userInstructions}}</userInstructions>
          <to>{{to}}</to>
          {{#messageId}}<replyTo>{{messageId}}</replyTo>{{/messageId}}
        </input>`,
      },
    },
  ],
  _meta: {
    callback: "send_email",
    responseSchema: EMAIL_SEND_RESPONSE_SCHEMA,
  },
};

// Email Send Prompt
export const REPLY_EMAIL_PROMPT: SamplingPrompt = {
  name: "gmail_reply_email",
  description: "Sends an email or reply based on user instructions",
  arguments: [
    ...promptArgs,
    {
      name: "to",
      description: "Recipient email address(es)",
      required: true,
    },
    {
      name: "messageId",
      description: "Optional message ID to reply to",
      required: false,
    },
  ],
  messages: [
    {
      role: "assistant",
      content: {
        type: "text",
        text: EMAIL_SEND_INSTRUCTIONS,
      },
    },
    {
      role: "assistant",
      content: {
        type: "text",
        text: `<History>
          <threadContent>{{threadContent}}</threadContent>
        </History>`,
      },
    },
    {
      role: "user",
      content: {
        type: "text",
        text: `<input>
          <userInstructions>{{userInstructions}}</userInstructions>
          <to>{{to}}</to>
          <replyTo>{{messageId}}</replyTo>
        </input>`,
      },
    },
  ],
  _meta: {
    callback: "reply_email",
    responseSchema: EMAIL_REPLY_RESPONSE_SCHEMA,
  },
};

// Email Send Prompt
export const REPLY_DRAFT_PROMPT: SamplingPrompt = {
  name: "gmail_reply_draft",
  description: "Replies to a draft email based on user instructions",
  arguments: [
    ...promptArgs,
    {
      name: "to",
      description: "Recipient email address(es)",
      required: true,
    },
    {
      name: "messageId",
      description: "Optional message ID to reply to",
      required: false,
    },
  ],
  messages: [
    {
      role: "assistant",
      content: {
        type: "text",
        text: EMAIL_SEND_INSTRUCTIONS,
      },
    },
    {
      role: "user",
      content: {
        type: "text",
        text: `<input>
          <userInstructions>{{userInstructions}}</userInstructions>
          <to>{{to}}</to>
          {{#messageId}}<replyTo>{{messageId}}</replyTo>{{/messageId}}
        </input>`,
      },
    },
  ],
  _meta: {
    callback: "reply_draft",
    responseSchema: DRAFT_EMAIL_RESPONSE_SCHEMA,
  },
};

// Email Send Prompt
export const EDIT_DRAFT_PROMPT: SamplingPrompt = {
  name: "gmail_edit_draft",
  description: "Edits a draft email based on user instructions",
  arguments: [
    ...promptArgs,
    {
      name: "to",
      description: "Recipient email address(es)",
      required: true,
    },
    {
      name: "messageId",
      description: "Optional message ID to reply to",
      required: false,
    },
  ],
  messages: [
    {
      role: "assistant",
      content: {
        type: "text",
        text: EMAIL_SEND_INSTRUCTIONS,
      },
    },
    {
      role: "user",
      content: {
        type: "text",
        text: `<input>
          <userInstructions>{{userInstructions}}</userInstructions>
          <to>{{to}}</to>
          {{#messageId}}<replyTo>{{messageId}}</replyTo>{{/messageId}}
        </input>`,
      },
    },
  ],
  _meta: {
    callback: "edit_draft",
    responseSchema: DRAFT_EMAIL_RESPONSE_SCHEMA,
  },
};

// Create Draft Prompt
export const CREATE_DRAFT_PROMPT: SamplingPrompt = {
  name: "gmail_create_draft",
  description: "Creates a draft email based on user instructions",
  arguments: [
    ...promptArgs,
    {
      name: "to",
      description: "Recipient email address(es)",
      required: true,
    },
  ],
  messages: [
    {
      role: "assistant",
      content: {
        type: "text",
        text: EMAIL_SEND_INSTRUCTIONS,
      },
    },
    {
      role: "user",
      content: {
        type: "text",
        text: `<input>
          <userInstructions>{{userInstructions}}</userInstructions>
          <to>{{to}}</to>
        </input>`,
      },
    },
  ],
  _meta: {
    callback: "create_draft",
    responseSchema: DRAFT_EMAIL_RESPONSE_SCHEMA,
  },
};

// Export all prompts
export const PROMPTS = [
  SEND_EMAIL_PROMPT,
  REPLY_EMAIL_PROMPT,
  REPLY_DRAFT_PROMPT,
  EDIT_DRAFT_PROMPT,
  CREATE_DRAFT_PROMPT,
];
