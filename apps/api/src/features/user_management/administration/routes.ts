import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router
			.post("/invitations/accept", [
				controllers.features.userManagement.administration.AcceptInvitation,
			])
			.use(middleware.guest());

		router
			.group(() => {
				router.get("/users/options", [
					controllers.features.userManagement.administration.UserOptions,
				]);
				router.get("/users", [controllers.features.userManagement.administration.ListUsers]);
				router.post("/users", [controllers.features.userManagement.administration.CreateUser]);
				router.get("/users/:id", [controllers.features.userManagement.administration.ViewUser]);
				router.put("/users/:id", [controllers.features.userManagement.administration.UpdateUser]);
				router.post("/users/:id/invitations/resend", [
					controllers.features.userManagement.administration.ResendInvitation,
				]);
				router.post("/users/:id/invitations/cancel", [
					controllers.features.userManagement.administration.CancelInvitation,
				]);
				router.post("/users/:id/disable", [
					controllers.features.userManagement.administration.DisableUser,
				]);
				router.post("/users/:id/reactivate", [
					controllers.features.userManagement.administration.ReactivateUser,
				]);
			})
			.use(middleware.auth({ guards: ["web"] }))
			.use(middleware.admin());
	})
	.prefix("/admin")
	.as("admin");
