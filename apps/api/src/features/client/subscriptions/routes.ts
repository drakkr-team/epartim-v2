import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.client.subscriptions.List]);
		router.post("/", [controllers.features.client.subscriptions.Create]);
		router.get("/:subscriptionId", [controllers.features.client.subscriptions.View]);
		router
			.post("/:subscriptionId/steps/:step/validate", [
				controllers.features.client.subscriptions.steps.Validate,
			])
			.as("validate_step");
		router
			.post("/:subscriptionId/documents/:documentType", [
				controllers.features.client.subscriptions.documents.Upload,
			])
			.as("upload_document");
		router
			.delete("/:subscriptionId/documents/:documentType", [
				controllers.features.client.subscriptions.documents.Delete,
			])
			.as("delete_document");
		router
			.put("/:subscriptionId/legal-identification", [
				controllers.features.client.subscriptions.update.LegalIdentification,
			])
			.as("update_legal_identification");
		router
			.put("/:subscriptionId/address-and-bank-details", [
				controllers.features.client.subscriptions.update.AddressAndBankDetails,
			])
			.as("update_address_and_bank_details");
		router
			.put("/:subscriptionId/representatives/legal-agent", [
				controllers.features.client.subscriptions.update.representatives.LegalAgent,
			])
			.as("update_legal_agent");
		router
			.put("/:subscriptionId/representatives/signer", [
				controllers.features.client.subscriptions.update.representatives.Signer,
			])
			.as("update_signer");
		router
			.put("/:subscriptionId/representatives/correspondent", [
				controllers.features.client.subscriptions.update.representatives.Correspondent,
			])
			.as("update_correspondent");
		router
			.put("/:subscriptionId/authorizations", [
				controllers.features.client.subscriptions.update.representatives.Authorizations,
			])
			.as("update_authorizations");
		router
			.put("/:subscriptionId/kyc-profile", [
				controllers.features.client.subscriptions.update.KycProfile,
			])
			.as("update_kyc_profile");
	})
	.use(middleware.auth({ guards: ["client"] }))
	.prefix("/client/subscriptions")
	.as("client.subscriptions");
