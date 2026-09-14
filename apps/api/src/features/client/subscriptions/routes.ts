import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.client.subscriptions.List]);
		router.post("/", [controllers.features.client.subscriptions.Create]);
		router.get("/:subscriptionId", [controllers.features.client.subscriptions.View]);
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
			.put("/:subscriptionId/representatives-and-authorizations", [
				controllers.features.client.subscriptions.update.RepresentativesAndAuthorizations,
			])
			.as("update_representatives_and_authorizations");
	})
	.use(middleware.auth({ guards: ["client"] }))
	.prefix("/client/subscriptions")
	.as("client.subscriptions");
