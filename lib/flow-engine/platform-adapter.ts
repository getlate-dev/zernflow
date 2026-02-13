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

interface CarouselElement {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  buttons?: Button[];
}

interface MessageContent {
  text?: string;
  imageUrl?: string;
  quickReplies?: QuickReply[];
  buttons?: Button[];
  carousel?: { elements: CarouselElement[] };
}

interface AdaptedMessage {
  text: string;
  imageUrl?: string;
  quickReplies?: QuickReply[];
  buttons?: Button[];
  /** Generic template carousel (Facebook/Instagram) */
  template?: {
    type: "generic";
    elements: Array<{
      title: string;
      subtitle?: string;
      imageUrl?: string;
      buttons?: Array<{
        type: "url" | "postback";
        title: string;
        url?: string;
        payload?: string;
      }>;
    }>;
  };
  /** Telegram-native keyboard markup */
  replyMarkup?: {
    type: "inline_keyboard" | "reply_keyboard";
    keyboard: Array<
      Array<{ text: string; callbackData?: string; url?: string }>
    >;
    oneTime?: boolean;
  };
}

/**
 * Adapts rich message content to work across different platforms.
 * Facebook/Instagram: Full support for quick replies, buttons, carousels.
 * Telegram: Buttons become inline keyboard, carousels become multiple messages.
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
  const result: AdaptedMessage = {
    text: content.text || "",
    imageUrl: content.imageUrl,
  };

  // Carousel takes priority: send as generic template
  if (content.carousel?.elements?.length) {
    result.template = {
      type: "generic",
      elements: content.carousel.elements.map((el) => ({
        title: el.title,
        subtitle: el.subtitle,
        imageUrl: el.imageUrl,
        buttons: el.buttons?.map((btn) => ({
          type: btn.type,
          title: btn.title,
          url: btn.url,
          payload: btn.payload,
        })),
      })),
    };
    return result;
  }

  // Pass through buttons and quick replies for the SDK
  if (content.buttons?.length) {
    result.buttons = content.buttons;
  }
  if (content.quickReplies?.length) {
    result.quickReplies = content.quickReplies;
  }

  return result;
}

function adaptForTelegram(content: MessageContent): AdaptedMessage {
  const text = content.text || "";

  // Carousel: fall back to text with numbered cards
  if (content.carousel?.elements?.length) {
    return adaptCarouselToText(content.carousel.elements, text, content.imageUrl);
  }

  // Convert buttons to inline keyboard format
  if (content.buttons?.length) {
    return {
      text,
      imageUrl: content.imageUrl,
      replyMarkup: {
        type: "inline_keyboard",
        keyboard: content.buttons.map((btn) => [
          {
            text: btn.title,
            ...(btn.type === "url"
              ? { url: btn.url }
              : { callbackData: btn.payload }),
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
        type: "reply_keyboard",
        keyboard: content.quickReplies.map((qr) => [{ text: qr.title }]),
        oneTime: true,
      },
    };
  }

  return { text, imageUrl: content.imageUrl };
}

function adaptForTextOnly(content: MessageContent): AdaptedMessage {
  let text = content.text || "";

  // Carousel: fall back to text with numbered cards
  if (content.carousel?.elements?.length) {
    return adaptCarouselToText(content.carousel.elements, text, content.imageUrl);
  }

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
 * Convert carousel elements to a text-based fallback for platforms
 * that don't support rich carousels.
 */
function adaptCarouselToText(
  elements: CarouselElement[],
  baseText: string,
  imageUrl?: string
): AdaptedMessage {
  const cards = elements.map((el, i) => {
    let card = `${i + 1}. ${el.title}`;
    if (el.subtitle) card += `\n   ${el.subtitle}`;
    if (el.buttons?.length) {
      el.buttons.forEach((btn) => {
        if (btn.type === "url" && btn.url) {
          card += `\n   ${btn.title}: ${btn.url}`;
        } else {
          card += `\n   ${btn.title}`;
        }
      });
    }
    return card;
  });

  const text = baseText
    ? `${baseText}\n\n${cards.join("\n\n")}`
    : cards.join("\n\n");

  return { text, imageUrl };
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
