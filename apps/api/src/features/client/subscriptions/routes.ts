import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.client.subscriptions.List]);
		router.post("/", [controllers.features.client.subscriptions.Create]);
		router.get("/:subscriptionId", [controllers.features.client.subscriptions.View]);
		router
			.post("/:subscriptionId/steps/:step/validate", [
				controllers.features.client.subscriptions.steps.Validate,
			])
			.as("validate_step");
		router
			.post("/:subscriptionId/documents/:documentType", [
				controllers.features.client.subscriptions.documents.Upload,
			])
			.as("upload_document");
		router
			.delete("/:subscriptionId/documents/:documentType", [
				controllers.features.client.subscriptions.documents.Delete,
			])
			.as("delete_document");
		router
			.put("/:subscriptionId/legal-identification", [
				controllers.features.client.subscriptions.update.LegalIdentification,
			])
			.as("update_legal_identification");
		router
			.put("/:subscriptionId/address-and-bank-details", [
				controllers.features.client.subscriptions.update.AddressAndBankDetails,
			])
			.as("update_address_and_bank_details");
		router
			.put("/:subscriptionId/representatives/legal-agent", [
				controllers.features.client.subscriptions.update.representatives.LegalAgent,
			])
			.as("update_legal_agent");
		router
			.put("/:subscriptionId/representatives/signer", [
				controllers.features.client.subscriptions.update.representatives.Signer,
			])
			.as("update_signer");
		router
			.put("/:subscriptionId/representatives/correspondent", [
				controllers.features.client.subscriptions.update.representatives.Correspondent,
			])
			.as("update_correspondent");
		router
			.put("/:subscriptionId/authorizations", [
				controllers.features.client.subscriptions.update.representatives.Authorizations,
			])
			.as("update_authorizations");
		router
			.put("/:subscriptionId/kyc-profile", [
				controllers.features.client.subscriptions.update.kyc.Profile,
			])
			.as("update_kyc_profile");
		router
			.put("/:subscriptionId/contract-characteristics/plan", [
				controllers.features.client.subscriptions.update.contractCharacteristics.Plan,
			])
			.as("update_contract_characteristics_plan");
		router
			.put("/:subscriptionId/contract-characteristics/agreements", [
				controllers.features.client.subscriptions.update.contractCharacteristics.Agreements,
			])
			.as("update_contract_characteristics_agreements");
		router
			.put("/:subscriptionId/contract-characteristics/adhesions", [
				controllers.features.client.subscriptions.update.contractCharacteristics.Adhesions,
			])
			.as("update_contract_characteristics_adhesions");
		router
			.put("/:subscriptionId/contract-characteristics/matching", [
				controllers.features.client.subscriptions.update.contractCharacteristics.Matching,
			])
			.as("update_contract_characteristics_matching");
		router
			.put("/:subscriptionId/contract-fees", [
				controllers.features.client.subscriptions.update.ContractFees,
			])
			.as("update_contract_fees");
		router
			.put("/:subscriptionId/formalism/:group", [
				controllers.features.client.subscriptions.update.formalism.Formalism,
			])
			.as("update_formalism_group");
		router
			.post("/:subscriptionId/formalism/:group/members", [
				controllers.features.client.subscriptions.update.formalism.members.Create,
			])
			.as("create_formalism_member");
		router
			.put("/:subscriptionId/formalism/:group/members/:memberId", [
				controllers.features.client.subscriptions.update.formalism.members.Update,
			])
			.as("update_formalism_member");
		router
			.delete("/:subscriptionId/formalism/:group/members/:memberId", [
				controllers.features.client.subscriptions.update.formalism.members.Delete,
			])
			.as("delete_formalism_member");
		router
			.post("/:subscriptionId/formalism/employees", [
				controllers.features.client.subscriptions.update.formalism.employees.Create,
			])
			.as("create_formalism_employee");
		router
			.put("/:subscriptionId/formalism/employees/:employeeId", [
				controllers.features.client.subscriptions.update.formalism.employees.Update,
			])
			.as("update_formalism_employee");
		router
			.delete("/:subscriptionId/formalism/employees/:employeeId", [
				controllers.features.client.subscriptions.update.formalism.employees.Delete,
			])
			.as("delete_formalism_employee");
		router
			.post("/:subscriptionId/formalism/employees/import", [
				controllers.features.client.subscriptions.update.formalism.employees.Import,
			])
			.as("import_formalism_employees");
		router
			.post("/:subscriptionId/kyc-owners", [
				controllers.features.client.subscriptions.update.kyc.owners.Create,
			])
			.as("create_kyc_owner");
		router
			.put("/:subscriptionId/kyc-owners/:ownerId", [
				controllers.features.client.subscriptions.update.kyc.owners.Update,
			])
			.as("update_kyc_owner");
		router
			.delete("/:subscriptionId/kyc-owners/:ownerId", [
				controllers.features.client.subscriptions.update.kyc.owners.Delete,
			])
			.as("delete_kyc_owner");
	})
	.use(middleware.auth({ guards: ["client"] }))
	.prefix("/client/subscriptions")
	.as("client.subscriptions");
