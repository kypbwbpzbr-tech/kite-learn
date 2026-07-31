'use client'

import { useState, useEffect } from 'react'

// 学习记录类型
interface StudyRecord {
  date: string
  duration: number // 学习时长（分钟）
  questions: number // 做题数
  memorized: number // 背诵数
  points: number // 获得积分
}

// 成就类型
interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: (records: StudyRecord[]) => boolean
  unlocked: boolean
}

// 成就列表
const achievements: Achievement[] = [
  {
    id: 'first-day',
    name: '初出茅庐',
    description: '完成第一天的学习',
    icon: '🌱',
    condition: (records) => records.length >= 1,
    unlocked: false,
  },
  {
    id: 'three-days',
    name: '三日坚持',
    description: '连续学习3天',
    icon: '🔥',
    condition: (records) => {
      const sorted = records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      for (let i = 0; i < Math.min(3, sorted.length); i++) {
        const date = new Date(sorted[i].date)
        const expected = new Date()
        expected.setDate(expected.getDate() - i)
        if (date.toISOString().split('T')[0] !== expected.toISOString().split('T')[0]) return false
      }
      return sorted.length >= 3
    },
    unlocked: false,
  },
  {
    id: 'week-streak',
    name: '周周不断',
    description: '连续学习7天',
    icon: '⭐',
    condition: (records) => {
      const sorted = records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      for (let i = 0; i < Math.min(7, sorted.length); i++) {
        const date = new Date(sorted[i].date)
        const expected = new Date()
        expected.setDate(expected.getDate() - i)
        if (date.toISOString().split('T')[0] !== expected.toISOString().split('T')[0]) return false
      }
      return sorted.length >= 7
    },
    unlocked: false,
  },
  {
    id: 'hundred-questions',
    name: '百题大关',
    description: '累计做题100道',
    icon: '💯',
    condition: (records) => records.reduce((sum, r) => sum + r.questions, 0) >= 100,
    unlocked: false,
  },
  {
    id: 'fifty-memorize',
    name: '记忆达人',
    description: '累计背诵50个知识点',
    icon: '🧠',
    condition: (records) => records.reduce((sum, r) => sum + r.memorized, 0) >= 50,
    unlocked: false,
  },
  {
    id: 'thousand-points',
    name: '积分大户',
    description: '累计获得1000风筝币',
    icon: '🪁',
    condition: (records) => records.reduce((sum, r) => sum + r.points, 0) >= 1000,
    unlocked: false,
  },
  {
    id: 'early-bird',
    name: '早起鸟儿',
    description: '早上6点前开始学习',
    icon: '🐦',
    condition: () => {
      const hour = new Date().getHours()
      return hour < 6
    },
    unlocked: false,
  },
  {
    id: 'night-owl',
    name: '夜猫子',
    description: '晚上11点后还在学习',
    icon: '🦉',
    condition: () => {
      const hour = new Date().getHours()
      return hour >= 23
    },
    unlocked: false,
  },
]

export default function CalendarPage() {
  const [records, setRecords] = useState<StudyRecord[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set())
  const [showAchievements, setShowAchievements] = useState(false)
  const [totalStats, setTotalStats] = useState({
    totalDays: 0,
    totalQuestions: 0,
    totalMemorized: 0,
    totalPoints: 0,
    totalMinutes: 0,
    streak: 0,
  })

  // 加载数据
  useEffect(() => {
    const savedRecords = JSON.parse(localStorage.getItem('study-records') || '[]')
    const savedAchievements = JSON.parse(localStorage.getItem('unlocked-achievements') || '[]')

    setRecords(savedRecords)
    setUnlockedAchievements(new Set(savedAchievements))

    // 计算统计
    calculateStats(savedRecords)
    // 检查成就
    checkAchievements(savedRecords)
  }, [])

  // 计算统计
  const calculateStats = (recs: StudyRecord[]) => {
    const totalDays = recs.length
    const totalQuestions = recs.reduce((sum, r) => sum + r.questions, 0)
    const totalMemorized = recs.reduce((sum, r) => sum + r.memorized, 0)
    const totalPoints = recs.reduce((sum, r) => sum + r.points, 0)
    const totalMinutes = recs.reduce((sum, r) => sum + r.duration, 0)

    // 计算连续天数
    let streak = 0
    const today = new Date()
    const sorted = [...recs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]

      if (sorted.some(r => r.date === dateStr)) {
        streak++
      } else {
        break
      }
    }

    setTotalStats({
      totalDays,
      totalQuestions,
      totalMemorized,
      totalPoints,
      totalMinutes,
      streak,
    })
  }

  // 检查成就
  const checkAchievements = (recs: StudyRecord[]) => {
    const newUnlocked = new Set(unlockedAchievements)
    let hasNew = false

    achievements.forEach(achievement => {
      if (!newUnlocked.has(achievement.id) && achievement.condition(recs)) {
        newUnlocked.add(achievement.id)
        hasNew = true
      }
    })

    if (hasNew) {
      setUnlockedAchievements(newUnlocked)
      localStorage.setItem('unlocked-achievements', JSON.stringify([...newUnlocked]))
    }
  }

  // 获取当月日历
  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days = []

    // 填充上月空白
    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -i)
      days.unshift({
        date: prevDate,
        isCurrentMonth: false,
      })
    }

    // 当月日期
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      days.push({
        date,
        isCurrentMonth: true,
      })
    }

    // 填充下月空白
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i)
      days.push({
        date: nextDate,
        isCurrentMonth: false,
      })
    }

    return days
  }

  // 获取某天的学习记录
  const getRecordForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return records.find(r => r.date === dateStr)
  }

  // 添加学习记录
  const addStudyRecord = () => {
    const today = new Date().toISOString().split('T')[0]
    const existing = records.find(r => r.date === today)

    if (existing) {
      // 更新现有记录
      const updated = records.map(r => {
        if (r.date === today) {
          return {
            ...r,
            duration: r.duration + 30,
            questions: r.questions + 5,
            memorized: r.memorized + 2,
            points: r.points + 10,
          }
        }
        return r
      })
      setRecords(updated)
      localStorage.setItem('study-records', JSON.stringify(updated))
    } else {
      // 创建新记录
      const newRecord: StudyRecord = {
        date: today,
        duration: 30,
        questions: 5,
        memorized: 2,
        points: 10,
      }
      const updated = [...records, newRecord]
      setRecords(updated)
      localStorage.setItem('study-records', JSON.stringify(updated))
    }

    // 更新统计
    calculateStats(existing ? records.map(r => r.date === today ? { ...r, duration: r.duration + 30, questions: r.questions + 5, memorized: r.memorized + 2, points: r.points + 10 } : r) : [...records, { date: today, duration: 30, questions: 5, memorized: 2, points: 10 }])

    // 检查成就
    checkAchievements(records)
  }

  const calendarDays = getCalendarDays()
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">📅 学习日历</h1>
            <p className="text-gray-600">记录学习，见证成长</p>
          </div>
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="btn-secondary"
          >
            🏆 成就 ({unlockedAchievements.size}/{achievements.length})
          </button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-3xl font-bold text-orange-500">{totalStats.streak}</div>
            <div className="text-xs text-gray-500">连续天数</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-500">{totalStats.totalDays}</div>
            <div className="text-xs text-gray-500">学习天数</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-500">{totalStats.totalQuestions}</div>
            <div className="text-xs text-gray-500">做题数</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-500">{totalStats.totalMemorized}</div>
            <div className="text-xs text-gray-500">背诵数</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-500">{totalStats.totalPoints}</div>
            <div className="text-xs text-gray-500">总积分</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-500">{Math.round(totalStats.totalMinutes / 60)}</div>
            <div className="text-xs text-gray-500">学习小时</div>
          </div>
        </div>

        {/* 日历 */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setMonth(newDate.getMonth() - 1)
                setCurrentDate(newDate)
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
            </h2>
            <button
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setMonth(newDate.getMonth() + 1)
                setCurrentDate(newDate)
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              →
            </button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day} className="text-center text-sm text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* 日历格子 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dateStr = day.date.toISOString().split('T')[0]
              const record = getRecordForDate(day.date)
              const isToday = dateStr === today
              const isSelected = dateStr === selectedDate

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square p-2 rounded-lg cursor-pointer transition-all relative ${
                    !day.isCurrentMonth ? 'text-gray-300' :
                    isToday ? 'bg-orange-500 text-white ring-2 ring-orange-300' :
                    isSelected ? 'bg-orange-100 text-orange-700' :
                    record ? 'bg-green-50 hover:bg-green-100' :
                    'hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-sm ${isToday ? 'font-bold' : ''}`}>
                      {day.date.getDate()}
                    </div>
                    {record && (
                      <div className="flex justify-center gap-0.5 mt-1">
                        {record.questions > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" title="做题" />
                        )}
                        {record.memorized > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400" title="背诵" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 图例 */}
          <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500" /> 今天
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-100 border border-green-200" /> 有记录
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> 做题
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> 背诵
            </div>
          </div>
        </div>

        {/* 添加记录按钮 */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">记录今天的学习</h3>
              <p className="text-sm text-gray-500">点击按钮记录今天的学习情况</p>
            </div>
            <button onClick={addStudyRecord} className="btn-kite">
              + 记录学习
            </button>
          </div>
        </div>

        {/* 选中日期详情 */}
        {selectedDate && (
          <div className="card mb-6">
            <h3 className="font-bold text-gray-800 mb-4">
              {new Date(selectedDate).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
            </h3>
            {(() => {
              const record = records.find(r => r.date === selectedDate)
              if (record) {
                return (
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <div className="text-xl font-bold text-blue-500">{record.duration}</div>
                      <div className="text-xs text-gray-500">分钟</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <div className="text-xl font-bold text-green-500">{record.questions}</div>
                      <div className="text-xs text-gray-500">做题</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <div className="text-xl font-bold text-purple-500">{record.memorized}</div>
                      <div className="text-xs text-gray-500">背诵</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-xl">
                      <div className="text-xl font-bold text-yellow-500">{record.points}</div>
                      <div className="text-xs text-gray-500">积分</div>
                    </div>
                  </div>
                )
              }
              return <p className="text-gray-500">暂无学习记录</p>
            })()}
          </div>
        )}

        {/* 成就系统 */}
        {showAchievements && (
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4">🏆 成就系统</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl text-center transition-all ${
                    unlockedAchievements.has(achievement.id)
                      ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200'
                      : 'bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {unlockedAchievements.has(achievement.id) ? achievement.icon : '🔒'}
                  </div>
                  <div className="font-bold text-gray-800">{achievement.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{achievement.description}</div>
                  {unlockedAchievements.has(achievement.id) && (
                    <div className="mt-2 text-xs text-green-600">✓ 已解锁</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
