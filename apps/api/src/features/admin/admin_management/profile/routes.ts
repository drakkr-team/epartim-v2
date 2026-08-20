import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.admin.adminManagement.profile.View]);
		router.put("/", [controllers.features.admin.adminManagement.profile.Update]);
		router.delete("/", [controllers.features.admin.adminManagement.profile.Delete]);
	})
	.use(middleware.auth({ guards: ["client"] }))
	.prefix("admin/admin-management/profile")
	.as("admin.admin_management.profile");
