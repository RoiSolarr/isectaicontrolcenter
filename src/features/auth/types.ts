export type LoginFieldErrors = {
  email?: string
  password?: string
}

/** State returned by signInAction and consumed by LoginForm (via useActionState). */
export type LoginState = {
  status: 'idle' | 'error'
  /** Echoed back so the email field keeps its value after a failed attempt. */
  email: string
  message?: string
  fieldErrors?: LoginFieldErrors
}

export const initialLoginState: LoginState = { status: 'idle', email: '' }
