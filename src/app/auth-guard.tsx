'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { loadUserData, startAutoSync, stopAutoSync } from '@/lib/sync'

const PUBLIC_PATHS = ['/login']

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isPublic = PUBLIC_PATHS.includes(pathname)

  useEffect(() => {
    if (loading) return

    if (!user && !isPublic) {
      router.push('/login')
    } else if (user && isPublic) {
      router.push('/')
    }
  }, [user, loading, isPublic, router])

  // 登录后从 Gist 加载数据并启动自动同步
  useEffect(() => {
    if (user) {
      loadUserData(user.access_token).then(() => {
        window.dispatchEvent(new Event('storage'))
      })
      startAutoSync(user.access_token)
      return () => stopAutoSync()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F7F4' }}>
        <div className="text-center">
          <div className="text-[48px] mb-3 animate-float">🪁</div>
          <p className="text-[13px] text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (!user && !isPublic) {
    return null
  }

  if (user && isPublic) {
    return null
  }

  return <>{children}</>
}
