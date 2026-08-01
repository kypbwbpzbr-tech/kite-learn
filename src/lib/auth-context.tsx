'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { GitHubUser, redirectToGitHub, extractUserFromHash, saveSession, getCurrentUser, clearSession } from './auth'

interface AuthContextType {
  user: GitHubUser | null
  loading: boolean
  loginWithGitHub: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithGitHub: () => {},
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查 URL hash 中是否有 OAuth 回调数据
    const hashUser = extractUserFromHash()
    if (hashUser) {
      saveSession(hashUser)
      setUser(hashUser)
      setLoading(false)
      return
    }

    // 检查本地 session
    const session = getCurrentUser()
    setUser(session)
    setLoading(false)
  }, [])

  const loginWithGitHub = () => {
    redirectToGitHub()
  }

  const logout = () => {
    clearSession()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGitHub, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
