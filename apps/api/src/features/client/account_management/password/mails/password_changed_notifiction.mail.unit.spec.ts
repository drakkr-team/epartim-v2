import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";
import PasswordChangedNotificationMail from "#features/client/account_management/password/mails/password_changed_notifiction.mail";

test.group(
	"Features / Account Management / Password / Mails / Password Changed Notification Mail",
	() => {
		test("it should render the password changed notification email", async () => {
			const user = await UserFactory.merge({
				firstName: "Marie",
				lastName: "Martin",
				email: "client.password.changed@example.com",
			}).create();
			const loginUrl = new URL("https://app.example.test/login");
			const email = new PasswordChangedNotificationMail({ user, loginUrl });

			await email.buildWithContents();

			email.message.assertTo(user.email);

			email.message.assertHtmlIncludes(user.name);
			email.message.assertHtmlIncludes(loginUrl.toString());
		});
	},
);
