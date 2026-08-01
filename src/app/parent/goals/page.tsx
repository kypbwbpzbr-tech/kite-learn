'use client'

import { useState, useEffect } from 'react'
import {
  getParentGoals,
  addParentGoal,
  updateParentGoal,
  deleteParentGoal
} from '@/lib/parent-service'
import { isParentBound } from '@/lib/role-service'
import { ParentGoal } from '@/lib/types'
import Link from 'next/link'

export default function ParentGoalsPage() {
  const [goals, setGoals] = useState<ParentGoal[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const [newGoal, setNewGoal] = useState({
    type: 'daily' as 'daily' | 'weekly',
    target: 30,
    unit: 'minutes' as 'minutes' | 'questions' | 'days',
  })

  useEffect(() => {
    if (!isParentBound()) {
      setLoading(false)
      return
    }
    loadGoals()
    setLoading(false)
  }, [])

  const loadGoals = () => {
    setGoals(getParentGoals())
  }

  const handleAddGoal = () => {
    try {
      addParentGoal({ ...newGoal, active: true })
      loadGoals()
      setShowAddModal(false)
      setNewGoal({ type: 'daily', target: 30, unit: 'minutes' })
    } catch (error) {
      console.error('添加目标失败:', error)
    }
  }

  const toggleGoal = (goalId: string, active: boolean) => {
    updateParentGoal(goalId, { active })
    loadGoals()
  }

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('确定删除这个目标吗？')) {
      deleteParentGoal(goalId)
      loadGoals()
    }
  }

  const getUnitLabel = (unit: string) => {
    switch (unit) {
      case 'minutes': return '分钟'
      case 'questions': return '题'
      case 'days': return '天'
      default: return unit
    }
  }

  const getTypeLabel = (type: string) => {
    return type === 'daily' ? '每日目标' : '每周目标'
  }

  // 未绑定
  if (!isParentBound()) {
    return (
      <div className="py-6 space-y-6">
        <div className="card p-5">
          <h1 className="text-xl font-bold text-gray-800 mb-1">🎯 学习目标</h1>
          <p className="text-gray-600 text-sm">为孩子设置学习目标</p>
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

  return (
    <div className="py-6 space-y-6">
      <div className="card p-5">
        <h1 className="text-xl font-bold text-gray-800 mb-1">🎯 学习目标</h1>
        <p className="text-gray-600 text-sm">为孩子设置学习目标</p>
      </div>

      {/* 添加目标按钮 */}
      <button
        onClick={() => setShowAddModal(true)}
        className="w-full card p-4 text-center text-orange-500 hover:scale-[1.01] transition-transform"
      >
        <span className="text-2xl">➕</span>
        <div className="font-medium mt-1">添加新目标</div>
      </button>

      {/* 目标列表 */}
      <div className="space-y-3">
        {goals.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-4xl mb-2">📋</div>
            <div className="text-gray-600">还没有设置目标</div>
            <div className="text-sm text-gray-500 mt-1">点击上方按钮添加第一个目标</div>
          </div>
        ) : (
          goals.map((goal) => (
            <div
              key={goal.id}
              className={`card p-4 ${!goal.active ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {goal.type === 'daily' ? '📅' : '📆'}
                  </span>
                  <div>
                    <div className="font-medium text-gray-800">
                      {getTypeLabel(goal.type)}
                    </div>
                    <div className="text-sm text-gray-500">
                      每{goal.type === 'daily' ? '日' : '周'} {goal.target} {getUnitLabel(goal.unit)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleGoal(goal.id, !goal.active)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      goal.active ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        goal.active ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 目标建议 */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-800 mb-3">💡 目标建议</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <span className="text-orange-500">•</span>
            <span>小学生建议每天学习 <strong>30-60分钟</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500">•</span>
            <span>中学生建议每天学习 <strong>60-120分钟</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500">•</span>
            <span>建议每天做 <strong>10-20题</strong> 练习</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500">•</span>
            <span>建议每周至少学习 <strong>5天</strong></span>
          </div>
        </div>
      </div>

      {/* 添加目标弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm animate-scale">
            <h3 className="text-lg font-bold text-gray-800 mb-4">添加新目标</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标类型</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewGoal({ ...newGoal, type: 'daily' })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      newGoal.type === 'daily'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    每日目标
                  </button>
                  <button
                    onClick={() => setNewGoal({ ...newGoal, type: 'weekly' })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      newGoal.type === 'weekly'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    每周目标
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标单位</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewGoal({ ...newGoal, unit: 'minutes' })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      newGoal.unit === 'minutes'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    学习时长
                  </button>
                  <button
                    onClick={() => setNewGoal({ ...newGoal, unit: 'questions' })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      newGoal.unit === 'questions'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    做题数量
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标值</label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 0 })}
                  className="input w-full"
                  min="1"
                  max="999"
                />
                <div className="text-xs text-gray-500 mt-1">
                  每{newGoal.type === 'daily' ? '日' : '每周'} {newGoal.target} {getUnitLabel(newGoal.unit)}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium"
              >
                取消
              </button>
              <button
                onClick={handleAddGoal}
                className="flex-1 py-2 rounded-lg btn-primary text-white font-medium"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
