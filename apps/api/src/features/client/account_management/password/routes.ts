import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";
import { brutForceLimiter } from "#start/limiter";

router
	.group(() => {
		router
			.group(() => {
				router
					.post("/forgot", [controllers.features.client.accountManagement.password.Forgot])
					.use(brutForceLimiter);
				router
					.post("/reset", [controllers.features.client.accountManagement.password.Reset])
					.use(brutForceLimiter);
			})
			.use(middleware.guest());

		router
			.group(() => {
				router.put("/", [controllers.features.client.accountManagement.password.Update]);
			})
			.use(middleware.auth({ guards: ["client"] }));
	})
	.prefix("/client/account-management/password")
	.as("client.account_management.password");
