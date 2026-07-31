'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface Goal { id: string; title: string; target: number; unit: string; current: number; icon: string; }

const defaultGoals: Goal[] = [
  { id: '1', title: '每日练习', target: 20, unit: '题', current: 0, icon: '📝' },
  { id: '2', title: '每日背诵', target: 5, unit: '个', current: 0, icon: '📖' },
  { id: '3', title: '错题复习', target: 10, unit: '道', current: 0, icon: '🔄' },
]

const quotes = [
  "每天进步一点点，期末结束大变样！",
  "今天的努力，是明天的收获。",
  "学习就像爬山，一步一步往上走。",
  "坚持就是胜利，加油！",
  "知识改变命运，学习成就未来。",
]

const grades = [
  { id: 'g3', name: '三年级', emoji: '🌱' }, { id: 'g4', name: '四年级', emoji: '🌿' },
  { id: 'g5', name: '五年级', emoji: '🌳' }, { id: 'g6', name: '六年级', emoji: '⛰️' },
  { id: 'g7', name: '七年级', emoji: '🚀' }, { id: 'g8', name: '八年级', emoji: '✈️' },
  { id: 'g9', name: '九年级', emoji: '🎯' },
]

export default function Home() {
  const [grade, setGrade] = useState('g7')
  const [points, setPoints] = useState(0)
  const [goals, setGoals] = useState<Goal[]>(defaultGoals)
  const [showAdd, setShowAdd] = useState(false)
  const [newGoal, setNewGoal] = useState({ title: '', target: 10, unit: '题', icon: '🎯' })
  const [quote, setQuote] = useState('')
  const [editingQuote, setEditingQuote] = useState(false)
  const [visible, setVisible] = useState(false)
  const [animatingGoal, setAnimatingGoal] = useState<string | null>(null)

  useEffect(() => {
    requestAnimationFrame(() => setTimeout(() => setVisible(true), 50))
    setPoints(parseInt(localStorage.getItem('kite-points') || '0'))
    setQuote(localStorage.getItem('daily-quote') || quotes[Math.floor(Math.random() * quotes.length)])
    const saved = JSON.parse(localStorage.getItem('daily-goals') || 'null')
    if (saved && saved._date === new Date().toDateString()) setGoals(saved.items)
    else localStorage.setItem('daily-goals', JSON.stringify({ items: goals, _date: new Date().toDateString() }))
  }, [])

  const saveGoals = useCallback((g: Goal[]) => {
    setGoals(g)
    localStorage.setItem('daily-goals', JSON.stringify({ items: g, _date: new Date().toDateString() }))
  }, [])

  const updateGoal = useCallback((id: string, delta: number) => {
    setAnimatingGoal(id)
    setTimeout(() => setAnimatingGoal(null), 400)
    const updated = goals.map(g => g.id === id ? { ...g, current: Math.max(0, Math.min(g.current + delta, g.target)) } : g)
    saveGoals(updated)
    if (delta > 0) { const p = points + 2; setPoints(p); localStorage.setItem('kite-points', p.toString()) }
  }, [goals, points, saveGoals])

  const saveQuote = () => { localStorage.setItem('daily-quote', quote); setEditingQuote(false) }

  const addGoal = () => {
    if (!newGoal.title.trim()) return
    saveGoals([...goals, { ...newGoal, id: Date.now().toString(), current: 0 }])
    setNewGoal({ title: '', target: 10, unit: '题', icon: '🎯' }); setShowAdd(false)
  }

  const totalDone = goals.reduce((s, g) => s + g.current, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target, 0)
  const totalProgress = totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100) : 0

  const stagger = (i: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.98)',
    transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 80}ms`
  })

  return (
    <div className="container py-5">
      {/* 顶部 */}
      <div style={stagger(0)} className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">风筝学堂</h1>
          <p className="text-[11px] text-gray-400 mt-0.5 tracking-wide">让学习更有趣</p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 px-3.5 py-2 rounded-full border border-orange-100/50 shadow-sm">
          <span className="text-sm animate-float">🪁</span>
          <span className="text-sm font-bold gradient-text">{points}</span>
        </div>
      </div>

      {/* 主视觉区 */}
      <div style={stagger(1)} className="relative bg-gradient-to-br from-[#F8F6F1] via-[#FDF9F3] to-[#F5F0E8] rounded-[24px] p-6 mb-4 overflow-hidden border border-black/[0.02]">
        {/* 装饰 */}
        <div className="absolute top-4 right-4 text-[60px] opacity-20 select-none animate-float" style={{ animationDelay: '0s' }}>🍉</div>
        <div className="absolute bottom-3 right-20 text-[40px] opacity-15 select-none animate-float" style={{ animationDelay: '1s' }}>🌻</div>
        <div className="absolute top-12 right-28 text-[30px] opacity-10 select-none animate-float" style={{ animationDelay: '2s' }}>✈️</div>

        <div className="relative z-10 mb-4">
          <div className="text-[10px] text-gray-400 font-semibold tracking-[0.2em] uppercase mb-2">TODAY'S MISSION</div>
          <h2 className="text-[26px] font-black text-gray-900 leading-[1.15]">
            把大目标，<br />
            <span className="bg-gradient-to-r from-[#FF8A4C] to-[#F97316] bg-clip-text text-transparent">剪成小成就。</span>
          </h2>
        </div>

        {/* 鼓励语 */}
        <div className="relative z-10 mb-5">
          {editingQuote ? (
            <div className="flex items-center gap-2 animate-scale">
              <input value={quote} onChange={e => setQuote(e.target.value)}
                className="flex-1 bg-white/80 backdrop-blur px-4 py-2.5 rounded-xl text-[14px] text-gray-700 outline-none border border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                autoFocus onKeyDown={e => e.key === 'Enter' && saveQuote()} />
              <button onClick={saveQuote} className="btn-primary text-[12px] py-2.5 px-4">保存</button>
            </div>
          ) : (
            <div onClick={() => setEditingQuote(true)} className="flex items-center gap-2.5 cursor-pointer group py-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <span className="text-[14px] text-gray-600 group-hover:text-orange-500 transition-colors duration-300">{quote}</span>
            </div>
          )}
        </div>

        {/* 总进度 */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/>
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-gray-700">{totalDone}/{totalTarget} 目标完成</span>
            </div>
            <span className="text-[13px] font-bold gradient-text">{totalProgress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${totalProgress}%` }} />
          </div>
        </div>
      </div>

      {/* 今日目标 */}
      <div style={stagger(2)} className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-sm animate-breathe">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <span className="text-[14px] font-semibold text-gray-800">今日目标</span>
          </div>
          <span className="text-[11px] text-gray-400">{goals.length} 个</span>
        </div>

        <div className="space-y-2.5">
          {goals.map((goal) => {
            const p = Math.round((goal.current / goal.target) * 100)
            const done = goal.current >= goal.target
            const isActive = animatingGoal === goal.id
            return (
              <div key={goal.id}
                className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-500 ${done ? 'bg-green-50/80 border border-green-100/50' : 'bg-black/[0.02]'}`}
                style={{ transform: isActive ? 'scale(1.01)' : 'scale(1)', transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                <span className="text-[18px] w-8 text-center" style={{ transition: 'transform 0.3s ease', transform: isActive ? 'scale(1.2) rotate(-5deg)' : 'scale(1)' }}>{goal.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[13px] font-semibold transition-all duration-300 ${done ? 'text-green-600 line-through' : 'text-gray-700'}`}>{goal.title}</span>
                    <span className="text-[11px] text-gray-400 tabular-nums">{goal.current}/{goal.target}{goal.unit}</span>
                  </div>
                  <div className="h-1.5 bg-black/[0.04] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 cubic-bezier(0.25, 0.46, 0.45, 0.94) ${done ? 'bg-green-400' : 'bg-gradient-to-r from-orange-300 to-orange-400'}`}
                      style={{ width: `${p}%`, transition: 'width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => updateGoal(goal.id, -1)}
                    className="w-8 h-8 rounded-xl bg-white border border-black/5 flex items-center justify-center text-gray-400 text-sm shadow-sm active:scale-85 transition-all duration-200 hover:border-gray-200">-</button>
                  <button onClick={() => updateGoal(goal.id, 1)}
                    className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-sm shadow-sm active:scale-85 transition-all duration-200 hover:shadow-md">+</button>
                  <button onClick={() => saveGoals(goals.filter(g => g.id !== goal.id))}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-300 text-sm hover:text-red-400 hover:bg-red-50 active:scale-85 transition-all duration-200">×</button>
                </div>
              </div>
            )
          })}
        </div>

        {showAdd ? (
          <div className="mt-3 p-4 bg-black/[0.02] rounded-2xl animate-pop">
            <div className="flex gap-2 mb-2">
              <input value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })} placeholder="目标名称" className="input flex-1" />
              <input type="number" value={newGoal.target} onChange={e => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 10 })} className="input w-20" />
            </div>
            <div className="flex gap-2">
              <button onClick={addGoal} className="flex-1 btn-primary">添加</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 btn-secondary">取消</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAdd(true)} className="w-full mt-3 py-2.5 border border-dashed border-black/10 rounded-2xl text-[13px] text-gray-400 hover:border-orange-300 hover:text-orange-400 hover:bg-orange-50/50 transition-all duration-300 active:scale-[0.98]">
            + 添加目标
          </button>
        )}
      </div>

      {/* 功能入口 */}
      <div style={stagger(3)} className="grid grid-cols-4 gap-3 mb-4">
        {[
          { href: '/graph', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/></svg>, label: '知识图谱', color: 'from-blue-500 to-blue-600' },
          { href: '/memorize', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>, label: '必背内容', color: 'from-emerald-500 to-emerald-600' },
          { href: '/practice', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, label: '刷题练习', color: 'from-orange-400 to-orange-500' },
          { href: '/mistakes', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, label: '错题本', color: 'from-rose-400 to-rose-500' },
        ].map((item, i) => (
          <a key={i} href={item.href} className="card text-center py-4 active:scale-95 transition-all duration-300 glow-border">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mx-auto mb-2 shadow-sm transition-transform duration-300 hover:scale-110 hover:shadow-md`}>{item.icon}</div>
            <div className="text-[11px] font-semibold text-gray-600">{item.label}</div>
          </a>
        ))}
      </div>

      {/* 年级选择 */}
      <div style={stagger(4)} className="card">
        <div className="text-[13px] font-semibold text-gray-700 mb-3">选择年级</div>
        <div className="flex flex-wrap gap-2">
          {grades.map(g => (
            <button key={g.id} onClick={() => setGrade(g.id)}
              className={`px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-300 active:scale-95 ${grade === g.id ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-sm' : 'bg-black/[0.03] text-gray-600 hover:bg-black/[0.06]'}`}>
              {g.emoji} {g.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <a href={`/graph?grade=${grade}`} className="flex items-center gap-3 p-3.5 bg-blue-50/80 rounded-2xl hover:bg-blue-100/80 transition-all duration-300 active:scale-[0.97]">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-sm transition-transform duration-300 hover:rotate-12">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/></svg>
            </div>
            <div><div className="text-[13px] font-semibold text-gray-800">知识图谱</div><div className="text-[11px] text-gray-400">开始学习 →</div></div>
          </a>
          <a href="/practice" className="flex items-center gap-3 p-3.5 bg-orange-50/80 rounded-2xl hover:bg-orange-100/80 transition-all duration-300 active:scale-[0.97]">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sm transition-transform duration-300 hover:rotate-12">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <div><div className="text-[13px] font-semibold text-gray-800">开始练习</div><div className="text-[11px] text-gray-400">刷题 →</div></div>
          </a>
        </div>
      </div>
    </div>
  )
}
