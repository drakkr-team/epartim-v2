import vine from "@vinejs/vine";

export const AcceptedSubscriptionDocumentExtensions = ["pdf", "png", "jpg", "jpeg", "csv", "xlsx"];

const DocumentOwnerQuerySchema = vine.object({
	ownerId: vine.number().positive().withoutDecimals().optional(),
});

export const UploadSubscriptionDocumentSchema = vine.object({
	file: vine.file({ size: "10mb", extnames: AcceptedSubscriptionDocumentExtensions }),
	query: DocumentOwnerQuerySchema,
});

export const DeleteSubscriptionDocumentSchema = vine.object({
	query: DocumentOwnerQuerySchema,
});
