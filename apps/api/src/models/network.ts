import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";

import { NetworkSchema } from "#database/schema";
import Address from "#models/address";
import Firm from "#models/firm";
import PaymentDetail from "#models/payment_detail";

export default class Network extends NetworkSchema {
	@belongsTo(() => Address)
	declare address: BelongsTo<typeof Address>;

	@belongsTo(() => PaymentDetail, { foreignKey: "paymentDetailsId" })
	declare paymentDetails: BelongsTo<typeof PaymentDetail>;

	@hasMany(() => Firm)
	declare firms: HasMany<typeof Firm>;
}
