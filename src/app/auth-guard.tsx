'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { loadUserData, startAutoSync, stopAutoSync } from '@/lib/sync'
import { getRole, isParent, isParentBound } from '@/lib/role-service'

const PUBLIC_PATHS = ['/login']

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isPublic = PUBLIC_PATHS.includes(pathname)
  const isParentPage = pathname.startsWith('/parent')

  useEffect(() => {
    if (loading) return

    // 未登录且不是公开页面 → 跳转登录
    if (!user && !isPublic) {
      router.push('/login')
      return
    }

    // 已登录但在登录页 → 根据角色跳转
    if (user && isPublic) {
      const role = getRole()
      if (role?.role === 'parent') {
        router.push('/parent')
      } else {
        router.push('/')
      }
      return
    }

    // 已登录但没有角色信息 → 显示角色选择（在登录页处理）
    if (user && !isPublic && !getRole()) {
      router.push('/login')
      return
    }

    // 学生访问家长页 → 跳转学生首页
    if (user && isParentPage && !isParent()) {
      router.push('/')
      return
    }

    // 家长访问学生页 → 跳转家长首页
    if (user && !isParentPage && !pathname.startsWith('/login') && isParent()) {
      router.push('/parent')
      return
    }
  }, [user, loading, isPublic, isParentPage, router, pathname])

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
