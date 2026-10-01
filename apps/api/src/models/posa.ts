import { column } from "@adonisjs/lucid/orm";

import type { PosaContractType, PosaFund } from "#constants/posa";
import { PosaSchema } from "#database/schema";

export default class Posa extends PosaSchema {
	@column()
	declare contractType: PosaContractType;

	@column()
	declare fund: PosaFund;
}
