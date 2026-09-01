import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.admin.networks.List]);
		router.post("/", [controllers.features.admin.networks.Create]);
		router.get("/:networkId", [controllers.features.admin.networks.View]);
		router.put("/:networkId", [controllers.features.admin.networks.Update]);
		router.delete("/:networkId", [controllers.features.admin.networks.Delete]);
	})
	.use(middleware.auth({ guards: ["admin"] }))
	.prefix("admin/networks")
	.as("admin.networks");
