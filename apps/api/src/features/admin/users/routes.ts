import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.admin.users.List]);
		router.post("/", [controllers.features.admin.users.Create]);
		router
			.get("/:userId", [controllers.features.admin.users.View])
			.where("userId", router.matchers.number());
		router
			.patch("/:userId", [controllers.features.admin.users.Update])
			.where("userId", router.matchers.number());
		router
			.delete("/:userId", [controllers.features.admin.users.Delete])
			.where("userId", router.matchers.number());
	})
	.use(middleware.auth({ guards: ["admin"] }))
	.prefix("admin/users")
	.as("admin.users");
