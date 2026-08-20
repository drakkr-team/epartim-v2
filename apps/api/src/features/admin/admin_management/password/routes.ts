import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router
			.group(() => {
				router.post("/forgot", [controllers.features.admin.adminManagement.password.Forgot]);
				router.post("/reset", [controllers.features.admin.adminManagement.password.Reset]);
			})
			.use(middleware.guest({ guards: ["admin"] }));
	})
	.prefix("admin/admin-management/password")
	.as("admin.admin_management.password");
