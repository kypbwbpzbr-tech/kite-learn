'use client'

import { useState, useEffect } from 'react'
import { getChildMistakes, getMistakesBySubject, getMistakesByStatus, MistakeRecord } from '@/lib/parent-service'
import Link from 'next/link'
import { isParentBound } from '@/lib/role-service'

export default function ParentMistakesPage() {
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([])
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'mastered'>('all')
  const [selectedMistake, setSelectedMistake] = useState<MistakeRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isParentBound()) {
      setLoading(false)
      return
    }
    loadMistakes()
  }, [subjectFilter, statusFilter])

  const loadMistakes = async () => {
    try {
      let filtered = subjectFilter === 'all'
        ? await getChildMistakes()
        : await getMistakesBySubject(subjectFilter)

      if (statusFilter !== 'all') {
        filtered = filtered.filter(m =>
          statusFilter === 'mastered' ? m.mastered : !m.mastered
        )
      }

      setMistakes(filtered)
    } catch (error) {
      console.error('加载错题失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 未绑定
  if (!isParentBound()) {
    return (
      <div className="py-6 space-y-6">
        <div className="card p-5">
          <h1 className="text-xl font-bold text-gray-800 mb-1">❌ 错题本</h1>
          <p className="text-gray-600 text-sm">查看孩子的错题记录</p>
        </div>
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">👨‍👩‍👧</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">请先绑定孩子</h2>
          <Link href="/parent/bind" className="inline-block px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-400 text-white font-semibold rounded-xl">
            绑定孩子
          </Link>
        </div>
      </div>
    )
  }

  // 加载中
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-float">🪁</div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    )
  }

  // 获取所有科目
  const getSubjects = () => {
    const allMistakes = mistakes.length > 0 ? mistakes : []
    const subjects = new Set(allMistakes.map(m => m.subject))
    return ['all', ...Array.from(subjects)]
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单'
      case 'medium': return '中等'
      case 'hard': return '困难'
      default: return difficulty
    }
  }

  return (
    <div className="py-6 space-y-6">
      <div className="card p-5">
        <h1 className="text-xl font-bold text-gray-800 mb-1">❌ 错题本</h1>
        <p className="text-gray-600 text-sm">查看孩子的错题记录</p>
      </div>

      {/* 筛选器 */}
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {getSubjects().map((subject) => (
            <button
              key={subject}
              onClick={() => setSubjectFilter(subject)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                subjectFilter === subject
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {subject === 'all' ? '全部' : subject}
            </button>
          ))}
        </div>

        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-orange-500 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'pending'
                ? 'bg-white text-orange-500 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            待复习
          </button>
          <button
            onClick={() => setStatusFilter('mastered')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'mastered'
                ? 'bg-white text-orange-500 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            已掌握
          </button>
        </div>
      </div>

      {/* 错题统计 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-orange-500">
            {getChildMistakes.length || mistakes.length}
          </div>
          <div className="text-xs text-gray-500">总错题</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-500">
            {mistakes.filter(m => !m.mastered).length}
          </div>
          <div className="text-xs text-gray-500">待复习</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-500">
            {mistakes.filter(m => m.mastered).length}
          </div>
          <div className="text-xs text-gray-500">已掌握</div>
        </div>
      </div>

      {/* 错题列表 */}
      <div className="space-y-3">
        {mistakes.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">暂无错题记录</h2>
            <p className="text-gray-500">孩子做题后，错题会出现在这里</p>
          </div>
        ) : (
          mistakes.map((mistake) => (
            <div
              key={mistake.id}
              className="card p-4 cursor-pointer hover:scale-[1.01] transition-transform"
              onClick={() => setSelectedMistake(
                selectedMistake?.id === mistake.id ? null : mistake
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(mistake.difficulty)}`}>
                    {getDifficultyLabel(mistake.difficulty)}
                  </span>
                  <span className="text-xs text-gray-500">{mistake.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  {mistake.mastered && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                      ✓ 已掌握
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {formatTime(mistake.timestamp)}
                  </span>
                </div>
              </div>

              <div className="text-gray-800 mb-2 line-clamp-2">
                {mistake.question}
              </div>

              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-gray-500">孩子的答案：</span>
                  <span className="text-red-500">{mistake.userAnswer}</span>
                </div>
                <div>
                  <span className="text-gray-500">正确答案：</span>
                  <span className="text-green-500">{mistake.correctAnswer}</span>
                </div>
              </div>

              {selectedMistake?.id === mistake.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <span>复习次数：</span>
                      <span className="font-medium">{mistake.reviewCount} 次</span>
                    </div>
                    <div className="flex justify-between">
                      <span>状态：</span>
                      <span className="font-medium">
                        {mistake.mastered ? '已掌握' : '待复习'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
