import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.admin.firms.List]);
		router.post("/", [controllers.features.admin.firms.Create]);
		router.get("/:firmId", [controllers.features.admin.firms.View]);
		router.put("/:firmId", [controllers.features.admin.firms.Update]);
		router.delete("/:firmId", [controllers.features.admin.firms.Delete]);
	})
	.use(middleware.auth({ guards: ["admin"] }))
	.prefix("admin/firms")
	.as("admin.firms");
