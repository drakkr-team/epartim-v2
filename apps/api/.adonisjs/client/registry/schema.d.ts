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
  'admin.account_management.profile.view': {
    methods: ["GET","HEAD"]
    pattern: '/admin/account-management/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/account_management/profile/controllers/view.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/account_management/profile/controllers/view.controller').default['handle']>>>
    }
  }
  'admin.admins.list': {
    methods: ["GET","HEAD"]
    pattern: '/admin/admins'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#src/features/admin/admins/controllers/list.controller').default)['querySchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/admins/controllers/list.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/admins/controllers/list.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.admins.create': {
    methods: ["POST"]
    pattern: '/admin/admins'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/admin/admins/controllers/create.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/admin/admins/controllers/create.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/admins/controllers/create.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/admins/controllers/create.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.admins.view': {
    methods: ["GET","HEAD"]
    pattern: '/admin/admins/:adminId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { adminId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/admins/controllers/view.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/admins/controllers/view.controller').default['handle']>>>
    }
  }
  'admin.admins.update': {
    methods: ["PUT"]
    pattern: '/admin/admins/:adminId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/admin/admins/controllers/update.controller').default)['payloadSchema']>>
      paramsTuple: [ParamValue]
      params: { adminId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#src/features/admin/admins/controllers/update.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/admins/controllers/update.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/admins/controllers/update.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.admins.delete': {
    methods: ["DELETE"]
    pattern: '/admin/admins/:adminId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { adminId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/admins/controllers/delete.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/admins/controllers/delete.controller').default['handle']>>>
    }
  }
  'admin.networks.list': {
    methods: ["GET","HEAD"]
    pattern: '/admin/networks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#src/features/admin/networks/controllers/list.controller').default)['querySchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/networks/controllers/list.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/networks/controllers/list.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.networks.create': {
    methods: ["POST"]
    pattern: '/admin/networks'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/admin/networks/controllers/create.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/admin/networks/controllers/create.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/networks/controllers/create.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/networks/controllers/create.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.users.list': {
    methods: ["GET","HEAD"]
    pattern: '/admin/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#src/features/admin/users/controllers/list.controller').default)['querySchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/list.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/list.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.users.create': {
    methods: ["POST"]
    pattern: '/admin/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/admin/users/controllers/create.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/admin/users/controllers/create.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/create.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/create.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.users.view': {
    methods: ["GET","HEAD"]
    pattern: '/admin/users/:userId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/view.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/view.controller').default['handle']>>>
    }
  }
  'admin.users.update': {
    methods: ["PATCH"]
    pattern: '/admin/users/:userId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/admin/users/controllers/update.controller').default)['payloadSchema']>>
      paramsTuple: [ParamValue]
      params: { userId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#src/features/admin/users/controllers/update.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/update.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/update.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.users.delete': {
    methods: ["DELETE"]
    pattern: '/admin/users/:userId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/delete.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/users/controllers/delete.controller').default['handle']>>>
    }
  }
  'client.account_management.profile.view': {
    methods: ["GET","HEAD"]
    pattern: '/client/account-management/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/account_management/profile/controllers/view.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/account_management/profile/controllers/view.controller').default['handle']>>>
    }
  }
  'client.account_management.profile.update': {
    methods: ["PUT"]
    pattern: '/client/account-management/profile'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/client/account_management/profile/controllers/update.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/client/account_management/profile/controllers/update.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/account_management/profile/controllers/update.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/account_management/profile/controllers/update.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'client.account_management.profile.delete': {
    methods: ["DELETE"]
    pattern: '/client/account-management/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/account_management/profile/controllers/delete.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/account_management/profile/controllers/delete.controller').default['handle']>>>
    }
  }
  'admin.account_management.authentication.login': {
    methods: ["POST"]
    pattern: '/admin/account-management/authentication/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/admin/account_management/authentication/controllers/login.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/admin/account_management/authentication/controllers/login.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/account_management/authentication/controllers/login.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/account_management/authentication/controllers/login.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.account_management.authentication.logout': {
    methods: ["DELETE"]
    pattern: '/admin/account-management/authentication/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/account_management/authentication/controllers/logout.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/account_management/authentication/controllers/logout.controller').default['handle']>>>
    }
  }
  'admin.account_management.password.forgot': {
    methods: ["POST"]
    pattern: '/admin/account-management/password/forgot'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/admin/account_management/password/controllers/forgot.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/admin/account_management/password/controllers/forgot.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/account_management/password/controllers/forgot.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/account_management/password/controllers/forgot.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.account_management.password.reset': {
    methods: ["POST"]
    pattern: '/admin/account-management/password/reset'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/admin/account_management/password/controllers/reset.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/admin/account_management/password/controllers/reset.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/admin/account_management/password/controllers/reset.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/admin/account_management/password/controllers/reset.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'client.account_management.authentication.login': {
    methods: ["POST"]
    pattern: '/client/account-management/authentication/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/client/account_management/authentication/controllers/login.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/client/account_management/authentication/controllers/login.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/account_management/authentication/controllers/login.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/account_management/authentication/controllers/login.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'client.account_management.authentication.logout': {
    methods: ["DELETE"]
    pattern: '/client/account-management/authentication/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/account_management/authentication/controllers/logout.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/account_management/authentication/controllers/logout.controller').default['handle']>>>
    }
  }
  'client.account_management.password.forgot': {
    methods: ["POST"]
    pattern: '/client/account-management/password/forgot'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/client/account_management/password/controllers/forgot.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/client/account_management/password/controllers/forgot.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/account_management/password/controllers/forgot.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/account_management/password/controllers/forgot.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'client.account_management.password.reset': {
    methods: ["POST"]
    pattern: '/client/account-management/password/reset'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/client/account_management/password/controllers/reset.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/client/account_management/password/controllers/reset.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/account_management/password/controllers/reset.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/account_management/password/controllers/reset.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'client.account_management.password.update': {
    methods: ["PUT"]
    pattern: '/client/account-management/password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#src/features/client/account_management/password/controllers/update.controller').default)['payloadSchema']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#src/features/client/account_management/password/controllers/update.controller').default)['payloadSchema']>>
      response: ExtractResponse<Awaited<ReturnType<import('#src/features/client/account_management/password/controllers/update.controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#src/features/client/account_management/password/controllers/update.controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
