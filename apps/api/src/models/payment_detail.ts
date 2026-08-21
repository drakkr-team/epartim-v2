import { hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";

import { PaymentDetailSchema } from "#database/schema";
import Firm from "#models/firm";
import Network from "#models/network";

export default class PaymentDetail extends PaymentDetailSchema {
	@hasMany(() => Firm, { foreignKey: "paymentDetailsId" })
	declare firms: HasMany<typeof Firm>;

	@hasMany(() => Network, { foreignKey: "paymentDetailsId" })
	declare networks: HasMany<typeof Network>;
}
