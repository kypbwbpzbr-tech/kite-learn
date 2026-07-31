'use client'

import { useState, useEffect } from 'react'
import { getNodeById } from '@/data/knowledge-graph'

interface M { id: string; nodeId: string; type: 'choice' | 'fill' | 'judge'; content: string; options?: string[]; answer: string; userAnswer: string; explanation: string; difficulty: number; timestamp: string; reviewCount?: number; mastered?: boolean; }

export default function MistakesPage() {
  const [list, setList] = useState<M[]>([])
  const [filter, setFilter] = useState<'all' | 'wrong' | 'mastered'>('all')
  const [sel, setSel] = useState<M | null>(null)
  const [showSheet, setShowSheet] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setTimeout(() => setVisible(true), 50))
    setList(JSON.parse(localStorage.getItem('mistakes') || '[]'))
  }, [])

  const review = (id: string) => {
    const u = list.map(m => { if (m.id === id) { const rc = (m.reviewCount || 0) + 1; return { ...m, reviewCount: rc, mastered: rc >= 3 } } return m })
    setList(u); localStorage.setItem('mistakes', JSON.stringify(u))
    const p = parseInt(localStorage.getItem('kite-points') || '0') + 10; localStorage.setItem('kite-points', p.toString())
  }

  const del = (id: string) => { const u = list.filter(m => m.id !== id); setList(u); localStorage.setItem('mistakes', JSON.stringify(u)); if (sel?.id === id) { setSel(null); setShowSheet(false) } }

  const filtered = list.filter(m => filter === 'wrong' ? !m.mastered : filter === 'mastered' ? m.mastered : true)
  const grouped = filtered.reduce((a, m) => { if (!a[m.nodeId]) a[m.nodeId] = []; a[m.nodeId].push(m); return a }, {} as Record<string, M[]>)

  const stagger = (i: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(12px)',
    transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 50}ms`
  })

  return (
    <div className="container py-5">
      <div style={stagger(0)} className="flex items-center justify-between mb-4">
        <h1 className="text-[18px] font-bold text-gray-900">错题本</h1>
        <span className="text-[11px] text-gray-400">{list.filter(m => !m.mastered).length} 待复习</span>
      </div>

      <div style={stagger(1)} className="flex gap-2 mb-4">
        {[{ k: 'all', l: `全部 (${list.length})` }, { k: 'wrong', l: `待复习 (${list.filter(m => !m.mastered).length})` }, { k: 'mastered', l: `已掌握 (${list.filter(m => m.mastered).length})` }].map(f => (
          <button key={f.k} onClick={() => setFilter(f.k as any)}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-300 active:scale-95 ${filter === f.k ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-sm' : 'bg-black/[0.03] text-gray-600'}`}>{f.l}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={stagger(2)} className="card text-center py-10 animate-pop">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="text-[15px] font-semibold text-gray-700 mb-1">{filter === 'all' ? '暂无错题' : '没有符合条件的错题'}</div>
          <div className="text-[12px] text-gray-400 mb-4">继续做题，错题会自动收录</div>
          <a href="/practice" className="btn-primary inline-block">去做题</a>
        </div>
      ) : (
        Object.entries(grouped).map(([nodeId, items], ci) => {
          const node = getNodeById(nodeId)
          return (
            <div key={nodeId} className="mb-5" style={stagger(ci + 2)}>
              <div className="text-[11px] font-semibold text-gray-400 mb-2.5 uppercase tracking-wider">{node?.name || nodeId}</div>
              {items.map(m => (
                <div key={m.id} onClick={() => { setSel(m); setShowSheet(true) }}
                  className={`card cursor-pointer active:scale-[0.98] transition-all duration-300 mb-2 ${sel?.id === m.id ? 'ring-2 ring-orange-400 shadow-sm' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="tag bg-blue-50 text-blue-600">{m.type === 'choice' ? '选择' : m.type === 'fill' ? '填空' : '判断'}</span>
                        {m.mastered && <span className="tag bg-green-50 text-green-600">已掌握</span>}
                      </div>
                      <p className="text-[13px] text-gray-800 line-clamp-2 leading-relaxed">{m.content}</p>
                      <div className="text-[11px] mt-1.5"><span className="text-red-400">你: {m.userAnswer}</span> <span className="text-gray-300 mx-0.5">|</span> <span className="text-green-500">对: {m.answer}</span></div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); del(m.id) }} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 active:scale-90 transition-all duration-200">×</button>
                  </div>
                </div>
              ))}
            </div>
          )
        })
      )}

      {showSheet && sel && (
        <>
          <div className="overlay" onClick={() => setShowSheet(false)} />
          <div className="bottom-sheet">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-gray-900">题目详情</h3>
              <button onClick={() => setShowSheet(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 active:scale-90 transition-all duration-200">×</button>
            </div>

            <div className="text-[14px] text-gray-700 mb-4 leading-relaxed">{sel.content}</div>

            {sel.options && (
              <div className="space-y-1.5 mb-4">
                {sel.options.map((opt, i) => (
                  <div key={i} className={`p-3 rounded-xl text-[13px] font-medium transition-all duration-300 ${opt === sel.answer ? 'bg-green-50 text-green-700 border border-green-100' : opt === sel.userAnswer ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-gray-50 border border-black/5'}`}>{opt}</div>
                ))}
              </div>
            )}

            <div className="flex justify-between text-[13px] mb-4 p-4 bg-black/[0.02] rounded-2xl">
              <div><div className="text-gray-400 text-[11px] mb-0.5">你的答案</div><div className="text-red-500 font-bold">{sel.userAnswer}</div></div>
              <div className="text-right"><div className="text-gray-400 text-[11px] mb-0.5">正确答案</div><div className="text-green-500 font-bold">{sel.answer}</div></div>
            </div>

            <div className="p-4 bg-blue-50/80 rounded-2xl text-[13px] text-blue-700 mb-5 border border-blue-100/50 leading-relaxed">💡 {sel.explanation}</div>

            <div className="flex gap-2">
              {!sel.mastered && <button onClick={() => { review(sel.id); setShowSheet(false) }} className="flex-1 btn-primary text-[13px]">✓ 已复习 (+10🪁)</button>}
              <a href={`/practice?node=${sel.nodeId}`} className="flex-1 btn-secondary text-center text-[13px]">重新做</a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
