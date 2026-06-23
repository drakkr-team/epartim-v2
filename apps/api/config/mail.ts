import { defineConfig, transports } from "@adonisjs/mail";

import env from "#start/env";

const mailConfig = defineConfig({
	default: env.get("MAIL_MAILER"),

	from: {
		address: env.get("MAIL_FROM_ADDRESS"),
		name: env.get("MAIL_FROM_NAME"),
	},

	mailers: {
		smtp: transports.smtp({
			host: env.get("SMTP_HOST"),
			port: env.get("SMTP_PORT"),
		}),
	},
});

export default mailConfig;

declare module "@adonisjs/mail/types" {
	export interface MailersList extends InferMailers<typeof mailConfig> {}
}
