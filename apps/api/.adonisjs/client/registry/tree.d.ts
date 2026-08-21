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
    }
    users: {
      list: typeof routes['admin.users.list']
      create: typeof routes['admin.users.create']
      view: typeof routes['admin.users.view']
      update: typeof routes['admin.users.update']
      delete: typeof routes['admin.users.delete']
    }
  }
  client: {
    userManagement: {
      profile: {
        view: typeof routes['client.user_management.profile.view']
        update: typeof routes['client.user_management.profile.update']
        delete: typeof routes['client.user_management.profile.delete']
      }
      authentication: {
        login: typeof routes['client.user_management.authentication.login']
        logout: typeof routes['client.user_management.authentication.logout']
      }
      password: {
        forgot: typeof routes['client.user_management.password.forgot']
        reset: typeof routes['client.user_management.password.reset']
        update: typeof routes['client.user_management.password.update']
      }
    }
  }
}
