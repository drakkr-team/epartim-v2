import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'admin.account_management.profile.view': { paramsTuple?: []; params?: {} }
    'admin.admins.list': { paramsTuple?: []; params?: {} }
    'admin.admins.create': { paramsTuple?: []; params?: {} }
    'admin.admins.view': { paramsTuple: [ParamValue]; params: {'adminId': ParamValue} }
    'admin.admins.update': { paramsTuple: [ParamValue]; params: {'adminId': ParamValue} }
    'admin.admins.delete': { paramsTuple: [ParamValue]; params: {'adminId': ParamValue} }
    'admin.networks.list': { paramsTuple?: []; params?: {} }
    'admin.networks.create': { paramsTuple?: []; params?: {} }
    'admin.networks.view': { paramsTuple: [ParamValue]; params: {'networkId': ParamValue} }
    'admin.users.list': { paramsTuple?: []; params?: {} }
    'admin.users.create': { paramsTuple?: []; params?: {} }
    'admin.users.view': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'admin.users.delete': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'client.account_management.profile.view': { paramsTuple?: []; params?: {} }
    'client.account_management.profile.update': { paramsTuple?: []; params?: {} }
    'client.account_management.profile.delete': { paramsTuple?: []; params?: {} }
    'admin.account_management.authentication.login': { paramsTuple?: []; params?: {} }
    'admin.account_management.authentication.logout': { paramsTuple?: []; params?: {} }
    'admin.account_management.password.forgot': { paramsTuple?: []; params?: {} }
    'admin.account_management.password.reset': { paramsTuple?: []; params?: {} }
    'client.account_management.authentication.login': { paramsTuple?: []; params?: {} }
    'client.account_management.authentication.logout': { paramsTuple?: []; params?: {} }
    'client.account_management.password.forgot': { paramsTuple?: []; params?: {} }
    'client.account_management.password.reset': { paramsTuple?: []; params?: {} }
    'client.account_management.password.update': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'admin.account_management.profile.view': { paramsTuple?: []; params?: {} }
    'admin.admins.list': { paramsTuple?: []; params?: {} }
    'admin.admins.view': { paramsTuple: [ParamValue]; params: {'adminId': ParamValue} }
    'admin.networks.list': { paramsTuple?: []; params?: {} }
    'admin.networks.view': { paramsTuple: [ParamValue]; params: {'networkId': ParamValue} }
    'admin.users.list': { paramsTuple?: []; params?: {} }
    'admin.users.view': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'client.account_management.profile.view': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'admin.account_management.profile.view': { paramsTuple?: []; params?: {} }
    'admin.admins.list': { paramsTuple?: []; params?: {} }
    'admin.admins.view': { paramsTuple: [ParamValue]; params: {'adminId': ParamValue} }
    'admin.networks.list': { paramsTuple?: []; params?: {} }
    'admin.networks.view': { paramsTuple: [ParamValue]; params: {'networkId': ParamValue} }
    'admin.users.list': { paramsTuple?: []; params?: {} }
    'admin.users.view': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'client.account_management.profile.view': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'admin.admins.create': { paramsTuple?: []; params?: {} }
    'admin.networks.create': { paramsTuple?: []; params?: {} }
    'admin.users.create': { paramsTuple?: []; params?: {} }
    'admin.account_management.authentication.login': { paramsTuple?: []; params?: {} }
    'admin.account_management.password.forgot': { paramsTuple?: []; params?: {} }
    'admin.account_management.password.reset': { paramsTuple?: []; params?: {} }
    'client.account_management.authentication.login': { paramsTuple?: []; params?: {} }
    'client.account_management.password.forgot': { paramsTuple?: []; params?: {} }
    'client.account_management.password.reset': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'admin.admins.update': { paramsTuple: [ParamValue]; params: {'adminId': ParamValue} }
    'client.account_management.profile.update': { paramsTuple?: []; params?: {} }
    'client.account_management.password.update': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'admin.admins.delete': { paramsTuple: [ParamValue]; params: {'adminId': ParamValue} }
    'admin.users.delete': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'client.account_management.profile.delete': { paramsTuple?: []; params?: {} }
    'admin.account_management.authentication.logout': { paramsTuple?: []; params?: {} }
    'client.account_management.authentication.logout': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}