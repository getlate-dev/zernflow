/**
 * Late API client.
 *
 * Uses the official @getlatedev/social-media-api SDK for all supported methods.
 * Only adds direct API calls for DM/inbox endpoints not yet in the SDK.
 */

import SocialMediaAPI from "@getlatedev/social-media-api";

const LATE_API_BASE = "https://getlate.dev/api";

// ---------------------------------------------------------------------------
// Types for DM/inbox (not in SDK)
// ---------------------------------------------------------------------------

export interface LateSendMessageResponse {
  success: boolean;
  data: {
    messageId: string;
    conversationId?: string;
    sentAt?: string;
  };
}

// ---------------------------------------------------------------------------
// DM/inbox helper (not covered by SDK)
// ---------------------------------------------------------------------------

async function inboxRequest<T>(
  apiKey: string,
  method: string,
  path: string,
  body?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(`${LATE_API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text().catch(() => null);
    }
    throw new Error(
      `Late API ${method} ${path} failed (${response.status}): ${JSON.stringify(errorBody)}`
    );
  }

  if (response.status === 204) return {} as T;
  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Extended client: SDK + inbox methods
// ---------------------------------------------------------------------------

export class LateClient extends SocialMediaAPI {
  private _apiKey: string;

  constructor(apiKey: string) {
    super(apiKey);
    this._apiKey = apiKey;
  }

  /**
   * List all connected social accounts with full details.
   * SDK's user() only returns platform names, not account IDs/details.
   * Not yet available in the SDK.
   */
  async listAccounts(): Promise<
    Array<{
      _id: string;
      platform: string;
      username: string;
      displayName: string;
      profileUrl: string | null;
      profilePicture: string | null;
      isActive: boolean;
      status: string;
    }>
  > {
    const res = await inboxRequest<{ accounts: Array<Record<string, any>> }>(
      this._apiKey,
      "GET",
      "/v1/accounts"
    );
    return (res.accounts ?? []).map((a) => ({
      _id: a._id,
      platform: a.platform,
      username: a.username || "",
      displayName: a.displayName || a.username || "",
      profileUrl: a.profileUrl || a.profilePicture || null,
      profilePicture: a.profilePicture || a.profileUrl || null,
      isActive: a.isActive ?? true,
      status: a.status || "active",
    }));
  }

  /**
   * Send a DM to a conversation via the Late inbox API.
   * Not yet available in the SDK.
   */
  async sendMessage(
    accountId: string,
    options: {
      conversationId: string;
      text?: string;
      imageUrl?: string;
    }
  ): Promise<{ messageId: string | null }> {
    const body: Record<string, unknown> = {
      accountId,
      message: options.text || "",
    };
    if (options.imageUrl) {
      body.attachment = options.imageUrl;
    }

    const res = await inboxRequest<LateSendMessageResponse>(
      this._apiKey,
      "POST",
      `/v1/inbox/conversations/${options.conversationId}/messages`,
      body
    );
    return { messageId: res.data?.messageId ?? null };
  }

  /**
   * Send a private DM reply to a commenter (Instagram comment-to-DM).
   * Not yet available in the SDK.
   */
  async privateReplyToComment(options: {
    postId: string;
    commentId: string;
    accountId: string;
    message: string;
  }): Promise<{ status: string }> {
    return inboxRequest(
      this._apiKey,
      "POST",
      `/v1/inbox/comments/${options.postId}/${options.commentId}/private-reply`,
      {
        accountId: options.accountId,
        message: options.message,
      }
    );
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createLateClient(apiKey: string): LateClient {
  return new LateClient(apiKey);
}
