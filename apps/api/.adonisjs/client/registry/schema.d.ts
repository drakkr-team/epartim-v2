/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'drive.fs.serve': {
    methods: ["GET","HEAD"]
    pattern: '/uploads/*'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { '*': ParamValue[] }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'admin.admin_management.authentication.login': {
    methods: ["POST"]
    pattern: '/admin/admin-management/authentication/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/admin/admin_management/authentication/controllers/login.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/admin/admin_management/authentication/controllers/login.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/admin_management/authentication/controllers/login.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/admin_management/authentication/controllers/login.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.admin_management.authentication.logout': {
    methods: ["DELETE"]
    pattern: '/admin/admin-management/authentication/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/admin_management/authentication/controllers/logout.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/admin_management/authentication/controllers/logout.controller').default['handle']>>>
    }
  }
  'admin.admin_management.profile.view': {
    methods: ["GET","HEAD"]
    pattern: '/admin/admin-management/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/admin_management/profile/controllers/view.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/admin_management/profile/controllers/view.controller').default['handle']>>>
    }
  }
  'admin.admin_management.profile.update': {
    methods: ["PUT"]
    pattern: '/admin/admin-management/profile'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/admin/admin_management/profile/controllers/update.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/admin/admin_management/profile/controllers/update.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/admin_management/profile/controllers/update.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/admin_management/profile/controllers/update.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.admin_management.profile.delete': {
    methods: ["DELETE"]
    pattern: '/admin/admin-management/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/admin_management/profile/controllers/delete.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/admin_management/profile/controllers/delete.controller').default['handle']>>>
    }
  }
  'admin.admin_management.password.forgot': {
    methods: ["POST"]
    pattern: '/admin/admin-management/password/forgot'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/admin/admin_management/password/controllers/forgot.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/admin/admin_management/password/controllers/forgot.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/admin_management/password/controllers/forgot.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/admin_management/password/controllers/forgot.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.admin_management.password.reset': {
    methods: ["POST"]
    pattern: '/admin/admin-management/password/reset'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/admin/admin_management/password/controllers/reset.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/admin/admin_management/password/controllers/reset.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/admin_management/password/controllers/reset.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/admin_management/password/controllers/reset.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.accept_invitation': {
    methods: ["POST"]
    pattern: '/admin/invitations/accept'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/admin/users/controllers/accept_invitation.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/admin/users/controllers/accept_invitation.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/accept_invitation.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/accept_invitation.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.user_options': {
    methods: ["GET","HEAD"]
    pattern: '/admin/users/options'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/user_options.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/user_options.controller').default['handle']>>>
    }
  }
  'admin.list_users': {
    methods: ["GET","HEAD"]
    pattern: '/admin/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/list_users.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/list_users.controller').default['handle']>>>
    }
  }
  'admin.create_user': {
    methods: ["POST"]
    pattern: '/admin/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/admin/users/controllers/create_user.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/admin/users/controllers/create_user.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/create_user.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/create_user.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.view_user': {
    methods: ["GET","HEAD"]
    pattern: '/admin/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/view_user.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/view_user.controller').default['handle']>>>
    }
  }
  'admin.update_user': {
    methods: ["PUT"]
    pattern: '/admin/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/admin/users/controllers/update_user.controller').default)['payloadSchema']>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#src/features/admin/users/controllers/update_user.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/update_user.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/update_user.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.resend_invitation': {
    methods: ["POST"]
    pattern: '/admin/users/:id/invitations/resend'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/resend_invitation.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/resend_invitation.controller').default['handle']>>>
    }
  }
  'admin.cancel_invitation': {
    methods: ["POST"]
    pattern: '/admin/users/:id/invitations/cancel'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/cancel_invitation.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/cancel_invitation.controller').default['handle']>>>
    }
  }
  'admin.disable_user': {
    methods: ["POST"]
    pattern: '/admin/users/:id/disable'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/disable_user.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/disable_user.controller').default['handle']>>>
    }
  }
  'admin.reactivate_user': {
    methods: ["POST"]
    pattern: '/admin/users/:id/reactivate'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/reactivate_user.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/reactivate_user.controller').default['handle']>>>
    }
  }
  'client.user_management.authentication.login': {
    methods: ["POST"]
    pattern: '/client/user-management/authentication/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/client/user_management/authentication/controllers/login.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/client/user_management/authentication/controllers/login.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/user_management/authentication/controllers/login.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/user_management/authentication/controllers/login.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'client.user_management.authentication.logout': {
    methods: ["DELETE"]
    pattern: '/client/user-management/authentication/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/user_management/authentication/controllers/logout.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/user_management/authentication/controllers/logout.controller').default['handle']>>>
    }
  }
  'client.user_management.password.forgot': {
    methods: ["POST"]
    pattern: '/client/user-management/password/forgot'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/client/user_management/password/controllers/forgot.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/client/user_management/password/controllers/forgot.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/user_management/password/controllers/forgot.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/user_management/password/controllers/forgot.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'client.user_management.password.reset': {
    methods: ["POST"]
    pattern: '/client/user-management/password/reset'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/client/user_management/password/controllers/reset.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/client/user_management/password/controllers/reset.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/user_management/password/controllers/reset.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/user_management/password/controllers/reset.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'client.user_management.password.update': {
    methods: ["PUT"]
    pattern: '/client/user-management/password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/client/user_management/password/controllers/update.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/client/user_management/password/controllers/update.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/user_management/password/controllers/update.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/user_management/password/controllers/update.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'client.user_management.profile.view': {
    methods: ["GET","HEAD"]
    pattern: '/client/user-management/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/user_management/profile/controllers/view.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/user_management/profile/controllers/view.controller').default['handle']>>>
    }
  }
  'client.user_management.profile.update': {
    methods: ["PUT"]
    pattern: '/client/user-management/profile'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/client/user_management/profile/controllers/update.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/client/user_management/profile/controllers/update.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/user_management/profile/controllers/update.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/user_management/profile/controllers/update.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'client.user_management.profile.delete': {
    methods: ["DELETE"]
    pattern: '/client/user-management/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/user_management/profile/controllers/delete.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/user_management/profile/controllers/delete.controller').default['handle']>>>
    }
  }
}
