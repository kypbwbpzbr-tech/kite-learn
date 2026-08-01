'use client'

import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const { loginWithGitHub, loading } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#F8F7F4' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8 animate-in">
          <div className="text-[56px] mb-3 animate-float">🪁</div>
          <h1 className="text-[28px] font-black text-gray-900 tracking-tight">风筝学堂</h1>
          <p className="text-[13px] text-gray-400 mt-1">让学习更有趣</p>
        </div>

        {/* 登录卡片 */}
        <div className="card animate-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-[18px] font-bold text-gray-900 mb-2">欢迎回来</h2>
          <p className="text-[13px] text-gray-400 mb-6">使用 GitHub 账号登录，数据自动同步到云端</p>

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

        {/* 底部提示 */}
        <p className="text-center text-[11px] text-gray-300 mt-6 animate-in" style={{ animationDelay: '200ms' }}>
          登录后数据将自动同步到 GitHub Gist ☁️
        </p>
      </div>
    </div>
  )
}
