/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
  admin: {
    adminManagement: {
      admins: {
        list: typeof routes['admin.admin_management.admins.list']
        create: typeof routes['admin.admin_management.admins.create']
      }
      profile: {
        view: typeof routes['admin.admin_management.profile.view']
      }
      authentication: {
        login: typeof routes['admin.admin_management.authentication.login']
        logout: typeof routes['admin.admin_management.authentication.logout']
      }
      password: {
        forgot: typeof routes['admin.admin_management.password.forgot']
        reset: typeof routes['admin.admin_management.password.reset']
      }
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
