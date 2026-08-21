import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.admin.admins.List]);
		router.post("/", [controllers.features.admin.admins.Create]);
		router
			.get("/:adminId", [controllers.features.admin.admins.View])
			.where("adminId", router.matchers.number());
		router
			.patch("/:adminId", [controllers.features.admin.admins.Update])
			.where("adminId", router.matchers.number());
		router
			.delete("/:adminId", [controllers.features.admin.admins.Delete])
			.where("adminId", router.matchers.number());
	})
	.use(middleware.auth({ guards: ["admin"] }))
	.prefix("admin/admins")
	.as("admin.admins");
