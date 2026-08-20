import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.client.userManagement.profile.View]);
		router.put("/", [controllers.features.client.userManagement.profile.Update]);
		router.delete("/", [controllers.features.client.userManagement.profile.Delete]);
	})
	.use(middleware.auth({ guards: ["client"] }))
	.prefix("/client/user-management/profile")
	.as("client.user_management.profile");
