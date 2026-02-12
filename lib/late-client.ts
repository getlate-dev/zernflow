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

  /**
   * Fetch post history. Proxies directly to the SDK's history() method.
   */
  async history(options?: {
    lastRecords?: number;
    lastDays?: number;
    platform?: string;
    status?: string;
    id?: string;
  }) {
    return this.api.history(options);
  }

  comments = {
    /**
     * Fetch comments for a given Late post ID.
     * Returns an array of comment objects from the underlying API.
     */
    get: async (
      postId: string
    ): Promise<{
      comments: Array<{
        id: string;
        comment: string;
        created: string;
        platform: string;
        commenter?: {
          id?: string;
          name?: string;
          username?: string;
        };
        [key: string]: unknown;
      }>;
    }> => {
      const result = await this.api.getComments({ id: postId });
      return { comments: result?.comments ?? [] };
    },

    /**
     * Post a reply to a specific comment.
     */
    reply: async (options: {
      commentId: string;
      platforms: string[];
      comment: string;
    }): Promise<{ status: string }> => {
      return this.api.replyComment({
        commentId: options.commentId,
        platforms: options.platforms,
        comment: options.comment,
      });
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
