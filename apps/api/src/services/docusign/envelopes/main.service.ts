import { inject } from "@adonisjs/core";

import DocusignEnvelopesCreateService from "#services/docusign/envelopes/create.service";

@inject()
export default class DocusignEnvelopesService {
	public create: DocusignEnvelopesCreateService["handle"];

	constructor(protected createService: DocusignEnvelopesCreateService) {
		this.create = this.createService.handle.bind(this.createService);
	}
}
