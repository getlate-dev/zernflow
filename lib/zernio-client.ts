/**
 * Zernio API client.
 *
 * Thin wrapper around the official @zernio/node SDK.
 * All endpoints are auto-generated from the OpenAPI spec.
 */

import Zernio from "@zernio/node";

export type { Zernio };

export function createZernioClient(apiKey: string): Zernio {
  return new Zernio({ apiKey });
}
