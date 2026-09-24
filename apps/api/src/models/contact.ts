import { column } from "@adonisjs/lucid/orm";

import type {
	ContactAuthorization,
	ContactCivility,
	ContactFunction,
	ContactKind,
} from "#constants/contact";
import { ContactSchema } from "#database/schema";
import { jsonColumn } from "#src/utils/json_column";

export default class Contact extends ContactSchema {
	declare civility: ContactCivility | null;

	declare kind: ContactKind | null;

	declare function: ContactFunction | null;

	@column()
	declare legalName: string | null;

	@column(jsonColumn<ContactAuthorization[]>())
	declare authorizations: ContactAuthorization[] | null;
}
