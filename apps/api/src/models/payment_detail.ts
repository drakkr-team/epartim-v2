import { hasMany, hasOne } from "@adonisjs/lucid/orm";
import type { HasMany, HasOne } from "@adonisjs/lucid/types/relations";

import { PaymentDetailSchema } from "#database/schema";
import Company from "#models/company";
import Firm from "#models/firm";
import Network from "#models/network";

export default class PaymentDetail extends PaymentDetailSchema {
	@hasOne(() => Company)
	declare company: HasOne<typeof Company>;

	@hasMany(() => Firm, { foreignKey: "paymentDetailsId" })
	declare firms: HasMany<typeof Firm>;

	@hasMany(() => Network, { foreignKey: "paymentDetailsId" })
	declare networks: HasMany<typeof Network>;
}
