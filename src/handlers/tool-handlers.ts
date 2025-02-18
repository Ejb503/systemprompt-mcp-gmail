import { GmailService } from "../services/gmail-service.js";
import {
  CallToolRequest,
  CallToolResult,
  ListToolsRequest,
  ListToolsResult,
} from "@modelcontextprotocol/sdk/types.js";
import { TOOLS } from "../constants/tools.js";
import {
  ListEmailsArgs,
  GetEmailArgs,
  GetDraftArgs,
  SearchEmailsArgs,
  SendEmailAIArgs,
  SendEmailManualArgs,
  CreateDraftAIArgs,
  EditDraftAIArgs,
  ListDraftsArgs,
  DeleteDraftArgs,
  TrashMessageArgs,
} from "../types/tool-schemas.js";
import { TOOL_ERROR_MESSAGES } from "../constants/tools.js";
import { sendSamplingRequest } from "./sampling.js";
import { handleGetPrompt } from "./prompt-handlers.js";
import { injectVariables } from "../utils/message-handlers.js";
import { gmail_v1 } from "googleapis";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

function validateEmailList(emails: string | string[] | undefined): void {
  if (!emails) return;

  const emailList = Array.isArray(emails) ? emails : emails.split(",").map((e) => e.trim());

  for (const email of emailList) {
    if (!validateEmail(email)) {
      throw new Error(`Invalid email address: ${email}`);
    }
  }
}

export async function handleListTools(request: ListToolsRequest): Promise<ListToolsResult> {
  return { tools: TOOLS };
}

export async function handleToolCall(request: CallToolRequest): Promise<CallToolResult> {
  try {
    switch (request.params.name) {
      case "gmail_list_emails": {
        const gmail = new GmailService();
        const args = request.params.arguments as unknown as ListEmailsArgs;
        const messages = await gmail.listMessages(args.maxResults ?? 5);

        // Format messages into a more concise structure
        const formattedMessages = messages.map((msg: gmail_v1.Schema$Message) => ({
          id: msg.id,
          threadId: msg.threadId,
          snippet: msg.snippet,
          // Extract key headers
          from: msg.payload?.headers?.find((h) => h?.name?.toLowerCase() === "from")?.value,
          to: msg.payload?.headers?.find((h) => h?.name?.toLowerCase() === "to")?.value,
          subject: msg.payload?.headers?.find((h) => h?.name?.toLowerCase() === "subject")?.value,
          date: msg.payload?.headers?.find((h) => h?.name?.toLowerCase() === "date")?.value,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  count: formattedMessages.length,
                  messages: formattedMessages,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case "gmail_get_email": {
        const gmail = new GmailService();
        const args = request.params.arguments as unknown as GetEmailArgs;
        const message = await gmail.getMessage(args.messageId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(message, null, 2),
            },
          ],
        };
      }

      case "gmail_get_draft": {
        const gmail = new GmailService();
        const args = request.params.arguments as unknown as GetDraftArgs;
        const draft = await gmail.getDraft(args.draftId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(draft, null, 2),
            },
          ],
        };
      }

      case "gmail_search_emails": {
        const gmail = new GmailService();
        const args = request.params.arguments as unknown as SearchEmailsArgs;
        const messages = await gmail.searchMessages(args.query, args.maxResults);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(messages, null, 2),
            },
          ],
        };
      }

      case "gmail_send_email_ai": {
        const args = request.params.arguments as unknown as SendEmailAIArgs;
        const { userInstructions, to, replyTo } = args;
        if (!userInstructions) {
          throw new Error(
            "Tool call failed: Missing required parameters - userInstructions is required",
          );
        }

        if (!to) {
          throw new Error("Tool call failed: Missing required parameters - to is required");
        }

        validateEmailList(to);

        let threadContent: string | undefined;
        if (replyTo) {
          const gmail = new GmailService();
          const message = await gmail.getMessage(replyTo);
          threadContent = JSON.stringify(message);
        }

        const prompt = await handleGetPrompt({
          method: "prompts/get",
          params: {
            name: replyTo ? "gmail_reply_email" : "gmail_send_email",
            arguments: {
              userInstructions,
              to,
              ...(replyTo && threadContent
                ? {
                    messageId: replyTo,
                    threadContent,
                  }
                : {}),
            },
          },
        });

        if (!prompt._meta?.responseSchema) {
          throw new Error("Invalid prompt configuration: missing response schema");
        }

        await sendSamplingRequest({
          method: "sampling/createMessage",
          params: {
            messages: prompt.messages.map((msg) =>
              injectVariables(msg, {
                userInstructions,
                to,
                ...(replyTo && threadContent
                  ? {
                      messageId: replyTo,
                      threadContent,
                    }
                  : {}),
              }),
            ) as Array<{
              role: "user" | "assistant";
              content: { type: "text"; text: string };
            }>,
            maxTokens: 100000,
            temperature: 0.7,
            _meta: {
              callback: replyTo ? "reply_email" : "send_email",
              responseSchema: prompt._meta.responseSchema,
            },
            arguments: { userInstructions, to, ...(replyTo ? { messageId: replyTo } : {}) },
          },
        });
        return {
          content: [
            {
              type: "text",
              text: `Your ${replyTo ? "reply" : "email"} request has been received and is being processed, we will notify you when it is complete.`,
            },
          ],
        };
      }

      case "gmail_send_email_manual": {
        const gmail = new GmailService();
        const args = request.params.arguments as unknown as SendEmailManualArgs;
        const { to, subject, body, cc, bcc, isHtml, replyTo } = args;

        validateEmailList(to);
        if (cc) validateEmailList(cc);
        if (bcc) validateEmailList(bcc);

        if (replyTo) {
          await gmail.replyEmail(replyTo, body, isHtml);
        } else {
          if (!subject) {
            throw new Error(
              "Tool call failed: Missing required parameters - subject is required for new emails",
            );
          }
          await gmail.sendEmail({
            to,
            subject,
            body,
            cc,
            bcc,
            isHtml,
          });
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: `${replyTo ? "Reply" : "Email"} sent successfully`,
                to,
              }),
            },
          ],
        };
      }

      case "gmail_create_draft_ai": {
        const args = request.params.arguments as unknown as CreateDraftAIArgs;
        const { userInstructions, to, replyTo } = args;
        if (!userInstructions) {
          throw new Error(
            "Tool call failed: Missing required parameters - userInstructions is required",
          );
        }

        if (!to) {
          throw new Error("Tool call failed: Missing required parameters - to is required");
        }

        validateEmailList(to);

        if (replyTo) {
          const gmail = new GmailService();
          await gmail.getMessage(replyTo);
        }

        const prompt = await handleGetPrompt({
          method: "prompts/get",
          params: {
            name: replyTo ? "gmail_reply_draft" : "gmail_create_draft",
            arguments: { userInstructions, to, ...(replyTo ? { messageId: replyTo } : {}) },
          },
        });

        if (!prompt._meta?.responseSchema) {
          throw new Error("Invalid prompt configuration: missing response schema");
        }

        await sendSamplingRequest({
          method: "sampling/createMessage",
          params: {
            messages: prompt.messages.map((msg) =>
              injectVariables(msg, {
                userInstructions,
                to,
                ...(replyTo ? { messageId: replyTo } : {}),
              }),
            ) as Array<{
              role: "user" | "assistant";
              content: { type: "text"; text: string };
            }>,
            maxTokens: 100000,
            temperature: 0.7,
            _meta: {
              callback: replyTo ? "reply_draft" : "create_draft",
              responseSchema: prompt._meta.responseSchema,
            },
            arguments: { userInstructions, to, ...(replyTo ? { messageId: replyTo } : {}) },
          },
        });
        return {
          content: [
            {
              type: "text",
              text: `Your draft ${replyTo ? "reply" : "email"} request has been received and is being processed, we will notify you when it is complete.`,
            },
          ],
        };
      }

      case "gmail_edit_draft_ai": {
        const args = request.params.arguments as unknown as EditDraftAIArgs;
        const { draftId, userInstructions } = args;
        if (!userInstructions) {
          throw new Error(
            "Tool call failed: Missing required parameters - userInstructions is required",
          );
        }

        if (!draftId) {
          throw new Error("Tool call failed: Missing required parameters - draftId is required");
        }

        const gmail = new GmailService();
        const draft = await gmail.getDraft(draftId);

        const prompt = await handleGetPrompt({
          method: "prompts/get",
          params: {
            name: "gmail_edit_draft",
            arguments: { userInstructions, draftId, draft: JSON.stringify(draft) },
          },
        });

        if (!prompt._meta?.responseSchema) {
          throw new Error("Invalid prompt configuration: missing response schema");
        }

        await sendSamplingRequest({
          method: "sampling/createMessage",
          params: {
            messages: prompt.messages.map((msg) =>
              injectVariables(msg, {
                userInstructions,
                draftId,
                draft: JSON.stringify(draft),
              }),
            ) as Array<{
              role: "user" | "assistant";
              content: { type: "text"; text: string };
            }>,
            maxTokens: 100000,
            temperature: 0.7,
            _meta: {
              callback: "edit_draft",
              responseSchema: prompt._meta.responseSchema,
            },
            arguments: { userInstructions, draftId, draft: JSON.stringify(draft) },
          },
        });
        return {
          content: [
            {
              type: "text",
              text: `Your draft edit request has been received and is being processed, we will notify you when it is complete.`,
            },
          ],
        };
      }

      case "gmail_list_drafts": {
        const gmail = new GmailService();
        const args = request.params.arguments as unknown as ListDraftsArgs;
        const { maxResults } = args;
        const drafts = await gmail.listDrafts(maxResults);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(drafts, null, 2),
            },
          ],
        };
      }

      case "gmail_delete_draft": {
        const gmail = new GmailService();
        const args = request.params.arguments as unknown as DeleteDraftArgs;
        const { draftId } = args;
        await gmail.deleteDraft(draftId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "Draft deleted successfully",
              }),
            },
          ],
        };
      }

      case "gmail_delete_email": {
        const gmail = new GmailService();
        const args = request.params.arguments as unknown as TrashMessageArgs;
        const { messageId } = args;
        await gmail.trashMessage(messageId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "Message moved to trash successfully",
              }),
            },
          ],
        };
      }

      default:
        throw new Error(`${TOOL_ERROR_MESSAGES.UNKNOWN_TOOL} ${request.params.name}`);
    }
  } catch (error) {
    console.error(`${TOOL_ERROR_MESSAGES.TOOL_CALL_FAILED} ${error}`);
    throw error;
  }
}
