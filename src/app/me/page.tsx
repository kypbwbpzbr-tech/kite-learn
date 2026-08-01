'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { saveUserData } from '@/lib/sync'

const levels = [
  { level: 1, name: '小风筝', points: 0, emoji: '🪁' },
  { level: 2, name: '飞鸟', points: 100, emoji: '🐦' },
  { level: 3, name: '蝴蝶', points: 300, emoji: '🦋' },
  { level: 4, name: '雄鹰', points: 600, emoji: '🦅' },
  { level: 5, name: '凤凰', points: 1000, emoji: '🔥' },
]

export default function MePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('同学')
  const [points, setPoints] = useState(0)
  const [stats, setStats] = useState({ m: 0, e: 0, f: 0, d: 0 })
  const [editing, setEditing] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setTimeout(() => setVisible(true), 50))
    setName(localStorage.getItem('user-name') || user?.name || '同学')
    setPoints(parseInt(localStorage.getItem('kite-points') || '0'))
    setStats({
      m: JSON.parse(localStorage.getItem('memorized-items') || '[]').length,
      e: JSON.parse(localStorage.getItem('mistakes') || '[]').length,
      f: JSON.parse(localStorage.getItem('favorites') || '[]').length,
      d: JSON.parse(localStorage.getItem('study-records') || '[]').length,
    })
  }, [user])

  const getLevel = () => { for (let i = levels.length - 1; i >= 0; i--) { if (points >= levels[i].points) return levels[i] } return levels[0] }
  const getNext = () => { const l = getLevel(); const i = levels.findIndex(x => x.level === l.level); return i < levels.length - 1 ? levels[i + 1] : null }

  const lv = getLevel(); const nx = getNext()
  const prog = nx ? ((points - lv.points) / (nx.points - lv.points)) * 100 : 100

  const handleSignOut = async () => {
    if (user) {
      await saveUserData(user.access_token)
    }
    logout()
    router.push('/login')
  }

  const menus = [
    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label: '学习日历', href: '/calendar', color: 'bg-blue-50 text-blue-500' },
    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>, label: '学习计划', href: '/plan', color: 'bg-green-50 text-green-500' },
    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, label: '我的收藏', href: '/favorites', color: 'bg-yellow-50 text-yellow-500' },
    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>, label: '积分明细', href: '/points', color: 'bg-orange-50 text-orange-500' },
  ]

  const stagger = (i: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.98)',
    transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 80}ms`
  })

  return (
    <div className="container py-5">
      {/* 用户卡片 */}
      <div style={stagger(0)} className="card mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="avatar" className="w-[68px] h-[68px] rounded-[22px] object-cover shadow-[0_4px_20px_rgba(249,115,22,0.25)]" />
            ) : (
              <div className="w-[68px] h-[68px] rounded-[22px] bg-gradient-to-br from-[#FFB878] via-[#FF9A5C] to-[#F97316] flex items-center justify-center text-[36px] shadow-[0_4px_20px_rgba(249,115,22,0.25)]">
                {lv.emoji}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-[12px] border border-orange-100">✨</div>
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="flex gap-2 animate-scale">
                <input value={name} onChange={e => setName(e.target.value)} className="input flex-1" autoFocus
                  onKeyDown={e => e.key === 'Enter' && (localStorage.setItem('user-name', name), setEditing(false))} />
                <button onClick={() => { localStorage.setItem('user-name', name); setEditing(false) }} className="btn-primary text-[12px] px-3">保存</button>
              </div>
            ) : (
              <div onClick={() => setEditing(true)} className="cursor-pointer active:scale-[0.98] transition-transform duration-200">
                <div className="text-[18px] font-bold text-gray-900">{name}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">@{user?.login || '点击编辑'}</div>
              </div>
            )}
            <div className="flex items-center gap-2 mt-2.5">
              <span className="tag bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 border border-orange-100/50">{lv.emoji} {lv.name}</span>
              <span className="tag bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 border border-orange-100/50">{points} 🪁</span>
            </div>
          </div>
        </div>

        {nx && (
          <div className="mt-5 pt-4 border-t border-black/[0.04]">
            <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
              <span>{lv.name}</span><span>{nx.name}</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${prog}%` }} /></div>
            <div className="text-[11px] text-gray-400 text-right mt-1.5">还需 {nx.points - points} 🪁</div>
          </div>
        )}
      </div>

      {/* 数据统计 */}
      <div style={stagger(1)} className="grid grid-cols-4 gap-3 mb-4">
        {[
          { v: stats.d, l: '学习天数', c: 'text-blue-500' },
          { v: stats.m, l: '已背诵', c: 'text-emerald-500' },
          { v: stats.e, l: '错题', c: 'text-rose-500' },
          { v: stats.f, l: '收藏', c: 'text-amber-500' },
        ].map((s, i) => (
          <div key={i} className="card text-center py-3.5 active:scale-95 transition-all duration-300">
            <div className={`text-[24px] font-bold tabular-nums ${s.c}`}>{s.v}</div>
            <div className="text-[10px] text-gray-400 mt-1 font-medium">{s.l}</div>
          </div>
        ))}
      </div>

      {/* 菜单 */}
      <div style={stagger(2)} className="card">
        {menus.map((item, i) => (
          <a key={i} href={item.href}
            className={`flex items-center gap-3.5 py-4 active:scale-[0.98] transition-all duration-200 ${i < menus.length - 1 ? 'border-b border-black/[0.04]' : ''}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110 ${item.color}`}>{item.icon}</div>
            <span className="flex-1 text-[14px] font-medium text-gray-700">{item.label}</span>
            <svg className="w-4 h-4 text-gray-300 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>
        ))}
      </div>

      {/* 退出登录 */}
      <div style={stagger(3)} className="mt-4">
        <button
          onClick={handleSignOut}
          className="w-full card text-center py-3.5 text-[14px] font-medium text-red-400 hover:text-red-500 hover:bg-red-50/50 active:scale-[0.98] transition-all duration-300"
        >
          退出登录
        </button>
      </div>
    </div>
  )
}
