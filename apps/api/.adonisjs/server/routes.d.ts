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
    'client.user_management.profile.view': { paramsTuple?: []; params?: {} }
    'client.user_management.profile.update': { paramsTuple?: []; params?: {} }
    'client.user_management.profile.delete': { paramsTuple?: []; params?: {} }
    'admin.account_management.authentication.login': { paramsTuple?: []; params?: {} }
    'admin.account_management.authentication.logout': { paramsTuple?: []; params?: {} }
    'admin.account_management.password.forgot': { paramsTuple?: []; params?: {} }
    'admin.account_management.password.reset': { paramsTuple?: []; params?: {} }
    'client.user_management.authentication.login': { paramsTuple?: []; params?: {} }
    'client.user_management.authentication.logout': { paramsTuple?: []; params?: {} }
    'client.user_management.password.forgot': { paramsTuple?: []; params?: {} }
    'client.user_management.password.reset': { paramsTuple?: []; params?: {} }
    'client.user_management.password.update': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'admin.account_management.profile.view': { paramsTuple?: []; params?: {} }
    'admin.admins.list': { paramsTuple?: []; params?: {} }
    'admin.admins.view': { paramsTuple: [ParamValue]; params: {'adminId': ParamValue} }
    'client.user_management.profile.view': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'admin.account_management.profile.view': { paramsTuple?: []; params?: {} }
    'admin.admins.list': { paramsTuple?: []; params?: {} }
    'admin.admins.view': { paramsTuple: [ParamValue]; params: {'adminId': ParamValue} }
    'client.user_management.profile.view': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'admin.admins.create': { paramsTuple?: []; params?: {} }
    'admin.account_management.authentication.login': { paramsTuple?: []; params?: {} }
    'admin.account_management.password.forgot': { paramsTuple?: []; params?: {} }
    'admin.account_management.password.reset': { paramsTuple?: []; params?: {} }
    'client.user_management.authentication.login': { paramsTuple?: []; params?: {} }
    'client.user_management.password.forgot': { paramsTuple?: []; params?: {} }
    'client.user_management.password.reset': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'admin.admins.update': { paramsTuple: [ParamValue]; params: {'adminId': ParamValue} }
  }
  DELETE: {
    'admin.admins.delete': { paramsTuple: [ParamValue]; params: {'adminId': ParamValue} }
    'client.user_management.profile.delete': { paramsTuple?: []; params?: {} }
    'admin.account_management.authentication.logout': { paramsTuple?: []; params?: {} }
    'client.user_management.authentication.logout': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'client.user_management.profile.update': { paramsTuple?: []; params?: {} }
    'client.user_management.password.update': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}