import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.admin.users.List]);
		router.post("/", [controllers.features.admin.users.Create]);
		router.get("/:userId", [controllers.features.admin.users.View]);
		router.put("/:userId", [controllers.features.admin.users.Update]);
		router.delete("/:userId", [controllers.features.admin.users.Delete]);

		router.post("/:userId/resend-onboarding", [controllers.features.admin.users.ResendOnboarding]);
	})
	.use(middleware.auth({ guards: ["admin"] }))
	.prefix("admin/users")
	.as("admin.users");
