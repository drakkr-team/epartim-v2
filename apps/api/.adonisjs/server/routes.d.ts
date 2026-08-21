import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'admin.admin_management.profile.view': { paramsTuple?: []; params?: {} }
    'admin.users.list': { paramsTuple?: []; params?: {} }
    'admin.users.create': { paramsTuple?: []; params?: {} }
    'admin.users.view': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'admin.users.delete': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'client.user_management.profile.view': { paramsTuple?: []; params?: {} }
    'client.user_management.profile.update': { paramsTuple?: []; params?: {} }
    'client.user_management.profile.delete': { paramsTuple?: []; params?: {} }
    'admin.admin_management.authentication.login': { paramsTuple?: []; params?: {} }
    'admin.admin_management.authentication.logout': { paramsTuple?: []; params?: {} }
    'admin.admin_management.password.forgot': { paramsTuple?: []; params?: {} }
    'admin.admin_management.password.reset': { paramsTuple?: []; params?: {} }
    'client.user_management.authentication.login': { paramsTuple?: []; params?: {} }
    'client.user_management.authentication.logout': { paramsTuple?: []; params?: {} }
    'client.user_management.password.forgot': { paramsTuple?: []; params?: {} }
    'client.user_management.password.reset': { paramsTuple?: []; params?: {} }
    'client.user_management.password.update': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'admin.admin_management.profile.view': { paramsTuple?: []; params?: {} }
    'admin.users.list': { paramsTuple?: []; params?: {} }
    'admin.users.view': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'client.user_management.profile.view': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'admin.admin_management.profile.view': { paramsTuple?: []; params?: {} }
    'admin.users.list': { paramsTuple?: []; params?: {} }
    'admin.users.view': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'client.user_management.profile.view': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'admin.users.create': { paramsTuple?: []; params?: {} }
    'admin.admin_management.authentication.login': { paramsTuple?: []; params?: {} }
    'admin.admin_management.password.forgot': { paramsTuple?: []; params?: {} }
    'admin.admin_management.password.reset': { paramsTuple?: []; params?: {} }
    'client.user_management.authentication.login': { paramsTuple?: []; params?: {} }
    'client.user_management.password.forgot': { paramsTuple?: []; params?: {} }
    'client.user_management.password.reset': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
  }
  DELETE: {
    'admin.users.delete': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'client.user_management.profile.delete': { paramsTuple?: []; params?: {} }
    'admin.admin_management.authentication.logout': { paramsTuple?: []; params?: {} }
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