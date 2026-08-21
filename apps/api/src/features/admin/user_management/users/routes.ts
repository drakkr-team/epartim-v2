import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.admin.userManagement.users.List]);
		router.post("/", [controllers.features.admin.userManagement.users.Create]);
		router.get("/:id", [controllers.features.admin.userManagement.users.View]);
		router.patch("/:id", [controllers.features.admin.userManagement.users.Update]);
		router.delete("/:id", [controllers.features.admin.userManagement.users.Delete]);
	})
	.use(middleware.auth({ guards: ["admin"] }))
	.prefix("admin/user-management/users")
	.as("admin.user_management.users");
