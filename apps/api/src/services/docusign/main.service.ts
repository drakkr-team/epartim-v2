import { inject } from "@adonisjs/core";

import DocusignEnvelopesService from "#services/docusign/envelopes/main.service";

@inject()
export default class DocusignService {
	constructor(public envelopes: DocusignEnvelopesService) {}
}
