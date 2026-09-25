import DocusignSDK from "docusign-esign";
import ky from "ky";

import env from "#start/env";

export default abstract class DocusignBaseService {
	protected client = ky.create({
		baseUrl: env.get("DOCUSIGN_BASE_PATH"),
		hooks: {
			beforeRequest: [
				async ({ request }) => {
					const jwtToken = env.get("DOCUSIGN_JWT_TOKEN", await this.#getJWTToken());
					env.set("DOCUSIGN_JWT_TOKEN", jwtToken);
					request.headers.set("Authorization", `Bearer ${jwtToken}`);
				},
			],
			beforeRetry: [
				async ({ retryCount, request }) => {
					if (retryCount === 1) {
						const newJwtToken = await this.#getJWTToken();
						env.set("DOCUSIGN_JWT_TOKEN", newJwtToken);
						request.headers.set("Authorization", `Bearer ${newJwtToken}`);
					}
				},
			],
		},
	});

	async #getJWTToken() {
		const apiClient = new DocusignSDK.ApiClient({
			basePath: env.get("DOCUSIGN_BASE_PATH"),
			oAuthBasePath: env.get("DOCUSIGN_BASE_PATH"),
		});
		const tokenResponse: { body: { access_token: string } } = await apiClient.requestJWTUserToken(
			env.get("DOCUSIGN_CLIENT_ID"),
			env.get("DOCUSIGN_USER_ID"),
			["signature"],
			Buffer.from(env.get("DOCUSIGN_RSA_PRIVATE_KEY").replaceAll("\\n", "\n")),
			3600,
		);

		return tokenResponse.body.access_token;
	}
}
