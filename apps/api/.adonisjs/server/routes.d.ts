import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'user_management.authentication.login': { paramsTuple?: []; params?: {} }
    'user_management.authentication.logout': { paramsTuple?: []; params?: {} }
    'admin.accept_invitation': { paramsTuple?: []; params?: {} }
    'admin.user_options': { paramsTuple?: []; params?: {} }
    'admin.list_users': { paramsTuple?: []; params?: {} }
    'admin.create_user': { paramsTuple?: []; params?: {} }
    'admin.view_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.update_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.resend_invitation': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.cancel_invitation': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.disable_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.reactivate_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_management.profile.view': { paramsTuple?: []; params?: {} }
    'user_management.profile.update': { paramsTuple?: []; params?: {} }
    'user_management.profile.delete': { paramsTuple?: []; params?: {} }
    'user_management.password.forgot': { paramsTuple?: []; params?: {} }
    'user_management.password.reset': { paramsTuple?: []; params?: {} }
    'user_management.password.update': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'admin.user_options': { paramsTuple?: []; params?: {} }
    'admin.list_users': { paramsTuple?: []; params?: {} }
    'admin.view_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_management.profile.view': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'admin.user_options': { paramsTuple?: []; params?: {} }
    'admin.list_users': { paramsTuple?: []; params?: {} }
    'admin.view_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_management.profile.view': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'user_management.authentication.login': { paramsTuple?: []; params?: {} }
    'admin.accept_invitation': { paramsTuple?: []; params?: {} }
    'admin.create_user': { paramsTuple?: []; params?: {} }
    'admin.resend_invitation': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.cancel_invitation': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.disable_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.reactivate_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_management.password.forgot': { paramsTuple?: []; params?: {} }
    'user_management.password.reset': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'user_management.authentication.logout': { paramsTuple?: []; params?: {} }
    'user_management.profile.delete': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'admin.update_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'user_management.profile.update': { paramsTuple?: []; params?: {} }
    'user_management.password.update': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}