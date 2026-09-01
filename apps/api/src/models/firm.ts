import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import { FirmSchema } from "#database/schema";
import Address from "#models/address";
import Network from "#models/network";
import PaymentDetail from "#models/payment_detail";

export default class Firm extends FirmSchema {
	@belongsTo(() => Address)
	declare address: BelongsTo<typeof Address>;

	@belongsTo(() => Network)
	declare network: BelongsTo<typeof Network>;

	@belongsTo(() => PaymentDetail)
	declare paymentDetail: BelongsTo<typeof PaymentDetail>;
}
