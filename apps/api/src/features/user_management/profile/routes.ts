import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.userManagement.profile.View]);
		router.put("/", [controllers.features.userManagement.profile.Update]);
		router.delete("/", [controllers.features.userManagement.profile.Delete]);
	})
	.use(middleware.auth({ guards: ["web"] }))
	.prefix("/user-management/profile")
	.as("user_management.profile");
