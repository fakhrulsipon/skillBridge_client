'use client'

import { useCallback, useSyncExternalStore } from 'react'

import {
  AUTH_CHANGE_EVENT,
  clearStoredAuth,
  getDashboardRouteByRole,
  getStoredToken,
  getStoredUser,
  persistAuth,
  type AuthUser,
} from '@/lib/auth'

type AuthSnapshot = {
  user: AuthUser | null
  token: string
}

const EMPTY_AUTH_SNAPSHOT: AuthSnapshot = {
  user: null,
  token: '',
}

let currentSnapshot: AuthSnapshot = EMPTY_AUTH_SNAPSHOT

const getAuthSnapshot = (): AuthSnapshot => {
  const nextSnapshot = {
    user: getStoredUser(),
    token: getStoredToken(),
  }

  if (
    currentSnapshot.user?.id === nextSnapshot.user?.id &&
    currentSnapshot.user?.name === nextSnapshot.user?.name &&
    currentSnapshot.user?.email === nextSnapshot.user?.email &&
    currentSnapshot.user?.role === nextSnapshot.user?.role &&
    currentSnapshot.token === nextSnapshot.token
  ) {
    return currentSnapshot
  }

  currentSnapshot = nextSnapshot
  return currentSnapshot
}

const getServerSnapshot = (): AuthSnapshot => EMPTY_AUTH_SNAPSHOT

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return () => {}
  }

  window.addEventListener('storage', callback)
  window.addEventListener(AUTH_CHANGE_EVENT, callback)

  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(AUTH_CHANGE_EVENT, callback)
  }
}

export const useAuth = () => {
  const { user, token } = useSyncExternalStore(
    subscribe,
    getAuthSnapshot,
    getServerSnapshot,
  )

  const refreshAuth = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
    }
  }, [])

  const setAuth = useCallback((nextUser: AuthUser, nextToken?: string) => {
    persistAuth(nextUser, nextToken)
  }, [])

  const logout = useCallback(() => {
    clearStoredAuth()
  }, [])

  return {
    user,
    token,
    isLoading: false,
    isAuthenticated: Boolean(user && token),
    refreshAuth,
    setAuth,
    logout,
    getDashboardRoute: () => getDashboardRouteByRole(user?.role),
  }
}
