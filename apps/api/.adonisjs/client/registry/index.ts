/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'drive.fs.serve': {
    methods: ["GET","HEAD"],
    pattern: '/uploads/*',
    tokens: [{"old":"/uploads/*","type":0,"val":"uploads","end":""},{"old":"/uploads/*","type":2,"val":"*","end":""}],
    types: placeholder as Registry['drive.fs.serve']['types'],
  },
  'admin.account_management.profile.view': {
    methods: ["GET","HEAD"],
    pattern: '/admin/account-management/profile',
    tokens: [{"old":"/admin/account-management/profile","type":0,"val":"admin","end":""},{"old":"/admin/account-management/profile","type":0,"val":"account-management","end":""},{"old":"/admin/account-management/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['admin.account_management.profile.view']['types'],
  },
  'admin.admins.list': {
    methods: ["GET","HEAD"],
    pattern: '/admin/admins',
    tokens: [{"old":"/admin/admins","type":0,"val":"admin","end":""},{"old":"/admin/admins","type":0,"val":"admins","end":""}],
    types: placeholder as Registry['admin.admins.list']['types'],
  },
  'admin.admins.create': {
    methods: ["POST"],
    pattern: '/admin/admins',
    tokens: [{"old":"/admin/admins","type":0,"val":"admin","end":""},{"old":"/admin/admins","type":0,"val":"admins","end":""}],
    types: placeholder as Registry['admin.admins.create']['types'],
  },
  'admin.admins.view': {
    methods: ["GET","HEAD"],
    pattern: '/admin/admins/:adminId',
    tokens: [{"old":"/admin/admins/:adminId","type":0,"val":"admin","end":""},{"old":"/admin/admins/:adminId","type":0,"val":"admins","end":""},{"old":"/admin/admins/:adminId","type":1,"val":"adminId","end":""}],
    types: placeholder as Registry['admin.admins.view']['types'],
  },
  'admin.admins.update': {
    methods: ["PUT"],
    pattern: '/admin/admins/:adminId',
    tokens: [{"old":"/admin/admins/:adminId","type":0,"val":"admin","end":""},{"old":"/admin/admins/:adminId","type":0,"val":"admins","end":""},{"old":"/admin/admins/:adminId","type":1,"val":"adminId","end":""}],
    types: placeholder as Registry['admin.admins.update']['types'],
  },
  'admin.admins.delete': {
    methods: ["DELETE"],
    pattern: '/admin/admins/:adminId',
    tokens: [{"old":"/admin/admins/:adminId","type":0,"val":"admin","end":""},{"old":"/admin/admins/:adminId","type":0,"val":"admins","end":""},{"old":"/admin/admins/:adminId","type":1,"val":"adminId","end":""}],
    types: placeholder as Registry['admin.admins.delete']['types'],
  },
  'admin.admins.resend_onboarding': {
    methods: ["POST"],
    pattern: '/admin/admins/:adminId/resend-onboarding',
    tokens: [{"old":"/admin/admins/:adminId/resend-onboarding","type":0,"val":"admin","end":""},{"old":"/admin/admins/:adminId/resend-onboarding","type":0,"val":"admins","end":""},{"old":"/admin/admins/:adminId/resend-onboarding","type":1,"val":"adminId","end":""},{"old":"/admin/admins/:adminId/resend-onboarding","type":0,"val":"resend-onboarding","end":""}],
    types: placeholder as Registry['admin.admins.resend_onboarding']['types'],
  },
  'admin.firms.list': {
    methods: ["GET","HEAD"],
    pattern: '/admin/firms',
    tokens: [{"old":"/admin/firms","type":0,"val":"admin","end":""},{"old":"/admin/firms","type":0,"val":"firms","end":""}],
    types: placeholder as Registry['admin.firms.list']['types'],
  },
  'admin.firms.create': {
    methods: ["POST"],
    pattern: '/admin/firms',
    tokens: [{"old":"/admin/firms","type":0,"val":"admin","end":""},{"old":"/admin/firms","type":0,"val":"firms","end":""}],
    types: placeholder as Registry['admin.firms.create']['types'],
  },
  'admin.firms.view': {
    methods: ["GET","HEAD"],
    pattern: '/admin/firms/:firmId',
    tokens: [{"old":"/admin/firms/:firmId","type":0,"val":"admin","end":""},{"old":"/admin/firms/:firmId","type":0,"val":"firms","end":""},{"old":"/admin/firms/:firmId","type":1,"val":"firmId","end":""}],
    types: placeholder as Registry['admin.firms.view']['types'],
  },
  'admin.firms.update': {
    methods: ["PUT"],
    pattern: '/admin/firms/:firmId',
    tokens: [{"old":"/admin/firms/:firmId","type":0,"val":"admin","end":""},{"old":"/admin/firms/:firmId","type":0,"val":"firms","end":""},{"old":"/admin/firms/:firmId","type":1,"val":"firmId","end":""}],
    types: placeholder as Registry['admin.firms.update']['types'],
  },
  'admin.firms.delete': {
    methods: ["DELETE"],
    pattern: '/admin/firms/:firmId',
    tokens: [{"old":"/admin/firms/:firmId","type":0,"val":"admin","end":""},{"old":"/admin/firms/:firmId","type":0,"val":"firms","end":""},{"old":"/admin/firms/:firmId","type":1,"val":"firmId","end":""}],
    types: placeholder as Registry['admin.firms.delete']['types'],
  },
  'admin.networks.list': {
    methods: ["GET","HEAD"],
    pattern: '/admin/networks',
    tokens: [{"old":"/admin/networks","type":0,"val":"admin","end":""},{"old":"/admin/networks","type":0,"val":"networks","end":""}],
    types: placeholder as Registry['admin.networks.list']['types'],
  },
  'admin.networks.create': {
    methods: ["POST"],
    pattern: '/admin/networks',
    tokens: [{"old":"/admin/networks","type":0,"val":"admin","end":""},{"old":"/admin/networks","type":0,"val":"networks","end":""}],
    types: placeholder as Registry['admin.networks.create']['types'],
  },
  'admin.networks.view': {
    methods: ["GET","HEAD"],
    pattern: '/admin/networks/:networkId',
    tokens: [{"old":"/admin/networks/:networkId","type":0,"val":"admin","end":""},{"old":"/admin/networks/:networkId","type":0,"val":"networks","end":""},{"old":"/admin/networks/:networkId","type":1,"val":"networkId","end":""}],
    types: placeholder as Registry['admin.networks.view']['types'],
  },
  'admin.networks.update': {
    methods: ["PUT"],
    pattern: '/admin/networks/:networkId',
    tokens: [{"old":"/admin/networks/:networkId","type":0,"val":"admin","end":""},{"old":"/admin/networks/:networkId","type":0,"val":"networks","end":""},{"old":"/admin/networks/:networkId","type":1,"val":"networkId","end":""}],
    types: placeholder as Registry['admin.networks.update']['types'],
  },
  'admin.networks.delete': {
    methods: ["DELETE"],
    pattern: '/admin/networks/:networkId',
    tokens: [{"old":"/admin/networks/:networkId","type":0,"val":"admin","end":""},{"old":"/admin/networks/:networkId","type":0,"val":"networks","end":""},{"old":"/admin/networks/:networkId","type":1,"val":"networkId","end":""}],
    types: placeholder as Registry['admin.networks.delete']['types'],
  },
  'admin.roles.list': {
    methods: ["GET","HEAD"],
    pattern: '/admin/roles',
    tokens: [{"old":"/admin/roles","type":0,"val":"admin","end":""},{"old":"/admin/roles","type":0,"val":"roles","end":""}],
    types: placeholder as Registry['admin.roles.list']['types'],
  },
  'admin.roles.create': {
    methods: ["POST"],
    pattern: '/admin/roles',
    tokens: [{"old":"/admin/roles","type":0,"val":"admin","end":""},{"old":"/admin/roles","type":0,"val":"roles","end":""}],
    types: placeholder as Registry['admin.roles.create']['types'],
  },
  'admin.roles.view': {
    methods: ["GET","HEAD"],
    pattern: '/admin/roles/:roleId',
    tokens: [{"old":"/admin/roles/:roleId","type":0,"val":"admin","end":""},{"old":"/admin/roles/:roleId","type":0,"val":"roles","end":""},{"old":"/admin/roles/:roleId","type":1,"val":"roleId","end":""}],
    types: placeholder as Registry['admin.roles.view']['types'],
  },
  'admin.roles.update': {
    methods: ["PUT"],
    pattern: '/admin/roles/:roleId',
    tokens: [{"old":"/admin/roles/:roleId","type":0,"val":"admin","end":""},{"old":"/admin/roles/:roleId","type":0,"val":"roles","end":""},{"old":"/admin/roles/:roleId","type":1,"val":"roleId","end":""}],
    types: placeholder as Registry['admin.roles.update']['types'],
  },
  'admin.roles.delete': {
    methods: ["DELETE"],
    pattern: '/admin/roles/:roleId',
    tokens: [{"old":"/admin/roles/:roleId","type":0,"val":"admin","end":""},{"old":"/admin/roles/:roleId","type":0,"val":"roles","end":""},{"old":"/admin/roles/:roleId","type":1,"val":"roleId","end":""}],
    types: placeholder as Registry['admin.roles.delete']['types'],
  },
  'admin.users.list': {
    methods: ["GET","HEAD"],
    pattern: '/admin/users',
    tokens: [{"old":"/admin/users","type":0,"val":"admin","end":""},{"old":"/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.users.list']['types'],
  },
  'admin.users.create': {
    methods: ["POST"],
    pattern: '/admin/users',
    tokens: [{"old":"/admin/users","type":0,"val":"admin","end":""},{"old":"/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.users.create']['types'],
  },
  'admin.users.view': {
    methods: ["GET","HEAD"],
    pattern: '/admin/users/:userId',
    tokens: [{"old":"/admin/users/:userId","type":0,"val":"admin","end":""},{"old":"/admin/users/:userId","type":0,"val":"users","end":""},{"old":"/admin/users/:userId","type":1,"val":"userId","end":""}],
    types: placeholder as Registry['admin.users.view']['types'],
  },
  'admin.users.update': {
    methods: ["PUT"],
    pattern: '/admin/users/:userId',
    tokens: [{"old":"/admin/users/:userId","type":0,"val":"admin","end":""},{"old":"/admin/users/:userId","type":0,"val":"users","end":""},{"old":"/admin/users/:userId","type":1,"val":"userId","end":""}],
    types: placeholder as Registry['admin.users.update']['types'],
  },
  'admin.users.delete': {
    methods: ["DELETE"],
    pattern: '/admin/users/:userId',
    tokens: [{"old":"/admin/users/:userId","type":0,"val":"admin","end":""},{"old":"/admin/users/:userId","type":0,"val":"users","end":""},{"old":"/admin/users/:userId","type":1,"val":"userId","end":""}],
    types: placeholder as Registry['admin.users.delete']['types'],
  },
  'admin.users.resend_onboarding': {
    methods: ["POST"],
    pattern: '/admin/users/:userId/resend-onboarding',
    tokens: [{"old":"/admin/users/:userId/resend-onboarding","type":0,"val":"admin","end":""},{"old":"/admin/users/:userId/resend-onboarding","type":0,"val":"users","end":""},{"old":"/admin/users/:userId/resend-onboarding","type":1,"val":"userId","end":""},{"old":"/admin/users/:userId/resend-onboarding","type":0,"val":"resend-onboarding","end":""}],
    types: placeholder as Registry['admin.users.resend_onboarding']['types'],
  },
  'client.account_management.profile.view': {
    methods: ["GET","HEAD"],
    pattern: '/client/account-management/profile',
    tokens: [{"old":"/client/account-management/profile","type":0,"val":"client","end":""},{"old":"/client/account-management/profile","type":0,"val":"account-management","end":""},{"old":"/client/account-management/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['client.account_management.profile.view']['types'],
  },
  'client.account_management.profile.update': {
    methods: ["PUT"],
    pattern: '/client/account-management/profile',
    tokens: [{"old":"/client/account-management/profile","type":0,"val":"client","end":""},{"old":"/client/account-management/profile","type":0,"val":"account-management","end":""},{"old":"/client/account-management/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['client.account_management.profile.update']['types'],
  },
  'client.account_management.profile.delete': {
    methods: ["DELETE"],
    pattern: '/client/account-management/profile',
    tokens: [{"old":"/client/account-management/profile","type":0,"val":"client","end":""},{"old":"/client/account-management/profile","type":0,"val":"account-management","end":""},{"old":"/client/account-management/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['client.account_management.profile.delete']['types'],
  },
  'client.subscriptions.list': {
    methods: ["GET","HEAD"],
    pattern: '/client/subscriptions',
    tokens: [{"old":"/client/subscriptions","type":0,"val":"client","end":""},{"old":"/client/subscriptions","type":0,"val":"subscriptions","end":""}],
    types: placeholder as Registry['client.subscriptions.list']['types'],
  },
  'client.subscriptions.create': {
    methods: ["POST"],
    pattern: '/client/subscriptions',
    tokens: [{"old":"/client/subscriptions","type":0,"val":"client","end":""},{"old":"/client/subscriptions","type":0,"val":"subscriptions","end":""}],
    types: placeholder as Registry['client.subscriptions.create']['types'],
  },
  'client.subscriptions.view': {
    methods: ["GET","HEAD"],
    pattern: '/client/subscriptions/:subscriptionId',
    tokens: [{"old":"/client/subscriptions/:subscriptionId","type":0,"val":"client","end":""},{"old":"/client/subscriptions/:subscriptionId","type":0,"val":"subscriptions","end":""},{"old":"/client/subscriptions/:subscriptionId","type":1,"val":"subscriptionId","end":""}],
    types: placeholder as Registry['client.subscriptions.view']['types'],
  },
  'client.subscriptions.validate_step': {
    methods: ["POST"],
    pattern: '/client/subscriptions/:subscriptionId/steps/:step/validate',
    tokens: [{"old":"/client/subscriptions/:subscriptionId/steps/:step/validate","type":0,"val":"client","end":""},{"old":"/client/subscriptions/:subscriptionId/steps/:step/validate","type":0,"val":"subscriptions","end":""},{"old":"/client/subscriptions/:subscriptionId/steps/:step/validate","type":1,"val":"subscriptionId","end":""},{"old":"/client/subscriptions/:subscriptionId/steps/:step/validate","type":0,"val":"steps","end":""},{"old":"/client/subscriptions/:subscriptionId/steps/:step/validate","type":1,"val":"step","end":""},{"old":"/client/subscriptions/:subscriptionId/steps/:step/validate","type":0,"val":"validate","end":""}],
    types: placeholder as Registry['client.subscriptions.validate_step']['types'],
  },
  'client.subscriptions.upload_document': {
    methods: ["POST"],
    pattern: '/client/subscriptions/:subscriptionId/documents/:documentType',
    tokens: [{"old":"/client/subscriptions/:subscriptionId/documents/:documentType","type":0,"val":"client","end":""},{"old":"/client/subscriptions/:subscriptionId/documents/:documentType","type":0,"val":"subscriptions","end":""},{"old":"/client/subscriptions/:subscriptionId/documents/:documentType","type":1,"val":"subscriptionId","end":""},{"old":"/client/subscriptions/:subscriptionId/documents/:documentType","type":0,"val":"documents","end":""},{"old":"/client/subscriptions/:subscriptionId/documents/:documentType","type":1,"val":"documentType","end":""}],
    types: placeholder as Registry['client.subscriptions.upload_document']['types'],
  },
  'client.subscriptions.delete_document': {
    methods: ["DELETE"],
    pattern: '/client/subscriptions/:subscriptionId/documents/:documentType',
    tokens: [{"old":"/client/subscriptions/:subscriptionId/documents/:documentType","type":0,"val":"client","end":""},{"old":"/client/subscriptions/:subscriptionId/documents/:documentType","type":0,"val":"subscriptions","end":""},{"old":"/client/subscriptions/:subscriptionId/documents/:documentType","type":1,"val":"subscriptionId","end":""},{"old":"/client/subscriptions/:subscriptionId/documents/:documentType","type":0,"val":"documents","end":""},{"old":"/client/subscriptions/:subscriptionId/documents/:documentType","type":1,"val":"documentType","end":""}],
    types: placeholder as Registry['client.subscriptions.delete_document']['types'],
  },
  'client.subscriptions.update_legal_identification': {
    methods: ["PUT"],
    pattern: '/client/subscriptions/:subscriptionId/legal-identification',
    tokens: [{"old":"/client/subscriptions/:subscriptionId/legal-identification","type":0,"val":"client","end":""},{"old":"/client/subscriptions/:subscriptionId/legal-identification","type":0,"val":"subscriptions","end":""},{"old":"/client/subscriptions/:subscriptionId/legal-identification","type":1,"val":"subscriptionId","end":""},{"old":"/client/subscriptions/:subscriptionId/legal-identification","type":0,"val":"legal-identification","end":""}],
    types: placeholder as Registry['client.subscriptions.update_legal_identification']['types'],
  },
  'client.subscriptions.update_address_and_bank_details': {
    methods: ["PUT"],
    pattern: '/client/subscriptions/:subscriptionId/address-and-bank-details',
    tokens: [{"old":"/client/subscriptions/:subscriptionId/address-and-bank-details","type":0,"val":"client","end":""},{"old":"/client/subscriptions/:subscriptionId/address-and-bank-details","type":0,"val":"subscriptions","end":""},{"old":"/client/subscriptions/:subscriptionId/address-and-bank-details","type":1,"val":"subscriptionId","end":""},{"old":"/client/subscriptions/:subscriptionId/address-and-bank-details","type":0,"val":"address-and-bank-details","end":""}],
    types: placeholder as Registry['client.subscriptions.update_address_and_bank_details']['types'],
  },
  'client.subscriptions.update_legal_agent': {
    methods: ["PUT"],
    pattern: '/client/subscriptions/:subscriptionId/representatives/legal-agent',
    tokens: [{"old":"/client/subscriptions/:subscriptionId/representatives/legal-agent","type":0,"val":"client","end":""},{"old":"/client/subscriptions/:subscriptionId/representatives/legal-agent","type":0,"val":"subscriptions","end":""},{"old":"/client/subscriptions/:subscriptionId/representatives/legal-agent","type":1,"val":"subscriptionId","end":""},{"old":"/client/subscriptions/:subscriptionId/representatives/legal-agent","type":0,"val":"representatives","end":""},{"old":"/client/subscriptions/:subscriptionId/representatives/legal-agent","type":0,"val":"legal-agent","end":""}],
    types: placeholder as Registry['client.subscriptions.update_legal_agent']['types'],
  },
  'client.subscriptions.update_signer': {
    methods: ["PUT"],
    pattern: '/client/subscriptions/:subscriptionId/representatives/signer',
    tokens: [{"old":"/client/subscriptions/:subscriptionId/representatives/signer","type":0,"val":"client","end":""},{"old":"/client/subscriptions/:subscriptionId/representatives/signer","type":0,"val":"subscriptions","end":""},{"old":"/client/subscriptions/:subscriptionId/representatives/signer","type":1,"val":"subscriptionId","end":""},{"old":"/client/subscriptions/:subscriptionId/representatives/signer","type":0,"val":"representatives","end":""},{"old":"/client/subscriptions/:subscriptionId/representatives/signer","type":0,"val":"signer","end":""}],
    types: placeholder as Registry['client.subscriptions.update_signer']['types'],
  },
  'client.subscriptions.update_correspondent': {
    methods: ["PUT"],
    pattern: '/client/subscriptions/:subscriptionId/representatives/correspondent',
    tokens: [{"old":"/client/subscriptions/:subscriptionId/representatives/correspondent","type":0,"val":"client","end":""},{"old":"/client/subscriptions/:subscriptionId/representatives/correspondent","type":0,"val":"subscriptions","end":""},{"old":"/client/subscriptions/:subscriptionId/representatives/correspondent","type":1,"val":"subscriptionId","end":""},{"old":"/client/subscriptions/:subscriptionId/representatives/correspondent","type":0,"val":"representatives","end":""},{"old":"/client/subscriptions/:subscriptionId/representatives/correspondent","type":0,"val":"correspondent","end":""}],
    types: placeholder as Registry['client.subscriptions.update_correspondent']['types'],
  },
  'client.subscriptions.update_authorizations': {
    methods: ["PUT"],
    pattern: '/client/subscriptions/:subscriptionId/authorizations',
    tokens: [{"old":"/client/subscriptions/:subscriptionId/authorizations","type":0,"val":"client","end":""},{"old":"/client/subscriptions/:subscriptionId/authorizations","type":0,"val":"subscriptions","end":""},{"old":"/client/subscriptions/:subscriptionId/authorizations","type":1,"val":"subscriptionId","end":""},{"old":"/client/subscriptions/:subscriptionId/authorizations","type":0,"val":"authorizations","end":""}],
    types: placeholder as Registry['client.subscriptions.update_authorizations']['types'],
  },
  'client.subscriptions.update_kyc_profile': {
    methods: ["PUT"],
    pattern: '/client/subscriptions/:subscriptionId/kyc-profile',
    tokens: [{"old":"/client/subscriptions/:subscriptionId/kyc-profile","type":0,"val":"client","end":""},{"old":"/client/subscriptions/:subscriptionId/kyc-profile","type":0,"val":"subscriptions","end":""},{"old":"/client/subscriptions/:subscriptionId/kyc-profile","type":1,"val":"subscriptionId","end":""},{"old":"/client/subscriptions/:subscriptionId/kyc-profile","type":0,"val":"kyc-profile","end":""}],
    types: placeholder as Registry['client.subscriptions.update_kyc_profile']['types'],
  },
  'admin.account_management.authentication.login': {
    methods: ["POST"],
    pattern: '/admin/account-management/authentication/login',
    tokens: [{"old":"/admin/account-management/authentication/login","type":0,"val":"admin","end":""},{"old":"/admin/account-management/authentication/login","type":0,"val":"account-management","end":""},{"old":"/admin/account-management/authentication/login","type":0,"val":"authentication","end":""},{"old":"/admin/account-management/authentication/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['admin.account_management.authentication.login']['types'],
  },
  'admin.account_management.authentication.logout': {
    methods: ["DELETE"],
    pattern: '/admin/account-management/authentication/logout',
    tokens: [{"old":"/admin/account-management/authentication/logout","type":0,"val":"admin","end":""},{"old":"/admin/account-management/authentication/logout","type":0,"val":"account-management","end":""},{"old":"/admin/account-management/authentication/logout","type":0,"val":"authentication","end":""},{"old":"/admin/account-management/authentication/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['admin.account_management.authentication.logout']['types'],
  },
  'admin.account_management.onboarding.activate': {
    methods: ["POST"],
    pattern: '/admin/account_management/onboarding/activate',
    tokens: [{"old":"/admin/account_management/onboarding/activate","type":0,"val":"admin","end":""},{"old":"/admin/account_management/onboarding/activate","type":0,"val":"account_management","end":""},{"old":"/admin/account_management/onboarding/activate","type":0,"val":"onboarding","end":""},{"old":"/admin/account_management/onboarding/activate","type":0,"val":"activate","end":""}],
    types: placeholder as Registry['admin.account_management.onboarding.activate']['types'],
  },
  'admin.account_management.password.forgot': {
    methods: ["POST"],
    pattern: '/admin/account-management/password/forgot',
    tokens: [{"old":"/admin/account-management/password/forgot","type":0,"val":"admin","end":""},{"old":"/admin/account-management/password/forgot","type":0,"val":"account-management","end":""},{"old":"/admin/account-management/password/forgot","type":0,"val":"password","end":""},{"old":"/admin/account-management/password/forgot","type":0,"val":"forgot","end":""}],
    types: placeholder as Registry['admin.account_management.password.forgot']['types'],
  },
  'admin.account_management.password.reset': {
    methods: ["POST"],
    pattern: '/admin/account-management/password/reset',
    tokens: [{"old":"/admin/account-management/password/reset","type":0,"val":"admin","end":""},{"old":"/admin/account-management/password/reset","type":0,"val":"account-management","end":""},{"old":"/admin/account-management/password/reset","type":0,"val":"password","end":""},{"old":"/admin/account-management/password/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['admin.account_management.password.reset']['types'],
  },
  'client.account_management.authentication.login': {
    methods: ["POST"],
    pattern: '/client/account-management/authentication/login',
    tokens: [{"old":"/client/account-management/authentication/login","type":0,"val":"client","end":""},{"old":"/client/account-management/authentication/login","type":0,"val":"account-management","end":""},{"old":"/client/account-management/authentication/login","type":0,"val":"authentication","end":""},{"old":"/client/account-management/authentication/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['client.account_management.authentication.login']['types'],
  },
  'client.account_management.authentication.logout': {
    methods: ["DELETE"],
    pattern: '/client/account-management/authentication/logout',
    tokens: [{"old":"/client/account-management/authentication/logout","type":0,"val":"client","end":""},{"old":"/client/account-management/authentication/logout","type":0,"val":"account-management","end":""},{"old":"/client/account-management/authentication/logout","type":0,"val":"authentication","end":""},{"old":"/client/account-management/authentication/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['client.account_management.authentication.logout']['types'],
  },
  'client.account_management.onboarding.activate': {
    methods: ["POST"],
    pattern: '/client/account-management/onboarding/activate',
    tokens: [{"old":"/client/account-management/onboarding/activate","type":0,"val":"client","end":""},{"old":"/client/account-management/onboarding/activate","type":0,"val":"account-management","end":""},{"old":"/client/account-management/onboarding/activate","type":0,"val":"onboarding","end":""},{"old":"/client/account-management/onboarding/activate","type":0,"val":"activate","end":""}],
    types: placeholder as Registry['client.account_management.onboarding.activate']['types'],
  },
  'client.account_management.password.forgot': {
    methods: ["POST"],
    pattern: '/client/account-management/password/forgot',
    tokens: [{"old":"/client/account-management/password/forgot","type":0,"val":"client","end":""},{"old":"/client/account-management/password/forgot","type":0,"val":"account-management","end":""},{"old":"/client/account-management/password/forgot","type":0,"val":"password","end":""},{"old":"/client/account-management/password/forgot","type":0,"val":"forgot","end":""}],
    types: placeholder as Registry['client.account_management.password.forgot']['types'],
  },
  'client.account_management.password.reset': {
    methods: ["POST"],
    pattern: '/client/account-management/password/reset',
    tokens: [{"old":"/client/account-management/password/reset","type":0,"val":"client","end":""},{"old":"/client/account-management/password/reset","type":0,"val":"account-management","end":""},{"old":"/client/account-management/password/reset","type":0,"val":"password","end":""},{"old":"/client/account-management/password/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['client.account_management.password.reset']['types'],
  },
  'client.account_management.password.update': {
    methods: ["PUT"],
    pattern: '/client/account-management/password',
    tokens: [{"old":"/client/account-management/password","type":0,"val":"client","end":""},{"old":"/client/account-management/password","type":0,"val":"account-management","end":""},{"old":"/client/account-management/password","type":0,"val":"password","end":""}],
    types: placeholder as Registry['client.account_management.password.update']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
