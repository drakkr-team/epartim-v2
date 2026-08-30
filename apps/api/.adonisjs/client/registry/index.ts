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
    methods: ["PATCH"],
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
