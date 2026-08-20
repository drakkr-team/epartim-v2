import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router
			.post("/invitations/accept", [
				controllers.features.admin.users.AcceptInvitation,
			])
			.use(middleware.guest());

		router
			.group(() => {
				router.get("/users/options", [
					controllers.features.admin.users.UserOptions,
				]);
				router.get("/users", [controllers.features.admin.users.ListUsers]);
				router.post("/users", [
					controllers.features.admin.users.CreateUser,
				]);
				router.get("/users/:id", [
					controllers.features.admin.users.ViewUser,
				]);
				router.put("/users/:id", [
					controllers.features.admin.users.UpdateUser,
				]);
				router.post("/users/:id/invitations/resend", [
					controllers.features.admin.users.ResendInvitation,
				]);
				router.post("/users/:id/invitations/cancel", [
					controllers.features.admin.users.CancelInvitation,
				]);
				router.post("/users/:id/disable", [
					controllers.features.admin.users.DisableUser,
				]);
				router.post("/users/:id/reactivate", [
					controllers.features.admin.users.ReactivateUser,
				]);
			})
			.use(middleware.auth({ guards: ["client"] }))
			.use(middleware.admin());
	})
	.prefix("/admin")
	.as("admin");
