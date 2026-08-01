'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { GitHubUser, redirectToGitHub, extractUserFromHash, saveSession, getCurrentUser, clearSession } from './auth'
import { supabase } from './supabase'

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

    // 检查 Supabase 登录状态
    const checkSupabaseUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // 将 Supabase 用户转换为 GitHubUser 格式
        const supabaseUser: GitHubUser = {
          id: parseInt(session.user.id.replace(/-/g, '').substring(0, 8), 16),
          login: session.user.email?.split('@')[0] || 'user',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '同学',
          email: session.user.email || '',
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.user_metadata?.name || 'User')}&background=F97316&color=fff`,
          access_token: session.access_token
        }
        saveSession(supabaseUser)
        setUser(supabaseUser)
        setLoading(false)
        return
      }

      // 检查本地 session（GitHub 登录）
      const localSession = getCurrentUser()
      setUser(localSession)
      setLoading(false)
    }

    checkSupabaseUser()

    // 监听 Supabase 登录状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const supabaseUser: GitHubUser = {
          id: parseInt(session.user.id.replace(/-/g, '').substring(0, 8), 16),
          login: session.user.email?.split('@')[0] || 'user',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '同学',
          email: session.user.email || '',
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.user_metadata?.name || 'User')}&background=F97316&color=fff`,
          access_token: session.access_token
        }
        saveSession(supabaseUser)
        setUser(supabaseUser)
      } else {
        clearSession()
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loginWithGitHub = () => {
    redirectToGitHub()
  }

  const logout = async () => {
    await supabase.auth.signOut()
    clearSession()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGitHub, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
