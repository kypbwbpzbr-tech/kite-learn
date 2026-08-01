'use client'

import { useAuth } from '@/lib/auth-context'
import { getParentDashboard, formatDuration, getKnowledgeProgress, getChildMistakes } from '@/lib/parent-service'
import { isParentBound } from '@/lib/role-service'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ParentDashboard, KnowledgeProgress } from '@/lib/types'

export default function ParentHomePage() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState<ParentDashboard | null>(null)
  const [knowledgeProgress, setKnowledgeProgress] = useState<KnowledgeProgress | null>(null)
  const [mistakesCount, setMistakesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isParentBound()) {
      setLoading(false)
      return
    }

    const loadData = async () => {
      try {
        const [dash, progress, mistakes] = await Promise.all([
          getParentDashboard(),
          getKnowledgeProgress(),
          getChildMistakes()
        ])
        setDashboard(dash)
        setKnowledgeProgress(progress)
        setMistakesCount(mistakes.length)
      } catch (error) {
        console.error('加载数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    // 每30秒刷新一次数据
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  // 未绑定孩子
  if (!isParentBound()) {
    return (
      <div className="py-6 space-y-6">
        <div className="card p-6 bg-gradient-to-r from-orange-50 to-amber-50">
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            👋 欢迎使用家长端
          </h1>
          <p className="text-gray-600">
            请先绑定孩子的账号
          </p>
        </div>

        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">👨‍👩‍👧</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">绑定孩子</h2>
          <p className="text-gray-500 mb-6">
            输入孩子提供的邀请码，即可查看学习情况
          </p>
          <Link
            href="/parent/bind"
            className="inline-block px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-400 text-white font-semibold rounded-xl hover:from-orange-500 hover:to-amber-500 transition-all"
          >
            绑定孩子
          </Link>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-gray-800 mb-3">📖 如何获取邀请码</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <span className="text-orange-500 font-bold">1.</span>
              <span>让学生登录风筝学堂</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-orange-500 font-bold">2.</span>
              <span>进入「我的」页面</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-orange-500 font-bold">3.</span>
              <span>点击「邀请家长」生成邀请码</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-orange-500 font-bold">4.</span>
              <span>将邀请码告诉您</span>
            </div>
          </div>
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
  if (!dashboard || (dashboard.today.duration === 0 && dashboard.today.questions === 0 && dashboard.thisWeek.totalDuration === 0)) {
    return (
      <div className="py-6 space-y-6">
        <div className="card p-6 bg-gradient-to-r from-orange-50 to-amber-50">
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            👋 您好，{user?.name || '家长'}
          </h1>
          <p className="text-gray-600">
            孩子还没有学习数据
          </p>
        </div>

        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">暂无学习数据</h2>
          <p className="text-gray-500">
            孩子登录并学习后，这里会显示学习情况
          </p>
        </div>
      </div>
    )
  }

  // 获取问候语
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 6) return '夜深了，早点休息'
    if (hour < 9) return '早上好'
    if (hour < 12) return '上午好'
    if (hour < 14) return '中午好'
    if (hour < 18) return '下午好'
    return '晚上好'
  }

  return (
    <div className="py-6 space-y-6">
      {/* 欢迎卡片 */}
      <div className="card p-6 bg-gradient-to-r from-orange-50 to-amber-50">
        <h1 className="text-xl font-bold text-gray-800 mb-1">
          {getGreeting()}，{user?.name?.split(' ')[0] || '家长'}
        </h1>
        <p className="text-gray-600">
          这是您孩子今天的学习情况 👇
        </p>
      </div>

      {/* 今日学习概览 */}
      <div className="card p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">📊</span>
          今日学习概览
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-orange-50 rounded-2xl">
            <div className="text-3xl font-bold text-orange-500 mb-1">
              {dashboard.today.duration}
            </div>
            <div className="text-sm text-gray-500">学习分钟</div>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-2xl">
            <div className="text-3xl font-bold text-blue-500 mb-1">
              {dashboard.today.questions}
            </div>
            <div className="text-sm text-gray-500">做题数</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-2xl">
            <div className="text-3xl font-bold text-green-500 mb-1">
              {dashboard.today.correctRate}%
            </div>
            <div className="text-sm text-gray-500">正确率</div>
          </div>
        </div>
      </div>

      {/* 本周数据 */}
      <div className="card p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">📈</span>
          本周学习数据
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-600">学习时长</span>
            <span className="font-semibold text-gray-800">
              {formatDuration(dashboard.thisWeek.totalDuration)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-600">做题总数</span>
            <span className="font-semibold text-gray-800">
              {dashboard.thisWeek.totalQuestions} 题
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-600">平均正确率</span>
            <span className="font-semibold text-gray-800">
              {dashboard.thisWeek.avgCorrectRate}%
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-600">学习天数</span>
            <span className="font-semibold text-gray-800">
              {dashboard.thisWeek.studyDays} 天
            </span>
          </div>
        </div>
      </div>

      {/* 学习状态 */}
      <div className="card p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">🔥</span>
          学习状态
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-amber-50 rounded-2xl">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-amber-500">
              {dashboard.overall.streak}
            </div>
            <div className="text-sm text-gray-500">连续学习天数</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-2xl">
            <div className="text-4xl mb-2">🧩</div>
            <div className="text-2xl font-bold text-purple-500">
              {knowledgeProgress?.mastered || 0}
            </div>
            <div className="text-sm text-gray-500">已掌握知识点</div>
          </div>
        </div>

        {/* 知识点掌握进度 */}
        {knowledgeProgress && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>知识点掌握</span>
              <span>{knowledgeProgress.mastered}/{knowledgeProgress.total}</span>
            </div>
            <div className="progress-bar h-3">
              <div
                className="progress-fill bg-gradient-to-r from-orange-400 to-amber-400"
                style={{ width: `${(knowledgeProgress.mastered / knowledgeProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 快捷入口 */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/parent/report"
          className="card p-5 text-center hover:scale-[1.02] transition-transform"
        >
          <div className="text-4xl mb-2">📊</div>
          <div className="font-semibold text-gray-800">详细报告</div>
          <div className="text-sm text-gray-500">查看学习趋势分析</div>
        </Link>

        <Link
          href="/parent/mistakes"
          className="card p-5 text-center hover:scale-[1.02] transition-transform"
        >
          <div className="text-4xl mb-2">❌</div>
          <div className="font-semibold text-gray-800">错题本</div>
          <div className="text-sm text-gray-500">已收录 {mistakesCount} 道错题</div>
        </Link>
      </div>

      <Link
        href="/parent/goals"
        className="card p-5 text-center hover:scale-[1.02] transition-transform block"
      >
        <div className="text-4xl mb-2">🎯</div>
        <div className="font-semibold text-gray-800">设置学习目标</div>
        <div className="text-sm text-gray-500">为孩子制定每日/每周目标</div>
      </Link>
    </div>
  )
}
