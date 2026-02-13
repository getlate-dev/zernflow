/**
 * Late API client.
 *
 * Thin wrapper around the official @getlatedev/node SDK.
 * All endpoints are auto-generated from the OpenAPI spec.
 */

import Late from "@getlatedev/node";

export type { Late };

export function createLateClient(apiKey: string): Late {
  return new Late({ apiKey });
}
