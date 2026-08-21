import type PaymentDetail from "#models/payment_detail";

export default class PaymentDetailPresenter {
	toJSON(paymentDetail: PaymentDetail) {
		return {
			id: paymentDetail.id,

			iban: paymentDetail.iban,
			bic: paymentDetail.bic,
		};
	}
}
