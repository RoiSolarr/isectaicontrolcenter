/** Banners shown above the login form, selected with /login?reason=<key>. */
export type LoginNotice = {
  variant: 'success' | 'warning' | 'info'
  title: string
  description: string
}

export const LOGIN_NOTICES = {
  signed_out: {
    variant: 'success',
    title: 'You have been signed out.',
    description: 'Sign in again whenever you are ready.',
  },
  unauthorized: {
    variant: 'warning',
    title: 'Administrator access required.',
    description: 'That account cannot open the control center. Sign in with an iSectAI staff account.',
  },
  session_expired: {
    variant: 'info',
    title: 'Your session expired.',
    description: 'Sign in again to continue where you left off.',
  },
} as const satisfies Record<string, LoginNotice>

export type LoginNoticeKey = keyof typeof LOGIN_NOTICES

export function isLoginNoticeKey(value: string): value is LoginNoticeKey {
  return value in LOGIN_NOTICES
}
