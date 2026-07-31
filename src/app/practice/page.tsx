'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getNodeById, difficultyNames } from '@/data/knowledge-graph'

interface Q { id: string; nodeId: string; type: 'choice' | 'fill' | 'judge'; content: string; options?: string[]; answer: string; explanation: string; difficulty: number; }

const bank: Q[] = [
  { id: 'q1', nodeId: 'g7-negative', type: 'choice', content: '下列哪个数是负数？', options: ['3', '-5', '0', '2.5'], answer: '-5', explanation: '负数是小于0的数', difficulty: 1 },
  { id: 'q2', nodeId: 'g7-negative', type: 'judge', content: '0是正数也是负数', answer: '错', explanation: '0既不是正数也不是负数', difficulty: 1 },
  { id: 'q3', nodeId: 'g7-number-line', type: 'choice', content: '在数轴上，-3在-5的哪一边？', options: ['左边', '右边', '重合', '无法确定'], answer: '右边', explanation: '数轴上右边的数比左边的大', difficulty: 1 },
  { id: 'q4', nodeId: 'g7-calculation', type: 'fill', content: '计算：(-3) + (-5) = ?', answer: '-8', explanation: '同号两数相加，取相同的符号', difficulty: 2 },
  { id: 'q5', nodeId: 'g7-calculation', type: 'choice', content: '计算：(-2) × 3 = ?', options: ['6', '-6', '5', '-5'], answer: '-6', explanation: '异号两数相乘取负号', difficulty: 2 },
  { id: 'q6', nodeId: 'g7-algebraic', type: 'fill', content: '用代数式表示：x的3倍减去5', answer: '3x-5', explanation: 'x的3倍是3x，减去5就是3x-5', difficulty: 1 },
  { id: 'q7', nodeId: 'g7-polynomial', type: 'choice', content: '下列哪个是单项式？', options: ['x+1', '3x²', '2x+3y', 'x²+2x+1'], answer: '3x²', explanation: '单项式是只有一个项的整式', difficulty: 2 },
]

function PracticeContent() {
  const sp = useSearchParams()
  const nid = sp.get('node')
  const [q, setQ] = useState<Q | null>(null)
  const [ans, setAns] = useState('')
  const [done, setDone] = useState(false)
  const [ok, setOk] = useState(false)
  const [stats, setStats] = useState({ t: 0, c: 0 })
  const [points, setPoints] = useState(0)
  const [visible, setVisible] = useState(false)
  const [resultAnim, setResultAnim] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setTimeout(() => setVisible(true), 50))
    setPoints(parseInt(localStorage.getItem('kite-points') || '0'))
    if (nid) load(nid)
  }, [nid])

  const load = (id: string) => {
    setQ(null); setDone(false); setResultAnim(false)
    setTimeout(() => {
      const qs = bank.filter(q => q.nodeId === id)
      if (qs.length) { setQ(qs[Math.floor(Math.random() * qs.length)]); setAns('') }
    }, 150)
  }

  const submit = () => {
    if (!q || !ans) return
    const correct = ans.trim() === q.answer
    setOk(correct); setDone(true); setResultAnim(true)
    setStats(p => ({ t: p.t + 1, c: p.c + (correct ? 1 : 0) }))
    if (correct) { const p = points + q.difficulty * 5; setPoints(p); localStorage.setItem('kite-points', p.toString()) }
    else { const m = JSON.parse(localStorage.getItem('mistakes') || '[]'); m.push({ ...q, userAnswer: ans, timestamp: new Date().toISOString() }); localStorage.setItem('mistakes', JSON.stringify(m)) }
  }

  const stagger = (i: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(12px)',
    transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 50}ms`
  })

  return (
    <div className="container py-5">
      <div style={stagger(0)} className="flex items-center justify-between mb-4">
        <h1 className="text-[18px] font-bold text-gray-900">刷题练习</h1>
        <div className="flex items-center gap-3 text-[13px]">
          <span className="text-green-500 font-semibold">✓ {stats.c}</span>
          <span className="text-gray-400">共 {stats.t}</span>
          <span className="tag bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 border border-orange-100/50">{points} 🪁</span>
        </div>
      </div>

      {!q && (
        <div style={stagger(1)} className="card">
          <div className="text-[13px] font-semibold text-gray-700 mb-3">选择知识点</div>
          <div className="grid grid-cols-2 gap-2">
            {['g7-negative', 'g7-number-line', 'g7-calculation', 'g7-algebraic', 'g7-polynomial'].map(id => {
              const n = getNodeById(id)
              return n ? (
                <button key={id} onClick={() => load(id)} className="p-3.5 bg-black/[0.02] rounded-2xl text-left hover:bg-orange-50 transition-all duration-300 active:scale-[0.97]">
                  <div className="text-[13px] font-semibold text-gray-800">{n.name}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{difficultyNames[n.difficulty]}</div>
                </button>
              ) : null
            })}
          </div>
        </div>
      )}

      {q && (
        <div className="card animate-pop">
          <div className="flex items-center gap-2 mb-3">
            <span className="tag bg-blue-50 text-blue-600">{q.type === 'choice' ? '选择题' : q.type === 'fill' ? '填空题' : '判断题'}</span>
            <span className="text-[11px] text-gray-400">{difficultyNames[q.difficulty]}</span>
          </div>

          <div className="text-[15px] text-gray-800 mb-5 leading-relaxed">{q.content}</div>

          {q.type === 'choice' && q.options && (
            <div className="space-y-2 mb-5">
              {q.options.map((opt, i) => (
                <label key={i} style={{ transitionDelay: `${i * 40}ms` }}
                  className={`block p-4 border-[1.5px] rounded-2xl cursor-pointer transition-all duration-300 active:scale-[0.98] text-[14px] ${
                    ans === opt ? 'border-orange-400 bg-orange-50/80 shadow-sm' : 'border-black/5 hover:border-black/10 hover:shadow-sm'
                  } ${done ? (opt === q.answer ? '!border-green-400 !bg-green-50 !shadow-sm' : ans === opt ? '!border-red-400 !bg-red-50 !shadow-sm' : '') : ''}`}>
                  <input type="radio" name="a" value={opt} checked={ans === opt} onChange={e => setAns(e.target.value)} disabled={done} className="mr-2 accent-orange-500" />{opt}
                </label>
              ))}
            </div>
          )}

          {q.type === 'fill' && (
            <input type="text" value={ans} onChange={e => setAns(e.target.value)} disabled={done} placeholder="输入答案"
              className={`input mb-5 text-[15px] ${done ? (ok ? '!border-green-400 !bg-green-50/50' : '!border-red-400 !bg-red-50/50') : ''}`} />
          )}

          {q.type === 'judge' && (
            <div className="flex gap-2 mb-5">
              {['对', '错'].map(opt => (
                <label key={opt} className={`flex-1 p-4 border-[1.5px] rounded-2xl text-center cursor-pointer text-[14px] font-medium transition-all duration-300 active:scale-[0.98] ${
                  ans === opt ? 'border-orange-400 bg-orange-50/80 shadow-sm' : 'border-black/5 hover:border-black/10 hover:shadow-sm'
                } ${done ? (opt === q.answer ? '!border-green-400 !bg-green-50' : ans === opt ? '!border-red-400 !bg-red-50' : '') : ''}`}>
                  <input type="radio" name="a" value={opt} checked={ans === opt} onChange={e => setAns(e.target.value)} disabled={done} className="mr-2 accent-orange-500" />{opt}
                </label>
              ))}
            </div>
          )}

          {done && (
            <div className={`p-4 rounded-2xl mb-5 border ${resultAnim ? 'animate-pop' : ''} ${ok ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              <div className="font-semibold mb-1">{ok ? '🎉 回答正确！' : `✗ 正确答案：${q.answer}`}</div>
              <div className="text-gray-500">{q.explanation}</div>
            </div>
          )}

          <div className="flex gap-2">
            {!done ? (
              <button onClick={submit} disabled={!ans} className="flex-1 btn-primary disabled:opacity-40 disabled:shadow-none">提交</button>
            ) : (
              <>
                <button onClick={() => nid && load(nid)} className="flex-1 btn-primary">下一题</button>
                <a href="/mistakes" className="flex-1 btn-secondary text-center">错题本</a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="container py-5"><div className="card text-center py-8 text-gray-400">加载中...</div></div>}>
      <PracticeContent />
    </Suspense>
  )
}
