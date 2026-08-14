import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router
			.group(() => {
				router
					.post("/forgot", [controllers.features.userManagement.password.Forgot])
					.use(middleware.authAttempt({ identifier: "email", scope: "password-forgot" }));
				router
					.post("/reset", [controllers.features.userManagement.password.Reset])
					.use(middleware.authAttempt({ identifier: "token", scope: "password-reset" }));
			})
			.use(middleware.guest());

		router
			.group(() => {
				router.put("/", [controllers.features.userManagement.password.Update]);
			})
			.use(middleware.auth({ guards: ["web"] }));
	})
	.prefix("/user-management/password")
	.as("user_management.password");
