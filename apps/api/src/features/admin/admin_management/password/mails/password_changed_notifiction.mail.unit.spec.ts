import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import PasswordChangedNotificationMail from "#features/admin/admin_management/password/mails/password_changed_notifiction.mail";

test.group(
	"Features / Admin / Admin Management / Password / Mails / Password Changed Notification Mail",
	() => {
		test("it should render the password changed notification email", async () => {
			const admin = await AdminFactory.create();
			const loginUrl = new URL("https://app.example.test/login");
			const email = new PasswordChangedNotificationMail({ admin, loginUrl });

			await email.buildWithContents();

			email.message.assertTo(admin.email);

			email.message.assertHtmlIncludes(admin.name);
			email.message.assertHtmlIncludes(loginUrl.toString());
		});
	},
);
