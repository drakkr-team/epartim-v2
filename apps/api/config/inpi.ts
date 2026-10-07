import env from "#start/env";

export default {
	baseUrl: "https://registre-national-entreprises.inpi.fr",
	username: env.get("INPI_USERNAME"),
	password: env.get("INPI_PASSWORD"),
	timeout: 10_000,
	tokenTtl: 60 * 60,
	previewTtl: 15 * 60,
	maxDocumentSize: 10 * 1024 * 1024,
};
