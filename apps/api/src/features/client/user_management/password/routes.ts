import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";
import { brutForceLimiter } from "#start/limiter";

router
	.group(() => {
		router
			.group(() => {
				router
					.post("/forgot", [controllers.features.client.userManagement.password.Forgot])
					.use(brutForceLimiter);
				router
					.post("/reset", [controllers.features.client.userManagement.password.Reset])
					.use(brutForceLimiter);
			})
			.use(middleware.guest());

		router
			.group(() => {
				router.put("/", [controllers.features.client.userManagement.password.Update]);
			})
			.use(middleware.auth({ guards: ["client"] }));
	})
	.prefix("/client/user-management/password")
	.as("client.user_management.password");
