import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.admin.adminManagement.admins.List]);
		router.post("/", [controllers.features.admin.adminManagement.admins.Create]);
		router.get("/:id", [controllers.features.admin.adminManagement.admins.View]);
		router.patch("/:id", [controllers.features.admin.adminManagement.admins.Update]);
	})
	.use(middleware.auth({ guards: ["admin"] }))
	.prefix("admin/admin-management/admins")
	.as("admin.admin_management.admins");
