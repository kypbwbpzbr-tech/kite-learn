'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getRole, setRole, isParent, isParentBound } from '@/lib/role-service'
import { signIn, signUp } from '@/lib/auth-supabase'

export default function LoginPage() {
  const { loginWithGitHub, loading, user } = useAuth()
  const router = useRouter()
  const [showRoleSelect, setShowRoleSelect] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      const role = getRole()
      if (role) {
        if (role.role === 'parent') {
          router.push('/parent')
        } else {
          router.push('/')
        }
      } else {
        setShowRoleSelect(true)
      }
    }
  }, [user, router])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setError('')

    try {
      let result
      if (isSignUp) {
        result = await signUp(email, password, name)
      } else {
        result = await signIn(email, password)
      }

      if (result.error) {
        setError(result.error.message)
      } else if (result.user) {
        // 登录成功，刷新页面
        window.location.reload()
      }
    } catch (err) {
      setError('操作失败，请重试')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSelectStudent = () => {
    setRole({ role: 'student' })
    router.push('/')
  }

  const handleSelectParent = () => {
    setRole({ role: 'parent' })
    if (isParentBound()) {
      router.push('/parent')
    } else {
      router.push('/parent/bind')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#F8F7F4' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8 animate-in">
          <div className="text-[56px] mb-3 animate-float">🪁</div>
          <h1 className="text-[28px] font-black text-gray-900 tracking-tight">风筝学堂</h1>
          <p className="text-[13px] text-gray-400 mt-1">让学习更有趣</p>
        </div>

        {!showRoleSelect ? (
          /* 登录卡片 */
          <div className="card animate-in" style={{ animationDelay: '100ms' }}>
            <h2 className="text-[18px] font-bold text-gray-900 mb-2">欢迎回来</h2>
            <p className="text-[13px] text-gray-400 mb-6">
              {isSignUp ? '创建新账号' : '使用邮箱或 GitHub 登录'}
            </p>

            {/* 邮箱密码表单 */}
            <form onSubmit={handleEmailAuth} className="space-y-4 mb-4">
              {isSignUp && (
                <input
                  type="text"
                  placeholder="你的名字"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input w-full"
                />
              )}
              <input
                type="email"
                placeholder="邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input w-full"
              />
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="input w-full"
              />

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-400 text-white font-semibold hover:from-orange-500 hover:to-amber-500 transition-all disabled:opacity-50"
              >
                {authLoading ? '处理中...' : isSignUp ? '注册' : '登录'}
              </button>
            </form>

            <div className="text-center text-sm text-gray-500 mb-4">
              {isSignUp ? '已有账号？' : '没有账号？'}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError('') }}
                className="text-orange-500 hover:text-orange-600 ml-1"
              >
                {isSignUp ? '去登录' : '注册新账号'}
              </button>
            </div>

            {/* 分隔线 */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">或者</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* GitHub 登录 */}
            <button
              onClick={loginWithGitHub}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-gray-900 text-white font-semibold text-[15px] hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {loading ? '加载中...' : 'GitHub 登录'}
            </button>
          </div>
        ) : (
          /* 角色选择卡片 */
          <div className="card animate-in" style={{ animationDelay: '100ms' }}>
            <h2 className="text-[18px] font-bold text-gray-900 mb-2">选择身份</h2>
            <p className="text-[13px] text-gray-400 mb-6">你是学生还是家长？</p>

            <div className="space-y-3">
              <button
                onClick={handleSelectStudent}
                className="w-full p-4 rounded-2xl border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📚</span>
                  <div>
                    <div className="font-semibold text-gray-900">我是学生</div>
                    <div className="text-xs text-gray-500">使用学习功能，记录学习进度</div>
                  </div>
                </div>
              </button>

              <button
                onClick={handleSelectParent}
                className="w-full p-4 rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">👨‍👩‍👧</span>
                  <div>
                    <div className="font-semibold text-gray-900">我是家长</div>
                    <div className="text-xs text-gray-500">查看孩子学习情况，设置学习目标</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-[11px] text-gray-300 mt-6 animate-in" style={{ animationDelay: '200ms' }}>
          数据自动同步到云端 ☁️
        </p>
      </div>
    </div>
  )
}
