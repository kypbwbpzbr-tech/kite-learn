'use client'

import { useState, useEffect } from 'react'

// 风筝等级系统
const kiteLevels = [
  { level: 1, name: '小风筝', points: 0, emoji: '🪁', color: 'from-gray-400 to-gray-500', benefits: ['基础功能使用'] },
  { level: 2, name: '飞鸟风筝', points: 100, emoji: '🐦', color: 'from-blue-400 to-blue-500', benefits: ['解锁高级题库', '每日目标上限提升'] },
  { level: 3, name: '蝴蝶风筝', points: 300, emoji: '🦋', color: 'from-pink-400 to-pink-500', benefits: ['AI智能出题', '详细学习报告', '错题分析'] },
  { level: 4, name: '雄鹰风筝', points: 600, emoji: '🦅', color: 'from-amber-400 to-amber-500', benefits: ['专属学习路径', '知识点预测', 'VIP客服'] },
  { level: 5, name: '凤凰风筝', points: 1000, emoji: '🔥', color: 'from-red-400 to-red-500', benefits: ['全部功能解锁', '定制学习方案', '优先体验新功能'] },
]

// 积分获取方式
const pointSources = [
  { action: '完成每日练习', points: 10, icon: '📝', description: '每完成5道题获得10风筝币' },
  { action: '答对难题', points: 5, icon: '⭐', description: '答对进阶/挑战难度题目' },
  { action: '连续学习', points: 20, icon: '🔥', description: '连续7天完成每日目标' },
  { action: '复习错题', points: 15, icon: '📖', description: '复习并掌握错题' },
  { action: '完成章节', points: 50, icon: '🏆', description: '完成整个章节的学习' },
  { action: '知识图谱全通', points: 100, icon: '🗺️', description: '掌握一个年级的全部知识点' },
]

export default function PointsPage() {
  const [points, setPoints] = useState(0)
  const [history, setHistory] = useState<Array<{action: string, points: number, time: string}>>([])
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const savedPoints = parseInt(localStorage.getItem('kite-points') || '0')
    const savedHistory = JSON.parse(localStorage.getItem('points-history') || '[]')
    const savedStreak = parseInt(localStorage.getItem('learning-streak') || '0')

    setPoints(savedPoints)
    setHistory(savedHistory)
    setStreak(savedStreak)
  }, [])

  // 获取当前等级
  const getCurrentLevel = () => {
    for (let i = kiteLevels.length - 1; i >= 0; i--) {
      if (points >= kiteLevels[i].points) {
        return kiteLevels[i]
      }
    }
    return kiteLevels[0]
  }

  // 获取下一个等级
  const getNextLevel = () => {
    const current = getCurrentLevel()
    const currentIndex = kiteLevels.findIndex(l => l.level === current.level)
    return currentIndex < kiteLevels.length - 1 ? kiteLevels[currentIndex + 1] : null
  }

  const currentLevel = getCurrentLevel()
  const nextLevel = getNextLevel()
  const progressToNext = nextLevel ? ((points - currentLevel.points) / (nextLevel.points - currentLevel.points)) * 100 : 100

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🪁 风筝积分中心</h1>
          <p className="text-gray-600">学习越努力，风筝飞越高</p>
        </div>

        {/* 当前等级卡片 */}
        <div className="card bg-gradient-to-br from-orange-50 to-yellow-50 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 等级徽章 */}
            <div className="text-center">
              <div className="text-8xl mb-2 animate-float">{currentLevel.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-800">{currentLevel.name}</h2>
              <p className="text-gray-500">等级 {currentLevel.level}</p>
            </div>

            {/* 积分信息 */}
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-4xl font-bold text-orange-500">{points}</span>
                  <span className="text-gray-500 ml-2">风筝币</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">今日连续</div>
                  <div className="text-2xl font-bold text-orange-500">{streak} 天 🔥</div>
                </div>
              </div>

              {/* 进度条 */}
              {nextLevel && (
                <div>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>{currentLevel.name}</span>
                    <span>{nextLevel.name}</span>
                  </div>
                  <div className="progress-bar h-4">
                    <div className="progress-fill progress-kite" style={{ width: `${progressToNext}%` }} />
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-2">
                    还需 {nextLevel.points - points} 风筝币升级
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 等级体系 */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">🏅 等级体系</h2>
          <div className="grid grid-cols-5 gap-4">
            {kiteLevels.map((level) => (
              <div
                key={level.level}
                className={`text-center p-4 rounded-xl transition-all ${
                  currentLevel.level >= level.level
                    ? `bg-gradient-to-br ${level.color} text-white`
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <div className="text-4xl mb-2">{level.emoji}</div>
                <div className="font-bold">{level.name}</div>
                <div className="text-xs mt-1">{level.points} 风筝币</div>
              </div>
            ))}
          </div>
        </div>

        {/* 积分获取方式 */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">💰 如何获得风筝币</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {pointSources.map((source, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-3xl">{source.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{source.action}</div>
                  <div className="text-sm text-gray-500">{source.description}</div>
                </div>
                <div className="text-lg font-bold text-orange-500">+{source.points}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 当前等级权益 */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">✨ 当前等级权益</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {kiteLevels.slice(0, currentLevel.level).map((level) => (
              <div key={level.level} className="p-4 border border-orange-200 rounded-xl bg-orange-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{level.emoji}</span>
                  <span className="font-bold text-gray-800">{level.name}</span>
                </div>
                <ul className="space-y-1">
                  {level.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 积分历史 */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-6">📜 积分记录</h2>
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📝</div>
              <p>还没有积分记录</p>
              <p className="text-sm mt-2">开始学习就能获得风筝币！</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 10).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🪁</span>
                    <div>
                      <div className="font-medium text-gray-800">{item.action}</div>
                      <div className="text-xs text-gray-500">{item.time}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-500">+{item.points}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
