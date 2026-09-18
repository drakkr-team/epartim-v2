import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.admin.admins.List]);
		router.post("/", [controllers.features.admin.admins.Create]);
		router.get("/:adminId", [controllers.features.admin.admins.View]);
		router.put("/:adminId", [controllers.features.admin.admins.Update]);
		router.delete("/:adminId", [controllers.features.admin.admins.Delete]);

		router.post("/:adminId/resend-onboarding", [
			controllers.features.admin.admins.ResendOnboarding,
		]);
	})
	.use(middleware.auth({ guards: ["admin"] }))
	.prefix("admin/admins")
	.as("admin.admins");
