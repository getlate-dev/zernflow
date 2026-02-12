import { LateClient } from "@getlatedev/social-media-api";

export function createLateClient(apiKey: string) {
  return new LateClient({ apiKey });
}
