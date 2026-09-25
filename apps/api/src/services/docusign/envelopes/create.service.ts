import { EnvelopeDefinition, EnvelopeSummary } from "docusign-esign";

import DocusignBaseService from "#services/docusign/base.service";
import env from "#start/env";

export type Payload = EnvelopeDefinition;
export type Response = EnvelopeSummary;

export default class DocusignEnvelopesCreateService extends DocusignBaseService {
	handle(payload: Payload) {
		return this.client
			.post(`restapi/v2.1/accounts/${env.get("DOCUSIGN_ACCOUNT_ID")}/envelopes`, {
				json: payload,
			})
			.json<Response>();
	}
}
