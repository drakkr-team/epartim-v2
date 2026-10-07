import { test } from "@japa/runner";

import InpiMapperService from "#services/inpi/mapper.service";

test.group("Services / INPI / Mapper", () => {
	const mapper = new InpiMapperService();
	test("it selects the headquarters instead of a distinct principal establishment", ({
		assert,
	}) => {
		const result = mapper.company(
			{
				formality: {
					content: {
						personneMorale: {
							identite: {
								entreprise: {
									denomination: "Entreprise de test",
									formeJuridique: "5710",
									codeApe: "70.22Z",
								},
								description: { dateClotureExerciceSocial: "3112" },
							},
							etablissementPrincipal: {
								descriptionEtablissement: { rolePourEntreprise: "3", siret: "12345678900011" },
								adresse: { voie: "Principal", codePostal: "75001" },
							},
							autresEtablissements: [
								{
									descriptionEtablissement: { rolePourEntreprise: "1", siret: "12345678900029" },
									adresse: {
										numVoie: "5",
										typeVoie: "RUE",
										voie: "DU SIEGE",
										codePostal: "69001",
										commune: "Lyon",
										distributionSpeciale: "BP 4",
										complementLocalisation: "Bâtiment A",
									},
								},
							],
						},
					},
				},
			},
			"123456789",
		);
		assert.equal(result.values.siret, "12345678900029");
		assert.equal(result.values.addressLineOne, "5 RUE DU SIEGE");
		assert.equal(result.values.addressLineTwo, "BP 4, Bâtiment A");
		assert.equal(result.values.naf, "7022Z");
		assert.equal(result.values.financialYearClosingDay, "31/12");
	});

	test("it supports an individual entrepreneur without an entreprise block", ({ assert }) => {
		const result = mapper.company(
			{
				formality: {
					content: {
						natureCreation: { formeJuridique: "1000" },
						personnePhysique: {
							identite: {
								entreprise: null,
								entrepreneur: {
									descriptionPersonne: {
										nom: "Exemple",
										prenoms: ["Camille", "Dominique"],
										dateDeNaissance: "1985-04",
									},
								},
							},
						},
					},
				},
			},
			"123456789",
		);
		assert.equal(result.values.name, "Camille Dominique Exemple");
		assert.equal(result.values.legalForm, 16);
		assert.lengthOf(result.people, 1);
		assert.isNull(result.people[0].birthDate);
		assert.include(result.warnings, "partial_person_birth_date");
	});

	test("it preserves cumulative roles and does not make auditors directors", ({ assert }) => {
		const result = mapper.company(
			{
				content: {
					personneMorale: {
						composition: {
							pouvoirs: [
								{
									roleEntreprise: "30",
									beneficiaireEffectif: true,
									individu: {
										descriptionPersonne: {
											nom: "Exemple",
											prenoms: ["Camille"],
											dateDeNaissance: "2000-02-29",
										},
									},
									representant: null,
								},
								{ roleEntreprise: "71", individu: { descriptionPersonne: { nom: "Auditeur" } } },
								{
									roleEntreprise: "73",
									entreprise: { denomination: "Personne morale test", siren: "987654321" },
								},
							],
						},
					},
				},
			},
			"123456789",
		);
		assert.deepEqual(result.people[0].roles, [1, 2]);
		assert.equal(result.people[0].birthDate, "2000-02-29");
		assert.deepEqual(result.people[1].roles, []);
		assert.equal(result.people[2].kind, 2);
		assert.equal(result.people[2].siren, "987654321");
	});

	test("it does not infer missing headquarters, legal forms or invalid dates", ({ assert }) => {
		const result = mapper.company(
			{
				content: {
					personneMorale: {
						identite: {
							entreprise: { formeJuridique: "5385" },
							description: { dateClotureExerciceSocial: "3102" },
						},
						etablissementPrincipal: {
							descriptionEtablissement: {
								siret: "12345678900011",
								indicateurEtablissementPrincipal: true,
							},
						},
					},
				},
			},
			"123456789",
		);
		assert.isNull(result.values.siret);
		assert.isNull(result.values.legalForm);
		assert.isNull(result.values.financialYearClosingDay);
		assert.include(result.warnings, "headquarters_siret_missing");
	});

	test("it maps EARL and GAEC without falling back to civil companies", ({ assert }) => {
		for (const [code, expected] of [
			["6598", 2],
			["6533", 3],
		] as const) {
			assert.equal(
				mapper.company(
					{ content: { personneMorale: { identite: { entreprise: { formeJuridique: code } } } } },
					"123456789",
				).values.legalForm,
				expected,
			);
		}
	});

	test("it excludes restricted company data and unsupported foreign addresses", ({ assert }) => {
		const result = mapper.company(
			{
				diffusionINSEE: "N",
				content: { personneMorale: { identite: { entreprise: { denomination: "Restreint" } } } },
			},
			"123456789",
		);
		assert.isNull(result.values.name);
		assert.isEmpty(result.people);
		const warnings: string[] = [];
		assert.isNull(
			mapper.address({ codePays: "DE", voie: "Rue", codePostal: "12345" }, warnings).lineOne,
		);
		assert.include(warnings, "address_not_supported");
	});

	test("it sorts eligible articles by filing date and excludes withdrawn files", ({ assert }) => {
		const article = {
			siren: "123456789",
			typeRdd: [{ typeActe: "Statuts mis à jour" }],
			confidentiality: "Public",
		};
		const result = mapper.articles(
			{
				actes: [
					{ ...article, id: "old", dateDepot: "2020-01-01" },
					{ ...article, id: "withdrawn", dateDepot: "2026-01-01", deleted: true },
					{ ...article, id: "recent", dateDepot: "2025-01-01" },
					{ ...article, id: "other-company", dateDepot: "2026-01-01", siren: "987654321" },
				],
			},
			"123456789",
		);
		assert.deepEqual(
			result.map((item) => item.id),
			["recent", "old"],
		);
	});
});
