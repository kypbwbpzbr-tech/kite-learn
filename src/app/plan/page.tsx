'use client'

import { useState, useEffect, useRef } from 'react'

// 计划表类型
interface PlanItem {
  id: string
  subject: string
  task: string
  duration: number
  completed: boolean
  date: string
}

// 学科颜色
const subjectColors: Record<string, string> = {
  '数学': 'bg-blue-100 text-blue-700 border-blue-200',
  '语文': 'bg-red-100 text-red-700 border-red-200',
  '英语': 'bg-green-100 text-green-700 border-green-200',
  '物理': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  '化学': 'bg-purple-100 text-purple-700 border-purple-200',
  '其他': 'bg-gray-100 text-gray-700 border-gray-200',
}

// 预设任务模板
const taskTemplates = [
  { subject: '数学', tasks: ['完成课本习题', '做练习册', '整理错题', '预习新课'] },
  { subject: '语文', tasks: ['背诵课文', '阅读理解', '作文练习', '字词听写'] },
  { subject: '英语', tasks: ['单词背诵', '语法练习', '阅读理解', '听力训练'] },
  { subject: '物理', tasks: ['完成实验报告', '做练习题', '复习概念', '预习新课'] },
]

export default function PlanPage() {
  const [plans, setPlans] = useState<PlanItem[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newPlan, setNewPlan] = useState({ subject: '数学', task: '', duration: 30 })
  const printRef = useRef<HTMLDivElement>(null)

  // 加载计划
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('study-plans') || '[]')
    setPlans(saved)
  }, [])

  // 保存计划
  const savePlans = (updated: PlanItem[]) => {
    setPlans(updated)
    localStorage.setItem('study-plans', JSON.stringify(updated))
  }

  // 添加计划
  const addPlan = () => {
    if (!newPlan.task.trim()) return

    const item: PlanItem = {
      id: Date.now().toString(),
      subject: newPlan.subject,
      task: newPlan.task,
      duration: newPlan.duration,
      completed: false,
      date: selectedDate,
    }

    savePlans([...plans, item])
    setShowAddModal(false)
    setNewPlan({ subject: '数学', task: '', duration: 30 })
  }

  // 删除计划
  const deletePlan = (id: string) => {
    if (confirm('确定要删除这个计划吗？')) {
      savePlans(plans.filter(p => p.id !== id))
    }
  }

  // 切换完成状态
  const toggleComplete = (id: string) => {
    const updated = plans.map(p =>
      p.id === id ? { ...p, completed: !p.completed } : p
    )
    savePlans(updated)

    // 如果完成任务，奖励积分
    const item = plans.find(p => p.id === id)
    if (item && !item.completed) {
      const points = parseInt(localStorage.getItem('kite-points') || '0')
      const newPoints = points + 5
      localStorage.setItem('kite-points', newPoints.toString())
      document.getElementById('nav-points')!.textContent = newPoints.toString()
    }
  }

  // 获取当天计划
  const getDayPlans = (date: string) => {
    return plans.filter(p => p.date === date)
  }

  // 获取一周日期
  const getWeekDates = () => {
    const dates = []
    const start = new Date(selectedDate)
    start.setDate(start.getDate() - start.getDay())

    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(date.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  // 计算统计
  const getStats = () => {
    const dayPlans = getDayPlans(selectedDate)
    const completed = dayPlans.filter(p => p.completed).length
    const total = dayPlans.length
    const totalMinutes = dayPlans.reduce((sum, p) => sum + p.duration, 0)
    const completedMinutes = dayPlans.filter(p => p.completed).reduce((sum, p) => sum + p.duration, 0)

    return { completed, total, totalMinutes, completedMinutes }
  }

  // 打印计划
  const handlePrint = () => {
    window.print()
  }

  // 导出PDF（使用浏览器打印功能）
  const handleExportPDF = () => {
    handlePrint()
  }

  const stats = getStats()
  const weekDates = getWeekDates()
  const weekDayNames = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="container-custom py-8" ref={printRef}>
      <div className="max-w-4xl mx-auto">
        {/* 页面标题（打印时显示） */}
        <div className="text-center mb-8 print:block hidden">
          <h1 className="text-3xl font-bold text-gray-800">🪁 风筝学堂学习计划</h1>
          <p className="text-gray-600 mt-2">{selectedDate}</p>
        </div>

        {/* 页面标题（网页显示） */}
        <div className="flex items-center justify-between mb-8 no-print">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📅 学习计划表</h1>
            <p className="text-gray-600 mt-2">制定计划，有条不紊地学习</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handlePrint} className="btn-outline">
              🖨️ 打印计划
            </button>
            <button onClick={handleExportPDF} className="btn-kite">
              📄 导出PDF
            </button>
          </div>
        </div>

        {/* 日期选择器 */}
        <div className="card mb-6 no-print">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const date = new Date(selectedDate)
                date.setDate(date.getDate() - 1)
                setSelectedDate(date.toISOString().split('T')[0])
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-kite flex-1"
            />
            <button
              onClick={() => {
                const date = new Date(selectedDate)
                date.setDate(date.getDate() + 1)
                setSelectedDate(date.toISOString().split('T')[0])
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              →
            </button>
          </div>

          {/* 周视图 */}
          <div className="flex justify-between mt-4">
            {weekDates.map((date, index) => {
              const isSelected = date === selectedDate
              const dayPlans = getDayPlans(date)
              const completedCount = dayPlans.filter(p => p.completed).length
              const d = new Date(date)

              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className={`text-sm ${isSelected ? 'text-orange-100' : 'text-gray-500'}`}>
                    {weekDayNames[d.getDay()]}
                  </span>
                  <span className="text-lg font-bold">{d.getDate()}</span>
                  {dayPlans.length > 0 && (
                    <div className={`w-2 h-2 rounded-full mt-1 ${
                      completedCount === dayPlans.length ? 'bg-green-400' : 'bg-orange-300'
                    }`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-3xl font-bold text-orange-500">{stats.completed}</div>
            <div className="text-sm text-gray-500">已完成</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-gray-400">{stats.total - stats.completed}</div>
            <div className="text-sm text-gray-500">待完成</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-500">{stats.totalMinutes}</div>
            <div className="text-sm text-gray-500">计划分钟</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-500">{stats.completedMinutes}</div>
            <div className="text-sm text-gray-500">已完成分钟</div>
          </div>
        </div>

        {/* 计划列表 */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {new Date(selectedDate).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })} 计划
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-kite no-print"
            >
              + 添加计划
            </button>
          </div>

          {getDayPlans(selectedDate).length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-4">📝</div>
              <p>今天还没有计划</p>
              <p className="text-sm mt-2">点击上方按钮添加学习计划</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getDayPlans(selectedDate).map((plan) => (
                <div
                  key={plan.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    plan.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={plan.completed}
                    onChange={() => toggleComplete(plan.id)}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400 no-print"
                  />
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${subjectColors[plan.subject] || subjectColors['其他']}`}>
                    {plan.subject}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${plan.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {plan.task}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{plan.duration}分钟</div>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors no-print"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 进度条 */}
          {getDayPlans(selectedDate).length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>完成进度</span>
                <span>{stats.completed}/{stats.total} ({Math.round((stats.completed / stats.total) * 100)}%)</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill progress-kite"
                  style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 快速添加模板 */}
        <div className="card mt-6 no-print">
          <h2 className="text-lg font-bold text-gray-800 mb-4">⚡ 快速添加</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {taskTemplates.map((template, tIndex) => (
              <div key={tIndex}>
                <div className={`text-sm font-medium mb-2 px-2 py-1 rounded ${subjectColors[template.subject]}`}>
                  {template.subject}
                </div>
                <div className="space-y-2">
                  {template.tasks.map((task, taskIndex) => (
                    <button
                      key={taskIndex}
                      onClick={() => {
                        setNewPlan({ subject: template.subject, task, duration: 30 })
                        setShowAddModal(true)
                      }}
                      className="w-full text-left text-sm p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {task}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 添加计划弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 no-print">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">添加学习计划</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">学科</label>
                <select
                  value={newPlan.subject}
                  onChange={(e) => setNewPlan({ ...newPlan, subject: e.target.value })}
                  className="input-kite"
                >
                  {Object.keys(subjectColors).map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">任务内容</label>
                <input
                  type="text"
                  value={newPlan.task}
                  onChange={(e) => setNewPlan({ ...newPlan, task: e.target.value })}
                  placeholder="例如：完成数学练习册第3页"
                  className="input-kite"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">预计时长（分钟）</label>
                <input
                  type="number"
                  value={newPlan.duration}
                  onChange={(e) => setNewPlan({ ...newPlan, duration: parseInt(e.target.value) || 30 })}
                  min="5"
                  max="180"
                  className="input-kite"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 btn-secondary"
              >
                取消
              </button>
              <button
                onClick={addPlan}
                disabled={!newPlan.task.trim()}
                className="flex-1 btn-kite disabled:opacity-50"
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
