'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getChaptersByGrade, getNodeById, gradeNames, difficultyNames, type KnowledgeNode } from '@/data/knowledge-graph'

export default function GraphPage() {
  const sp = useSearchParams()
  const [grade, setGrade] = useState(sp.get('grade') || 'g7')
  const [node, setNode] = useState<KnowledgeNode | null>(null)
  const [status, setStatus] = useState<Record<string, string>>({})
  const [showSheet, setShowSheet] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setTimeout(() => setVisible(true), 50))
    setStatus(JSON.parse(localStorage.getItem('knowledge-status') || '{}'))
  }, [])

  const chapters = getChaptersByGrade(grade)
  const setS = (id: string, s: string) => { const u = { ...status, [id]: s }; setStatus(u); localStorage.setItem('knowledge-status', JSON.stringify(u)) }
  const getS = (id: string) => status[id] || 'not-started'
  const mastered = chapters.flatMap(c => c.nodes).filter(n => getS(n.id) === 'mastered').length
  const total = chapters.flatMap(c => c.nodes).length

  const stagger = (i: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(12px)',
    transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 50}ms`
  })

  return (
    <div className="container py-5">
      <div style={stagger(0)} className="flex items-center justify-between mb-4">
        <h1 className="text-[18px] font-bold text-gray-900">知识图谱</h1>
        <span className="text-[11px] text-gray-400">{mastered}/{total} 已掌握</span>
      </div>

      <div style={stagger(1)} className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
        {Object.entries(gradeNames).map(([k, v]) => (
          <button key={k} onClick={() => { setGrade(k); setNode(null) }}
            className={`px-3.5 py-1.5 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-300 active:scale-95 ${grade === k ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-sm' : 'bg-black/[0.03] text-gray-600'}`}>{v}</button>
        ))}
      </div>

      {chapters.map((ch, ci) => (
        <div key={ch.id} className="mb-5" style={stagger(ci + 2)}>
          <div className="text-[11px] font-semibold text-gray-400 mb-2.5 uppercase tracking-wider">{ch.name}</div>
          <div className="flex flex-wrap gap-2">
            {ch.nodes.map(n => {
              const s = getS(n.id)
              return (
                <button key={n.id} onClick={() => { setNode(n); setShowSheet(true) }}
                  className={`px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 active:scale-95 ${
                    node?.id === n.id ? 'ring-2 ring-orange-400 bg-orange-50 shadow-sm' :
                    s === 'mastered' ? 'bg-green-50 text-green-600 border border-green-100' :
                    s === 'learning' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-white border border-black/5 text-gray-600 hover:border-orange-200 hover:shadow-sm'
                  }`}>
                  {s === 'mastered' && <span className="mr-1">✓</span>}{n.name}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {showSheet && node && (
        <>
          <div className="overlay" onClick={() => setShowSheet(false)} />
          <div className="bottom-sheet">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[16px] font-bold text-gray-900">{node.name}</h3>
              <button onClick={() => setShowSheet(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 active:scale-90 transition-all duration-200">×</button>
            </div>
            <p className="text-[13px] text-gray-500 mb-4 leading-relaxed">{node.description}</p>

            <div className="text-[11px] font-semibold text-gray-400 mb-2 uppercase tracking-wider">学习状态</div>
            <div className="flex gap-2 mb-5">
              {[{ v: 'not-started', l: '未开始', c: 'bg-gray-100 text-gray-500' }, { v: 'learning', l: '学习中', c: 'bg-amber-100 text-amber-600' }, { v: 'mastered', l: '已掌握', c: 'bg-green-100 text-green-600' }].map(o => (
                <button key={o.v} onClick={() => setS(node.id, o.v)}
                  className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 active:scale-95 ${getS(node.id) === o.v ? `${o.c} ring-2 ring-orange-300 shadow-sm` : 'bg-black/[0.03] text-gray-500'}`}>{o.l}</button>
              ))}
            </div>

            {node.prerequisites.length > 0 && (
              <div className="mb-5">
                <div className="text-[11px] font-semibold text-gray-400 mb-2 uppercase tracking-wider">前置知识</div>
                <div className="flex flex-wrap gap-1.5">
                  {node.prerequisites.map(id => { const n = getNodeById(id); return n ? <span key={id} className="px-2.5 py-1 bg-black/[0.03] rounded-lg text-[11px] font-medium text-gray-600">{n.name}</span> : null })}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <a href={`/practice?node=${node.id}`} className="flex-1 btn-primary text-center">开始练习</a>
              <a href={`/mistakes?node=${node.id}`} className="flex-1 btn-secondary text-center">查看错题</a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
