import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.admin.networks.List]);
		router.post("/", [controllers.features.admin.networks.Create]);
	})
	.use(middleware.auth({ guards: ["admin"] }))
	.prefix("admin/networks")
	.as("admin.networks");
