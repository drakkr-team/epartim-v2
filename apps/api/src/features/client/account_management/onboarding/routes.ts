import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";
import { brutForceLimiter } from "#start/limiter";

router
	.group(() => {
		router.post("/activate", [controllers.features.client.accountManagement.onboarding.Activate]);
	})
	.use(middleware.guest({ guards: ["client"] }))
	.use(brutForceLimiter)
	.prefix("/client/account-management/onboarding")
	.as("client.account_management.onboarding");
