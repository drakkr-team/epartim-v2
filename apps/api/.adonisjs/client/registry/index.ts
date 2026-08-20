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
  'admin.admin_management.authentication.login': {
    methods: ["POST"],
    pattern: '/admin/admin-management/authentication/login',
    tokens: [{"old":"/admin/admin-management/authentication/login","type":0,"val":"admin","end":""},{"old":"/admin/admin-management/authentication/login","type":0,"val":"admin-management","end":""},{"old":"/admin/admin-management/authentication/login","type":0,"val":"authentication","end":""},{"old":"/admin/admin-management/authentication/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['admin.admin_management.authentication.login']['types'],
  },
  'admin.admin_management.authentication.logout': {
    methods: ["DELETE"],
    pattern: '/admin/admin-management/authentication/logout',
    tokens: [{"old":"/admin/admin-management/authentication/logout","type":0,"val":"admin","end":""},{"old":"/admin/admin-management/authentication/logout","type":0,"val":"admin-management","end":""},{"old":"/admin/admin-management/authentication/logout","type":0,"val":"authentication","end":""},{"old":"/admin/admin-management/authentication/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['admin.admin_management.authentication.logout']['types'],
  },
  'admin.admin_management.profile.view': {
    methods: ["GET","HEAD"],
    pattern: '/admin/admin-management/profile',
    tokens: [{"old":"/admin/admin-management/profile","type":0,"val":"admin","end":""},{"old":"/admin/admin-management/profile","type":0,"val":"admin-management","end":""},{"old":"/admin/admin-management/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['admin.admin_management.profile.view']['types'],
  },
  'admin.admin_management.profile.update': {
    methods: ["PUT"],
    pattern: '/admin/admin-management/profile',
    tokens: [{"old":"/admin/admin-management/profile","type":0,"val":"admin","end":""},{"old":"/admin/admin-management/profile","type":0,"val":"admin-management","end":""},{"old":"/admin/admin-management/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['admin.admin_management.profile.update']['types'],
  },
  'admin.admin_management.profile.delete': {
    methods: ["DELETE"],
    pattern: '/admin/admin-management/profile',
    tokens: [{"old":"/admin/admin-management/profile","type":0,"val":"admin","end":""},{"old":"/admin/admin-management/profile","type":0,"val":"admin-management","end":""},{"old":"/admin/admin-management/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['admin.admin_management.profile.delete']['types'],
  },
  'admin.admin_management.password.forgot': {
    methods: ["POST"],
    pattern: '/admin/admin-management/password/forgot',
    tokens: [{"old":"/admin/admin-management/password/forgot","type":0,"val":"admin","end":""},{"old":"/admin/admin-management/password/forgot","type":0,"val":"admin-management","end":""},{"old":"/admin/admin-management/password/forgot","type":0,"val":"password","end":""},{"old":"/admin/admin-management/password/forgot","type":0,"val":"forgot","end":""}],
    types: placeholder as Registry['admin.admin_management.password.forgot']['types'],
  },
  'admin.admin_management.password.reset': {
    methods: ["POST"],
    pattern: '/admin/admin-management/password/reset',
    tokens: [{"old":"/admin/admin-management/password/reset","type":0,"val":"admin","end":""},{"old":"/admin/admin-management/password/reset","type":0,"val":"admin-management","end":""},{"old":"/admin/admin-management/password/reset","type":0,"val":"password","end":""},{"old":"/admin/admin-management/password/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['admin.admin_management.password.reset']['types'],
  },
  'admin.accept_invitation': {
    methods: ["POST"],
    pattern: '/admin/invitations/accept',
    tokens: [{"old":"/admin/invitations/accept","type":0,"val":"admin","end":""},{"old":"/admin/invitations/accept","type":0,"val":"invitations","end":""},{"old":"/admin/invitations/accept","type":0,"val":"accept","end":""}],
    types: placeholder as Registry['admin.accept_invitation']['types'],
  },
  'admin.user_options': {
    methods: ["GET","HEAD"],
    pattern: '/admin/users/options',
    tokens: [{"old":"/admin/users/options","type":0,"val":"admin","end":""},{"old":"/admin/users/options","type":0,"val":"users","end":""},{"old":"/admin/users/options","type":0,"val":"options","end":""}],
    types: placeholder as Registry['admin.user_options']['types'],
  },
  'admin.list_users': {
    methods: ["GET","HEAD"],
    pattern: '/admin/users',
    tokens: [{"old":"/admin/users","type":0,"val":"admin","end":""},{"old":"/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.list_users']['types'],
  },
  'admin.create_user': {
    methods: ["POST"],
    pattern: '/admin/users',
    tokens: [{"old":"/admin/users","type":0,"val":"admin","end":""},{"old":"/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.create_user']['types'],
  },
  'admin.view_user': {
    methods: ["GET","HEAD"],
    pattern: '/admin/users/:id',
    tokens: [{"old":"/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/admin/users/:id","type":0,"val":"users","end":""},{"old":"/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.view_user']['types'],
  },
  'admin.update_user': {
    methods: ["PUT"],
    pattern: '/admin/users/:id',
    tokens: [{"old":"/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/admin/users/:id","type":0,"val":"users","end":""},{"old":"/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.update_user']['types'],
  },
  'admin.resend_invitation': {
    methods: ["POST"],
    pattern: '/admin/users/:id/invitations/resend',
    tokens: [{"old":"/admin/users/:id/invitations/resend","type":0,"val":"admin","end":""},{"old":"/admin/users/:id/invitations/resend","type":0,"val":"users","end":""},{"old":"/admin/users/:id/invitations/resend","type":1,"val":"id","end":""},{"old":"/admin/users/:id/invitations/resend","type":0,"val":"invitations","end":""},{"old":"/admin/users/:id/invitations/resend","type":0,"val":"resend","end":""}],
    types: placeholder as Registry['admin.resend_invitation']['types'],
  },
  'admin.cancel_invitation': {
    methods: ["POST"],
    pattern: '/admin/users/:id/invitations/cancel',
    tokens: [{"old":"/admin/users/:id/invitations/cancel","type":0,"val":"admin","end":""},{"old":"/admin/users/:id/invitations/cancel","type":0,"val":"users","end":""},{"old":"/admin/users/:id/invitations/cancel","type":1,"val":"id","end":""},{"old":"/admin/users/:id/invitations/cancel","type":0,"val":"invitations","end":""},{"old":"/admin/users/:id/invitations/cancel","type":0,"val":"cancel","end":""}],
    types: placeholder as Registry['admin.cancel_invitation']['types'],
  },
  'admin.disable_user': {
    methods: ["POST"],
    pattern: '/admin/users/:id/disable',
    tokens: [{"old":"/admin/users/:id/disable","type":0,"val":"admin","end":""},{"old":"/admin/users/:id/disable","type":0,"val":"users","end":""},{"old":"/admin/users/:id/disable","type":1,"val":"id","end":""},{"old":"/admin/users/:id/disable","type":0,"val":"disable","end":""}],
    types: placeholder as Registry['admin.disable_user']['types'],
  },
  'admin.reactivate_user': {
    methods: ["POST"],
    pattern: '/admin/users/:id/reactivate',
    tokens: [{"old":"/admin/users/:id/reactivate","type":0,"val":"admin","end":""},{"old":"/admin/users/:id/reactivate","type":0,"val":"users","end":""},{"old":"/admin/users/:id/reactivate","type":1,"val":"id","end":""},{"old":"/admin/users/:id/reactivate","type":0,"val":"reactivate","end":""}],
    types: placeholder as Registry['admin.reactivate_user']['types'],
  },
  'client.user_management.authentication.login': {
    methods: ["POST"],
    pattern: '/client/user-management/authentication/login',
    tokens: [{"old":"/client/user-management/authentication/login","type":0,"val":"client","end":""},{"old":"/client/user-management/authentication/login","type":0,"val":"user-management","end":""},{"old":"/client/user-management/authentication/login","type":0,"val":"authentication","end":""},{"old":"/client/user-management/authentication/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['client.user_management.authentication.login']['types'],
  },
  'client.user_management.authentication.logout': {
    methods: ["DELETE"],
    pattern: '/client/user-management/authentication/logout',
    tokens: [{"old":"/client/user-management/authentication/logout","type":0,"val":"client","end":""},{"old":"/client/user-management/authentication/logout","type":0,"val":"user-management","end":""},{"old":"/client/user-management/authentication/logout","type":0,"val":"authentication","end":""},{"old":"/client/user-management/authentication/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['client.user_management.authentication.logout']['types'],
  },
  'client.user_management.password.forgot': {
    methods: ["POST"],
    pattern: '/client/user-management/password/forgot',
    tokens: [{"old":"/client/user-management/password/forgot","type":0,"val":"client","end":""},{"old":"/client/user-management/password/forgot","type":0,"val":"user-management","end":""},{"old":"/client/user-management/password/forgot","type":0,"val":"password","end":""},{"old":"/client/user-management/password/forgot","type":0,"val":"forgot","end":""}],
    types: placeholder as Registry['client.user_management.password.forgot']['types'],
  },
  'client.user_management.password.reset': {
    methods: ["POST"],
    pattern: '/client/user-management/password/reset',
    tokens: [{"old":"/client/user-management/password/reset","type":0,"val":"client","end":""},{"old":"/client/user-management/password/reset","type":0,"val":"user-management","end":""},{"old":"/client/user-management/password/reset","type":0,"val":"password","end":""},{"old":"/client/user-management/password/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['client.user_management.password.reset']['types'],
  },
  'client.user_management.password.update': {
    methods: ["PUT"],
    pattern: '/client/user-management/password',
    tokens: [{"old":"/client/user-management/password","type":0,"val":"client","end":""},{"old":"/client/user-management/password","type":0,"val":"user-management","end":""},{"old":"/client/user-management/password","type":0,"val":"password","end":""}],
    types: placeholder as Registry['client.user_management.password.update']['types'],
  },
  'client.user_management.profile.view': {
    methods: ["GET","HEAD"],
    pattern: '/client/user-management/profile',
    tokens: [{"old":"/client/user-management/profile","type":0,"val":"client","end":""},{"old":"/client/user-management/profile","type":0,"val":"user-management","end":""},{"old":"/client/user-management/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['client.user_management.profile.view']['types'],
  },
  'client.user_management.profile.update': {
    methods: ["PUT"],
    pattern: '/client/user-management/profile',
    tokens: [{"old":"/client/user-management/profile","type":0,"val":"client","end":""},{"old":"/client/user-management/profile","type":0,"val":"user-management","end":""},{"old":"/client/user-management/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['client.user_management.profile.update']['types'],
  },
  'client.user_management.profile.delete': {
    methods: ["DELETE"],
    pattern: '/client/user-management/profile',
    tokens: [{"old":"/client/user-management/profile","type":0,"val":"client","end":""},{"old":"/client/user-management/profile","type":0,"val":"user-management","end":""},{"old":"/client/user-management/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['client.user_management.profile.delete']['types'],
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
