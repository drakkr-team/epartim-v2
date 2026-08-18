/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
  userManagement: {
    authentication: {
      login: typeof routes['user_management.authentication.login']
      logout: typeof routes['user_management.authentication.logout']
    }
    profile: {
      view: typeof routes['user_management.profile.view']
      update: typeof routes['user_management.profile.update']
      delete: typeof routes['user_management.profile.delete']
    }
    password: {
      forgot: typeof routes['user_management.password.forgot']
      reset: typeof routes['user_management.password.reset']
      update: typeof routes['user_management.password.update']
    }
  }
  admin: {
    authentication: {
      login: typeof routes['admin.authentication.login']
      logout: typeof routes['admin.authentication.logout']
      viewCurrentUser: typeof routes['admin.authentication.view_current_user']
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
}
