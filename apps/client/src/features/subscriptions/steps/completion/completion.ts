import z from "zod";

import type { routes } from "@workspace/api/registry";

export type SubscriptionSnapshot =
	(typeof routes)["client.subscriptions.view"]["types"]["response"];
export type RequiredDocument = Pick<SubscriptionSnapshot["documents"][number], "status">;
export type StepCompletion = { completed: number; required: number; percentage: number };

// Each boolean represents one applicable, required field or document, never an interaction.
export function summarizeCompletion(requirements: boolean[]): StepCompletion | null {
	if (requirements.length === 0) return null;
	const completed = requirements.filter(Boolean).length;
	return {
		completed,
		required: requirements.length,
		percentage: Math.floor((100 * completed) / requirements.length),
	};
}

export function documentCompletion(documents: RequiredDocument[]) {
	return documents.map((document) => document.status === "attached");
}

export const requiredText = z.string().trim().min(1).max(254);
export const email = z.string().trim().max(254).email();
export const country = z.string().regex(/^[A-Z]{2}$/);
export const postalCode = z
	.string()
	.trim()
	.regex(/^\d{5}$/);
export const percentage = z.number().min(0).max(100);
export const calendarDate = z.iso.date();
export const headcount = z.number().int().positive();
export const positiveAmount = z
	.number()
	.positive()
	.refine(
		(value) =>
			Number.isSafeInteger(Math.round(value * 100)) &&
			Math.abs(value * 100 - Math.round(value * 100)) <= Number.EPSILON * 100,
	);

export function valid(schema: z.ZodType, value: unknown) {
	return schema.safeParse(value).success;
}
