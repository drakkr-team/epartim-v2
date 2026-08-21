import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";
import { brutForceLimiter } from "#start/limiter";

router
	.group(() => {
		router
			.group(() => {
				router.post("/forgot", [controllers.features.admin.accountManagement.password.Forgot]);
				router.post("/reset", [controllers.features.admin.accountManagement.password.Reset]);
			})
			.use(middleware.guest({ guards: ["admin"] }))
			.use(brutForceLimiter);
	})
	.prefix("admin/account-management/password")
	.as("admin.account_management.password");
