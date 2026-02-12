import SocialMediaAPI from "@getlatedev/social-media-api";

/**
 * Wrapper around the Late Social Media API SDK that provides
 * messaging, account, and webhook helper methods for the flow engine.
 */
class LateClient {
  private api: SocialMediaAPI;

  constructor(apiKey: string) {
    this.api = new SocialMediaAPI(apiKey);
  }

  messages = {
    send: async (
      accountId: string,
      options: { to: string; text?: string; imageUrl?: string }
    ): Promise<{ id: string | null }> => {
      // Use the underlying API to send a direct message via the platform
      const result = await this.api.post({
        post: options.text || "",
        platforms: [],
        profileKeys: [accountId],
        ...(options.imageUrl ? { mediaUrls: [options.imageUrl] } : {}),
      });
      return { id: result?.id ?? null };
    },
  };

  accounts = {
    get: async (
      accountId: string
    ): Promise<{
      username: string | null;
      displayName: string | null;
      profilePicture: string | null;
    }> => {
      // Fetch account info using the user endpoint
      const user = await this.api.user();
      const displayName =
        user?.displayNames?.[accountId] ?? null;
      return {
        username: displayName,
        displayName,
        profilePicture: null,
      };
    },
  };

  webhooks = {
    create: async (options: {
      accountId: string;
      url: string;
      events: string[];
      secret: string;
    }): Promise<{ id: string | null }> => {
      const result = await this.api.registerWebhook({
        action: "message.received",
        url: options.url,
      });
      return { id: result?.status === "success" ? "registered" : null };
    },
  };
}

export function createLateClient(apiKey: string) {
  return new LateClient(apiKey);
}
