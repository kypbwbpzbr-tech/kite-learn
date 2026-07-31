'use client'

import { useState, useEffect } from 'react'
import { allGradeContent, categoryNames, type MemorizeItem } from '@/data/memorize-data'

function MathFormula({ formula }: { formula: string }) {
  const r = (t: string) => t.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="inline-flex flex-col items-center mx-1 align-middle"><span class="text-xs border-b border-current px-1">$1</span><span class="text-xs px-1">$2</span></span>')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)').replace(/\\times/g, '×').replace(/\\div/g, '÷').replace(/\\pm/g, '±')
    .replace(/\\cdot/g, '·').replace(/\^2/g, '²').replace(/\^3/g, '³').replace(/\^{([^}]+)}/g, '<sup>$1</sup>').replace(/_{([^}]+)}/g, '<sub>$1</sub>')
    .replace(/\\neq/g, '≠').replace(/\\leq/g, '≤').replace(/\\geq/g, '≥').replace(/\\pi/g, 'π').replace(/\\infty/g, '∞').replace(/\\Delta/g, 'Δ')
  return <div className="my-2 text-center text-lg font-mono" dangerouslySetInnerHTML={{ __html: r(formula) }} />
}

export default function MemorizePage() {
  const [grade, setGrade] = useState('g7')
  const [cat, setCat] = useState<string | null>(null)
  const [cur, setCur] = useState<MemorizeItem | null>(null)
  const [show, setShow] = useState(false)
  const [mastered, setMastered] = useState<Set<string>>(new Set())
  const [points, setPoints] = useState(0)
  const [visible, setVisible] = useState(false)
  const [cardAnim, setCardAnim] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setTimeout(() => setVisible(true), 50))
    setMastered(new Set(JSON.parse(localStorage.getItem('memorized-items') || '[]')))
    setPoints(parseInt(localStorage.getItem('kite-points') || '0'))
  }, [])

  const items = allGradeContent.find(g => g.grade === grade)?.items.filter(i => !cat || i.category === cat) || []
  const todo = items.filter(i => !mastered.has(i.id))
  const mc = items.filter(i => mastered.has(i.id)).length
  const prog = items.length > 0 ? Math.round((mc / items.length) * 100) : 0

  const done = (item: MemorizeItem) => {
    setCardAnim(true)
    setTimeout(() => {
      const m = new Set(mastered); m.add(item.id); setMastered(m)
      localStorage.setItem('memorized-items', JSON.stringify(Array.from(m)))
      const p = points + item.points; setPoints(p); localStorage.setItem('kite-points', p.toString())
      const idx = todo.findIndex(i => i.id !== item.id)
      setCur(idx !== -1 ? todo[idx > 0 ? idx : 0] : null); setShow(false)
      setCardAnim(false)
    }, 300)
  }

  const stagger = (i: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(12px)',
    transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 50}ms`
  })

  return (
    <div className="container py-5">
      <div style={stagger(0)} className="flex items-center justify-between mb-4">
        <h1 className="text-[18px] font-bold text-gray-900">必背内容</h1>
        <span className="text-[11px] text-gray-400">{mc}/{items.length}</span>
      </div>

      <div style={stagger(1)} className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-4 px-4">
        {allGradeContent.map(g => (
          <button key={g.grade} onClick={() => { setGrade(g.grade); setCur(null) }}
            className={`px-3.5 py-1.5 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-300 active:scale-95 ${grade === g.grade ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-sm' : 'bg-black/[0.03] text-gray-600'}`}>{g.gradeName}</button>
        ))}
      </div>

      <div style={stagger(2)} className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4">
        <button onClick={() => setCat(null)} className={`px-3 py-1.5 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all duration-300 ${!cat ? 'bg-orange-500 text-white' : 'bg-black/[0.03] text-gray-500'}`}>全部</button>
        {Object.entries(categoryNames).map(([k, v]) => (
          <button key={k} onClick={() => setCat(k)} className={`px-3 py-1.5 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all duration-300 ${cat === k ? 'bg-orange-500 text-white' : 'bg-black/[0.03] text-gray-500'}`}>{v.icon} {v.name}</button>
        ))}
      </div>

      <div style={stagger(3)} className="mb-4">
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${prog}%` }} /></div>
        <div className="text-[11px] text-gray-400 mt-1 text-right">{prog}%</div>
      </div>

      {cur && (
        <div className={`card mb-4 bg-gradient-to-br from-orange-50/60 to-amber-50/60 transition-all duration-500 ${cardAnim ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="tag bg-white/80 text-blue-600 border border-blue-100/50 shadow-sm">{categoryNames[cur.category].icon} {categoryNames[cur.category].name}</span>
            <span className="tag bg-white/80 text-orange-600 border border-orange-100/50 shadow-sm">+{cur.points} 🪁</span>
          </div>
          <h2 className="text-[16px] font-bold text-gray-900 mb-3">{cur.title}</h2>
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 mb-3">
            <p className="text-[14px] text-gray-700 leading-relaxed">{cur.content}</p>
            {cur.formula && <MathFormula formula={cur.formula} />}
          </div>
          {show && (
            <div className="p-3 bg-green-50/80 rounded-2xl text-[12px] text-green-700 mb-3 border border-green-100/50 animate-pop">
              💡 {cur.category === 'formula' ? '理解公式中每个字母的含义，多写几遍加深记忆' : cur.category === 'definition' ? '抓住关键词，理解概念的本质' : '理解定理的条件和结论'}
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => setShow(!show)} className="flex-1 btn-secondary text-[13px]">{show ? '收起' : '提示'}</button>
            <button onClick={() => done(cur)} className="flex-1 btn-primary text-[13px]">✓ 已掌握</button>
          </div>
          <div className="text-[11px] text-gray-400 text-center mt-2.5">剩余 {todo.length} 项</div>
        </div>
      )}

      {!cur && items.length > 0 && <div className="card text-center py-8 mb-4 animate-pop"><div className="text-4xl mb-2">🎉</div><div className="font-bold text-gray-900">全部掌握！</div></div>}

      {!cur && (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={item.id} onClick={() => { setCur(item); setShow(false) }}
              className={`card cursor-pointer active:scale-[0.98] transition-all duration-300 ${mastered.has(item.id) ? 'bg-green-50/60 border-green-100/50' : ''}`}
              style={{ ...stagger(i + 4), animationDelay: `${i * 30}ms` }}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all duration-300 ${mastered.has(item.id) ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {mastered.has(item.id) ? '✓' : categoryNames[item.category].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-gray-800">{item.title}</div>
                  {item.formula && <div className="text-[11px] text-gray-400 mt-0.5 truncate font-mono">{item.formula}</div>}
                </div>
                <div className="text-[11px] text-gray-400 font-medium">+{item.points}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
