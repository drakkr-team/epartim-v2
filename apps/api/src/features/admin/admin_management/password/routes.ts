import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router
			.group(() => {
				router
					.post("/forgot", [controllers.features.admin.adminManagement.password.Forgot])
					.use(middleware.authAttempt({ identifier: "email", scope: "password-forgot" }));
				router
					.post("/reset", [controllers.features.admin.adminManagement.password.Reset])
					.use(middleware.authAttempt({ identifier: "token", scope: "password-reset" }));
			})
			.use(middleware.guest());

		router
			.group(() => {
				router.put("/", [controllers.features.admin.adminManagement.password.Update]);
			})
			.use(middleware.auth({ guards: ["client"] }));
	})
	.prefix("admin/admin-management/password")
	.as("admin.admin_management.password");
