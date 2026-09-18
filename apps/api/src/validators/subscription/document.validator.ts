import vine from "@vinejs/vine";

export const AcceptedSubscriptionDocumentExtensions = ["pdf", "png", "jpg", "jpeg", "csv", "xlsx"];

export const UploadSubscriptionDocumentSchema = vine.object({
	file: vine.file({ size: "10mb", extnames: AcceptedSubscriptionDocumentExtensions }),
});
