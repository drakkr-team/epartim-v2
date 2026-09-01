import z from "zod";

const allowedOriginParams = new Set(["page", "perPage", "q", "networkId", "orderBy"]);
const firmListSearchSchema = z.object({
	page: z.coerce.number().int().positive().optional(),
	perPage: z.coerce.number().int().positive().optional(),
	q: z.string().optional(),
	networkId: z.coerce.number().int().positive().optional(),
	orderBy: z.string().optional(),
});

export function parseFirmListOrigin(value: string) {
	try {
		const origin = new URL(value, "https://admin.epartim.invalid");
		if (
			origin.origin !== "https://admin.epartim.invalid" ||
			origin.pathname !== "/firms" ||
			origin.hash !== "" ||
			!Array.from(origin.searchParams.keys()).every((key) => allowedOriginParams.has(key))
		) {
			return null;
		}

		const parsedSearch = firmListSearchSchema.safeParse({
			page: origin.searchParams.get("page") ?? undefined,
			perPage: origin.searchParams.get("perPage") ?? undefined,
			q: origin.searchParams.get("q") ?? undefined,
			networkId: origin.searchParams.get("networkId") ?? undefined,
			orderBy: origin.searchParams.get("orderBy") ?? undefined,
		});
		return parsedSearch.success ? parsedSearch.data : null;
	} catch (error) {
		if (error instanceof TypeError) return null;
		throw error;
	}
}

export const firmListOriginSchema = z
	.string()
	.refine((value) => parseFirmListOrigin(value) !== null)
	.optional();

export const firmListOriginSearchSchema = z.object({
	from: firmListOriginSchema,
});
