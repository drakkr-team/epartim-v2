import type { routes } from "@workspace/api/registry";

export type InpiPreview = (typeof routes)["client.subscriptions.inpi.preview"]["types"]["response"];
export type InpiFieldKey = InpiPreview["fields"][number]["key"];
