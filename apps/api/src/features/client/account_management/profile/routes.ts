import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.client.accountManagement.profile.View]);
		router.put("/", [controllers.features.client.accountManagement.profile.Update]);
		router.delete("/", [controllers.features.client.accountManagement.profile.Delete]);
	})
	.use(middleware.auth({ guards: ["client"] }))
	.prefix("/client/account-management/profile")
	.as("client.account_management.profile");
