import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.admin.roles.List]);
		router.post("/", [controllers.features.admin.roles.Create]);
		router.get("/:roleId", [controllers.features.admin.roles.View]);
		router.put("/:roleId", [controllers.features.admin.roles.Update]);
		router.delete("/:roleId", [controllers.features.admin.roles.Delete]);
	})
	.use(middleware.auth({ guards: ["admin"] }))
	.prefix("admin/roles")
	.as("admin.roles");
