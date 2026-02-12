import type { Platform } from "@/lib/types/database";

interface QuickReply {
  title: string;
  payload: string;
}

interface Button {
  title: string;
  type: "postback" | "url";
  payload?: string;
  url?: string;
}

interface MessageContent {
  text?: string;
  imageUrl?: string;
  quickReplies?: QuickReply[];
  buttons?: Button[];
}

interface AdaptedMessage {
  text: string;
  imageUrl?: string;
  // Platform-specific fields handled by Late SDK
  replyMarkup?: unknown;
}

/**
 * Adapts rich message content to work across different platforms.
 * Facebook/Instagram: Full support for quick replies, buttons, etc.
 * Telegram: Buttons become inline keyboard.
 * Twitter/X, Bluesky, Reddit: Interactive elements become numbered text options.
 */
export function adaptMessage(
  content: MessageContent,
  platform: Platform
): AdaptedMessage {
  switch (platform) {
    case "facebook":
    case "instagram":
      return adaptForMeta(content);
    case "telegram":
      return adaptForTelegram(content);
    case "twitter":
    case "bluesky":
    case "reddit":
    default:
      return adaptForTextOnly(content);
  }
}

function adaptForMeta(content: MessageContent): AdaptedMessage {
  // Meta platforms support rich messages natively
  return {
    text: content.text || "",
    imageUrl: content.imageUrl,
  };
}

function adaptForTelegram(content: MessageContent): AdaptedMessage {
  let text = content.text || "";

  // Convert buttons to inline keyboard format
  if (content.buttons?.length) {
    return {
      text,
      imageUrl: content.imageUrl,
      replyMarkup: {
        inline_keyboard: content.buttons.map((btn) => [
          {
            text: btn.title,
            ...(btn.type === "url"
              ? { url: btn.url }
              : { callback_data: btn.payload }),
          },
        ]),
      },
    };
  }

  // Convert quick replies to reply keyboard
  if (content.quickReplies?.length) {
    return {
      text,
      imageUrl: content.imageUrl,
      replyMarkup: {
        keyboard: content.quickReplies.map((qr) => [{ text: qr.title }]),
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };
  }

  return { text, imageUrl: content.imageUrl };
}

function adaptForTextOnly(content: MessageContent): AdaptedMessage {
  let text = content.text || "";

  // Convert buttons/quick replies to numbered text options
  const options = content.buttons || content.quickReplies;
  if (options?.length) {
    const optionsList = options
      .map((opt, i) => `${i + 1}. ${opt.title}`)
      .join("\n");
    text = text ? `${text}\n\n${optionsList}` : optionsList;
  }

  return { text, imageUrl: content.imageUrl };
}

/**
 * Parse a numbered response (e.g., "1" or "2") back to a quick reply payload.
 */
export function parseNumberedResponse(
  text: string,
  options: QuickReply[]
): string | null {
  const num = parseInt(text.trim(), 10);
  if (isNaN(num) || num < 1 || num > options.length) return null;
  return options[num - 1].payload;
}
