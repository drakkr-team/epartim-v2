import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.post("/", [controllers.features.admin.adminManagement.admins.Create]);
	})
	.use(middleware.auth({ guards: ["admin"] }))
	.prefix("admin/admin-management/admins")
	.as("admin.admin_management.admins");
