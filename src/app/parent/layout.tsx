'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: '/parent', label: '首页', icon: '📊' },
    { href: '/parent/report', label: '报告', icon: '📈' },
    { href: '/parent/mistakes', label: '错题', icon: '❌' },
    { href: '/parent/goals', label: '目标', icon: '🎯' },
  ]

  const isActive = (href: string) => {
    if (href === '/parent') return pathname === '/parent'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪁</span>
            <span className="font-semibold gradient-text">风筝学堂 - 学习报告</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
            >
              学生端 →
            </Link>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="pt-16 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4">
          {children}
        </div>
      </main>

      {/* 底部导航栏 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav border-t border-white/20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isActive(item.href)
                  ? 'text-orange-500 scale-110'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
