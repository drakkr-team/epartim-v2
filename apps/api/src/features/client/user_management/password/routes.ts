import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router
			.group(() => {
				router
					.post("/forgot", [controllers.features.client.userManagement.password.Forgot])
					.use(middleware.authAttempt({ identifier: "email", scope: "password-forgot" }));
				router
					.post("/reset", [controllers.features.client.userManagement.password.Reset])
					.use(middleware.authAttempt({ identifier: "token", scope: "password-reset" }));
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
