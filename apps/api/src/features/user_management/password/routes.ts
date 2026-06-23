import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";
import { brutForceLimiter } from "#start/limiter";

router
	.group(() => {
		router
			.group(() => {
				router.post("/forgot", [controllers.features.userManagement.password.Forgot]);
				router.post("/reset", [controllers.features.userManagement.password.Reset]);
			})
			.use(middleware.guest())
			.use(brutForceLimiter);

		router
			.group(() => {
				router.put("/", [controllers.features.userManagement.password.Update]);
			})
			.use(middleware.auth({ guards: ["web"] }));
	})
	.prefix("/user-management/password")
	.as("user_management.password");
