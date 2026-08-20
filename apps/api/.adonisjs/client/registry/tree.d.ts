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
      authentication: {
        login: typeof routes['admin.admin_management.authentication.login']
        logout: typeof routes['admin.admin_management.authentication.logout']
      }
      profile: {
        view: typeof routes['admin.admin_management.profile.view']
        update: typeof routes['admin.admin_management.profile.update']
        delete: typeof routes['admin.admin_management.profile.delete']
      }
      password: {
        forgot: typeof routes['admin.admin_management.password.forgot']
        reset: typeof routes['admin.admin_management.password.reset']
        update: typeof routes['admin.admin_management.password.update']
      }
    }
    acceptInvitation: typeof routes['admin.accept_invitation']
    userOptions: typeof routes['admin.user_options']
    listUsers: typeof routes['admin.list_users']
    createUser: typeof routes['admin.create_user']
    viewUser: typeof routes['admin.view_user']
    updateUser: typeof routes['admin.update_user']
    resendInvitation: typeof routes['admin.resend_invitation']
    cancelInvitation: typeof routes['admin.cancel_invitation']
    disableUser: typeof routes['admin.disable_user']
    reactivateUser: typeof routes['admin.reactivate_user']
  }
  client: {
    userManagement: {
      authentication: {
        login: typeof routes['client.user_management.authentication.login']
        logout: typeof routes['client.user_management.authentication.logout']
      }
      password: {
        forgot: typeof routes['client.user_management.password.forgot']
        reset: typeof routes['client.user_management.password.reset']
        update: typeof routes['client.user_management.password.update']
      }
      profile: {
        view: typeof routes['client.user_management.profile.view']
        update: typeof routes['client.user_management.profile.update']
        delete: typeof routes['client.user_management.profile.delete']
      }
    }
  }
}
