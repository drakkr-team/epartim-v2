/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
  admin: {
    accountManagement: {
      profile: {
        view: typeof routes['admin.account_management.profile.view']
      }
      authentication: {
        login: typeof routes['admin.account_management.authentication.login']
        logout: typeof routes['admin.account_management.authentication.logout']
      }
      onboarding: {
        activate: typeof routes['admin.account_management.onboarding.activate']
      }
      password: {
        forgot: typeof routes['admin.account_management.password.forgot']
        reset: typeof routes['admin.account_management.password.reset']
      }
    }
    admins: {
      list: typeof routes['admin.admins.list']
      create: typeof routes['admin.admins.create']
      view: typeof routes['admin.admins.view']
      update: typeof routes['admin.admins.update']
      delete: typeof routes['admin.admins.delete']
      resendOnboarding: typeof routes['admin.admins.resend_onboarding']
    }
    firms: {
      list: typeof routes['admin.firms.list']
      create: typeof routes['admin.firms.create']
      view: typeof routes['admin.firms.view']
      update: typeof routes['admin.firms.update']
      delete: typeof routes['admin.firms.delete']
    }
    networks: {
      list: typeof routes['admin.networks.list']
      create: typeof routes['admin.networks.create']
      view: typeof routes['admin.networks.view']
      update: typeof routes['admin.networks.update']
      delete: typeof routes['admin.networks.delete']
    }
    roles: {
      list: typeof routes['admin.roles.list']
      create: typeof routes['admin.roles.create']
      view: typeof routes['admin.roles.view']
      update: typeof routes['admin.roles.update']
      delete: typeof routes['admin.roles.delete']
    }
    users: {
      list: typeof routes['admin.users.list']
      create: typeof routes['admin.users.create']
      view: typeof routes['admin.users.view']
      update: typeof routes['admin.users.update']
      delete: typeof routes['admin.users.delete']
      resendOnboarding: typeof routes['admin.users.resend_onboarding']
    }
  }
  client: {
    accountManagement: {
      profile: {
        view: typeof routes['client.account_management.profile.view']
        update: typeof routes['client.account_management.profile.update']
        delete: typeof routes['client.account_management.profile.delete']
      }
      authentication: {
        login: typeof routes['client.account_management.authentication.login']
        logout: typeof routes['client.account_management.authentication.logout']
      }
      onboarding: {
        activate: typeof routes['client.account_management.onboarding.activate']
      }
      password: {
        forgot: typeof routes['client.account_management.password.forgot']
        reset: typeof routes['client.account_management.password.reset']
        update: typeof routes['client.account_management.password.update']
      }
    }
    subscriptions: {
      list: typeof routes['client.subscriptions.list']
      create: typeof routes['client.subscriptions.create']
      view: typeof routes['client.subscriptions.view']
      validateStep: typeof routes['client.subscriptions.validate_step']
      uploadDocument: typeof routes['client.subscriptions.upload_document']
      deleteDocument: typeof routes['client.subscriptions.delete_document']
      updateLegalIdentification: typeof routes['client.subscriptions.update_legal_identification']
      updateAddressAndBankDetails: typeof routes['client.subscriptions.update_address_and_bank_details']
      updateLegalAgent: typeof routes['client.subscriptions.update_legal_agent']
      updateSigner: typeof routes['client.subscriptions.update_signer']
      updateCorrespondent: typeof routes['client.subscriptions.update_correspondent']
      updateAuthorizations: typeof routes['client.subscriptions.update_authorizations']
      updateKycProfile: typeof routes['client.subscriptions.update_kyc_profile']
      createKycOwner: typeof routes['client.subscriptions.create_kyc_owner']
      updateKycOwner: typeof routes['client.subscriptions.update_kyc_owner']
      deleteKycOwner: typeof routes['client.subscriptions.delete_kyc_owner']
    }
  }
}
