import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.post("/", [controllers.features.client.subscriptions.Create]);
		router.get("/:subscriptionId", [controllers.features.client.subscriptions.View]);
		router
			.put("/:subscriptionId/legal-identification", [
				controllers.features.client.subscriptions.update.LegalIdentification,
			])
			.as("update_legal_identification");
	})
	.use(middleware.auth({ guards: ["client"] }))
	.prefix("/client/subscriptions")
	.as("client.subscriptions");
