import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.admin.companies.List]);
		router.get("/:companyId", [controllers.features.admin.companies.View]);
	})
	.use(middleware.auth({ guards: ["admin"] }))
	.prefix("admin/companies")
	.as("admin.companies");
