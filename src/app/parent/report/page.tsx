'use client'

import { useState, useEffect } from 'react'
import { getChildStudyRecords, getKnowledgeProgress, formatDuration } from '@/lib/parent-service'
import { StudyRecord, KnowledgeProgress } from '@/lib/types'
import Link from 'next/link'
import { isParentBound } from '@/lib/role-service'

export default function ParentReportPage() {
  const [records, setRecords] = useState<StudyRecord[]>([])
  const [knowledgeProgress, setKnowledgeProgress] = useState<KnowledgeProgress | null>(null)
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isParentBound()) {
      setLoading(false)
      return
    }

    const loadData = async () => {
      try {
        const [studyRecords, progress] = await Promise.all([
          getChildStudyRecords(),
          getKnowledgeProgress()
        ])
        setRecords(studyRecords)
        setKnowledgeProgress(progress)
      } catch (error) {
        console.error('加载数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // 未绑定
  if (!isParentBound()) {
    return (
      <div className="py-6 space-y-6">
        <div className="card p-5">
          <h1 className="text-xl font-bold text-gray-800 mb-1">📊 学习报告</h1>
          <p className="text-gray-600 text-sm">详细的学习数据分析</p>
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

  // 没有数据
  if (records.length === 0) {
    return (
      <div className="py-6 space-y-6">
        <div className="card p-5">
          <h1 className="text-xl font-bold text-gray-800 mb-1">📊 学习报告</h1>
          <p className="text-gray-600 text-sm">详细的学习数据分析</p>
        </div>
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">📈</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">暂无学习数据</h2>
          <p className="text-gray-500">孩子学习后，这里会显示详细报告</p>
        </div>
      </div>
    )
  }

  // 按日期分组记录
  const groupedRecords = records.reduce((acc, record) => {
    if (!acc[record.date]) {
      acc[record.date] = []
    }
    acc[record.date].push(record)
    return acc
  }, {} as Record<string, StudyRecord[]>)

  // 获取指定时间范围的记录
  const getRecordsByRange = (range: 'week' | 'month') => {
    const today = new Date()
    const startDate = new Date(today)
    if (range === 'week') {
      startDate.setDate(today.getDate() - 7)
    } else {
      startDate.setMonth(today.getMonth() - 1)
    }

    return records.filter(r => {
      const date = new Date(r.date)
      return date >= startDate && date <= today
    })
  }

  const rangeRecords = getRecordsByRange(timeRange)
  const totalDuration = rangeRecords.reduce((sum, r) => sum + r.duration, 0)
  const totalQuestions = rangeRecords.reduce((sum, r) => sum + r.questions, 0)
  const totalCorrect = rangeRecords.reduce((sum, r) => sum + r.correct, 0)
  const avgCorrectRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  // 最近7天的每日数据
  const getLast7Days = () => {
    const days = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayRecord = records.find(r => r.date === dateStr)
      days.push({
        date: dateStr,
        weekday: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
        duration: dayRecord?.duration || 0,
        questions: dayRecord?.questions || 0,
        correctRate: dayRecord
          ? Math.round((dayRecord.correct / dayRecord.questions) * 100)
          : 0
      })
    }
    return days
  }

  const last7Days = getLast7Days()
  const maxDuration = Math.max(...last7Days.map(d => d.duration), 1)

  return (
    <div className="py-6 space-y-6">
      <div className="card p-5">
        <h1 className="text-xl font-bold text-gray-800 mb-1">📊 学习报告</h1>
        <p className="text-gray-600 text-sm">详细的学习数据分析</p>
      </div>

      {/* 时间范围选择 */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setTimeRange('week')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            timeRange === 'week'
              ? 'bg-white text-orange-500 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          本周
        </button>
        <button
          onClick={() => setTimeRange('month')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            timeRange === 'month'
              ? 'bg-white text-orange-500 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          本月
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-orange-500 mb-1">
            {formatDuration(totalDuration)}
          </div>
          <div className="text-sm text-gray-500">
            {timeRange === 'week' ? '本周' : '本月'}学习时长
          </div>
        </div>

        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-blue-500 mb-1">
            {totalQuestions}
          </div>
          <div className="text-sm text-gray-500">
            {timeRange === 'week' ? '本周' : '本月'}做题数
          </div>
        </div>

        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-green-500 mb-1">
            {avgCorrectRate}%
          </div>
          <div className="text-sm text-gray-500">平均正确率</div>
        </div>

        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-purple-500 mb-1">
            {rangeRecords.length}
          </div>
          <div className="text-sm text-gray-500">学习天数</div>
        </div>
      </div>

      {/* 最近7天学习时长图 */}
      <div className="card p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">📅 最近7天学习时长</h2>

        <div className="flex items-end justify-between gap-2 h-40">
          {last7Days.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">
                  {day.duration > 0 ? `${day.duration}分` : ''}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-orange-400 to-amber-300 rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${(day.duration / maxDuration) * 100}%`,
                    minHeight: day.duration > 0 ? '4px' : '0'
                  }}
                />
              </div>
              <span className="text-xs text-gray-500">{day.weekday}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 知识点掌握情况 */}
      {knowledgeProgress && (
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">🧩 知识点掌握情况</h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-600">已掌握</span>
                <span className="text-gray-600">{knowledgeProgress.mastered} 个</span>
              </div>
              <div className="progress-bar h-3">
                <div
                  className="progress-fill bg-gradient-to-r from-green-400 to-emerald-400"
                  style={{ width: `${(knowledgeProgress.mastered / knowledgeProgress.total) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-600">学习中</span>
                <span className="text-gray-600">{knowledgeProgress.learning} 个</span>
              </div>
              <div className="progress-bar h-3">
                <div
                  className="progress-fill bg-gradient-to-r from-blue-400 to-cyan-400"
                  style={{ width: `${(knowledgeProgress.learning / knowledgeProgress.total) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">未开始</span>
                <span className="text-gray-600">{knowledgeProgress.notStarted} 个</span>
              </div>
              <div className="progress-bar h-3">
                <div
                  className="progress-fill bg-gradient-to-r from-gray-300 to-gray-400"
                  style={{ width: `${(knowledgeProgress.notStarted / knowledgeProgress.total) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="text-4xl font-bold text-orange-500">
              {Math.round((knowledgeProgress.mastered / knowledgeProgress.total) * 100)}%
            </div>
            <div className="text-sm text-gray-500">知识点掌握率</div>
          </div>
        </div>
      )}

      {/* 学习记录列表 */}
      <div className="card p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">📋 学习记录</h2>

        {Object.keys(groupedRecords).length === 0 ? (
          <div className="text-center py-8 text-gray-500">暂无学习记录</div>
        ) : (
          <div className="space-y-3">
            {Object.entries(groupedRecords)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .slice(0, 10)
              .map(([date, dayRecords]) => {
                const record = dayRecords[0]
                return (
                  <div key={date} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">{date}</span>
                      <span className="text-sm text-orange-500">+{record.points} 风筝币</span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>⏱️ {record.duration}分钟</span>
                      <span>📝 {record.questions}题</span>
                      <span>✅ {record.correct}对</span>
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}
