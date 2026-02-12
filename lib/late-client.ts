/**
 * Late REST API client.
 *
 * Replaces the SDK-based wrapper with direct HTTP calls to the Late API,
 * which supports DMs, conversations, webhooks, and comments.
 *
 * Base URL: https://getlate.dev/api
 * Auth: Bearer token (API key)
 */

const LATE_API_BASE = "https://getlate.dev/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LateAccount {
  _id: string;
  platform: string;
  username: string;
  displayName: string;
  profileUrl: string | null;
  isActive: boolean;
  status: string;
  metadata: Record<string, unknown>;
}

export interface LateConversation {
  id: string;
  platform: string;
  accountId: string;
  participantId: string;
  participantName: string;
  participantPicture: string | null;
  lastMessage: string | null;
  updatedTime: string;
  unreadCount: number;
}

export interface LatePagination {
  hasMore: boolean;
  nextCursor: string | null;
}

export interface LateWebhook {
  _id: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  isActive: boolean;
}

export interface LateComment {
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
}

export interface LatePost {
  id: string;
  platforms?: string[];
  status?: string;
  [key: string]: unknown;
}

export interface LateSendMessageResponse {
  id: string | null;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

class LateAPIError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "LateAPIError";
    this.status = status;
    this.body = body;
  }
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

class LateClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // -----------------------------------------------------------------------
  // Internal fetch helper
  // -----------------------------------------------------------------------

  private async request<T>(
    method: string,
    path: string,
    options?: {
      body?: Record<string, unknown>;
      params?: Record<string, string | number | boolean | undefined>;
    }
  ): Promise<T> {
    const url = new URL(`${LATE_API_BASE}${path}`);

    if (options?.params) {
      for (const [key, value] of Object.entries(options.params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url.toString(), {
      method,
      headers,
      ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
    });

    if (!response.ok) {
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        body = await response.text().catch(() => null);
      }
      throw new LateAPIError(
        `Late API ${method} ${path} failed with status ${response.status}`,
        response.status,
        body
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  // -----------------------------------------------------------------------
  // Accounts
  // -----------------------------------------------------------------------

  accounts = {
    /**
     * List all connected social accounts.
     */
    list: async (): Promise<LateAccount[]> => {
      const res = await this.request<{ accounts: LateAccount[] }>(
        "GET",
        "/v1/accounts"
      );
      return res.accounts;
    },

    /**
     * Get a specific social account by ID.
     * Returns a normalized shape compatible with the old SDK interface.
     */
    get: async (
      accountId: string
    ): Promise<{
      _id: string;
      platform: string;
      username: string | null;
      displayName: string | null;
      profilePicture: string | null;
      profileUrl: string | null;
      isActive: boolean;
      status: string;
      metadata: Record<string, unknown>;
    }> => {
      const res = await this.request<{ account: LateAccount }>(
        "GET",
        `/v1/accounts/${accountId}`
      );
      const a = res.account;
      return {
        _id: a._id,
        platform: a.platform,
        username: a.username || null,
        displayName: a.displayName || a.username || null,
        profilePicture: a.profileUrl || null,
        profileUrl: a.profileUrl || null,
        isActive: a.isActive,
        status: a.status,
        metadata: a.metadata,
      };
    },
  };

  // -----------------------------------------------------------------------
  // Messages / Conversations (DMs)
  // -----------------------------------------------------------------------

  conversations = {
    /**
     * List conversations (inbox).
     */
    list: async (options?: {
      accountId?: string;
      platform?: string;
      limit?: number;
      cursor?: string;
    }): Promise<{
      data: LateConversation[];
      pagination: LatePagination;
    }> => {
      return this.request("GET", "/v1/inbox/conversations", {
        params: {
          accountId: options?.accountId,
          platform: options?.platform,
          limit: options?.limit,
          cursor: options?.cursor,
        },
      });
    },

    /**
     * Get a single conversation's details.
     */
    get: async (
      conversationId: string,
      accountId: string
    ): Promise<LateConversation> => {
      const res = await this.request<{ data: LateConversation }>(
        "GET",
        `/v1/inbox/conversations/${conversationId}`,
        { params: { accountId } }
      );
      return res.data;
    },
  };

  messages = {
    /**
     * Send a direct message through the Late API.
     *
     * Posts to /v1/inbox/conversations/{conversationId}/messages when a
     * conversationId is available, otherwise falls back to sending via
     * the accountId + recipient.
     */
    send: async (
      accountId: string,
      options: {
        to: string;
        text?: string;
        imageUrl?: string;
        conversationId?: string;
      }
    ): Promise<{ id: string | null }> => {
      const body: Record<string, unknown> = {
        accountId,
        message: options.text || "",
      };

      if (options.imageUrl) {
        body.attachments = [{ type: "image", url: options.imageUrl }];
      }

      // If we have a conversation ID, post directly to that conversation
      if (options.conversationId) {
        const res = await this.request<LateSendMessageResponse>(
          "POST",
          `/v1/inbox/conversations/${options.conversationId}/messages`,
          { body }
        );
        return { id: res.id ?? null };
      }

      // Otherwise, include the recipient and let the API route the message
      body.to = options.to;
      const res = await this.request<LateSendMessageResponse>(
        "POST",
        "/v1/inbox/conversations/messages",
        { body }
      );
      return { id: res.id ?? null };
    },
  };

  // -----------------------------------------------------------------------
  // Post history
  // -----------------------------------------------------------------------

  /**
   * Fetch post history. Maps to the Late REST API's posts/history endpoint.
   */
  async history(options?: {
    lastRecords?: number;
    lastDays?: number;
    platform?: string;
    status?: string;
    id?: string;
  }): Promise<LatePost[]> {
    const res = await this.request<{ posts: LatePost[] }>(
      "GET",
      "/v1/posts",
      {
        params: {
          limit: options?.lastRecords,
          days: options?.lastDays,
          platform: options?.platform,
          status: options?.status,
          id: options?.id,
        },
      }
    );
    return res.posts ?? [];
  }

  // -----------------------------------------------------------------------
  // Comments
  // -----------------------------------------------------------------------

  comments = {
    /**
     * Get comments for a given Late post ID.
     */
    get: async (
      postId: string,
      accountId?: string
    ): Promise<{ comments: LateComment[] }> => {
      const res = await this.request<{ comments: LateComment[] }>(
        "GET",
        `/v1/inbox/comments/${postId}`,
        { params: { accountId } }
      );
      return { comments: res.comments ?? [] };
    },

    /**
     * Post a public reply to a specific comment.
     */
    reply: async (options: {
      postId?: string;
      commentId: string;
      platforms: string[];
      comment: string;
      accountId?: string;
    }): Promise<{ status: string }> => {
      const postId = options.postId || options.commentId;
      return this.request("POST", `/v1/inbox/comments/${postId}`, {
        body: {
          accountId: options.accountId,
          message: options.comment,
          commentId: options.commentId,
        },
      });
    },

    /**
     * Send a private DM reply to a commenter (Instagram only).
     */
    privateReply: async (options: {
      postId: string;
      commentId: string;
      accountId: string;
      message: string;
    }): Promise<{ status: string }> => {
      return this.request(
        "POST",
        `/v1/inbox/comments/${options.postId}/${options.commentId}/private-reply`,
        {
          body: {
            accountId: options.accountId,
            message: options.message,
          },
        }
      );
    },
  };

  // -----------------------------------------------------------------------
  // Webhooks
  // -----------------------------------------------------------------------

  webhooks = {
    /**
     * List all registered webhooks.
     */
    list: async (): Promise<LateWebhook[]> => {
      const res = await this.request<{ webhooks: LateWebhook[] }>(
        "GET",
        "/v1/webhooks/settings"
      );
      return res.webhooks;
    },

    /**
     * Create a new webhook.
     */
    create: async (options: {
      accountId?: string;
      name?: string;
      url: string;
      events: string[];
      secret: string;
    }): Promise<{ id: string | null }> => {
      const res = await this.request<{
        success: boolean;
        webhook: LateWebhook;
      }>("POST", "/v1/webhooks/settings", {
        body: {
          name: options.name || "Zernflow webhook",
          url: options.url,
          secret: options.secret,
          events: options.events,
          isActive: true,
        },
      });
      return { id: res.webhook?._id ?? null };
    },

    /**
     * Delete a webhook by ID.
     */
    delete: async (webhookId: string): Promise<void> => {
      await this.request("DELETE", "/v1/webhooks/settings", {
        params: { id: webhookId },
      });
    },
  };
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createLateClient(apiKey: string): LateClient {
  return new LateClient(apiKey);
}
