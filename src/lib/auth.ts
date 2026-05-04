export type AuthUser = {
  id?: number
  name: string
  email?: string
  role: string
}

export const AUTH_CHANGE_EVENT = 'authChange'

const USER_STORAGE_KEY = 'user'
const TOKEN_STORAGE_KEYS = ['authToken', 'token'] as const

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const storedUser = localStorage.getItem(USER_STORAGE_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as AuthUser
  } catch (error) {
    console.error('Failed to parse stored user:', error)
    localStorage.removeItem(USER_STORAGE_KEY)
    return null
  }
}

export const getStoredToken = (): string => {
  if (typeof window === 'undefined') {
    return ''
  }

  const token = TOKEN_STORAGE_KEYS
    .map((key) => localStorage.getItem(key))
    .find((value) => value && value !== 'undefined')

  return token ?? ''
}

export const dispatchAuthChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
  }
}

export const persistAuth = (user: AuthUser, token?: string) => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))

  if (token) {
    localStorage.setItem('authToken', token)
  }

  dispatchAuthChange()
}

export const clearStoredAuth = () => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(USER_STORAGE_KEY)

  TOKEN_STORAGE_KEYS.forEach((key) => {
    localStorage.removeItem(key)
  })

  dispatchAuthChange()
}

export const getDashboardRouteByRole = (role?: string) => {
  const normalised = role?.toUpperCase()
  if (normalised === 'ADMIN') return '/admin'
  if (normalised === 'TUTOR') return '/tutor/dashboard'
  return '/student/dashboard'
}
