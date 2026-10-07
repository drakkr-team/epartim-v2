import { UserFactory } from "#database/factories/user.factory";
import InpiUnavailableException from "#exceptions/inpi_unavailable.exception";
import CreateSubscriptionService from "#features/client/subscriptions/services/create.service";
import Company from "#models/company";
import InpiClientService from "#services/inpi/client.service";

export const SIREN = "123456789";
export const article = {
	id: "synthetic-act",
	siren: SIREN,
	dateDepot: "2026-01-05",
	confidentiality: "Public",
	typeRdd: [{ typeActe: "Statuts mis à jour" }],
};
export class FakeInpiClient extends InpiClientService {
	unavailable = false;
	pdfUnavailable = false;
	withdrawn = false;
	override async company(siren: string) {
		if (this.unavailable) throw new InpiUnavailableException();
		return {
			formality: {
				content: {
					personneMorale: {
						identite: {
							entreprise: {
								denomination: "Entreprise de test",
								formeJuridique: "5710",
								nicSiege: "00012",
							},
						},
						adresseEntreprise: {
							adresse: {
								numVoie: "2",
								typeVoie: "RUE",
								voie: "DES TESTS",
								codePostal: "75001",
								commune: "PARIS",
							},
						},
						composition: {
							pouvoirs: [
								{
									roleEntreprise: "51",
									individu: {
										descriptionPersonne: {
											nom: "Exemple",
											prenoms: ["Camille"],
											dateDeNaissance: "1980-05",
										},
									},
								},
							],
						},
					},
				},
				siren,
			},
		};
	}
	override async attachments() {
		return { actes: [article] };
	}
	override async article() {
		return { ...article, deleted: this.withdrawn };
	}
	override async download() {
		if (this.pdfUnavailable) throw new InpiUnavailableException();
		return Buffer.from("%PDF-1.4\n%%EOF");
	}
}

export async function dossier() {
	const user = await UserFactory.create();
	const subscription = await new CreateSubscriptionService().handle(user.id);
	const company = await Company.findByOrFail("subscriptionId", subscription.id);
	return { user, subscription, company, params: { subscriptionId: subscription.id } };
}
