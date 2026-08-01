// ============================================
// 风筝学堂 - 家长数据服务
// ============================================

import {
  ChildStudyData,
  ParentDashboard,
  ParentGoal,
  StudyRecord,
  KnowledgeProgress
} from './types'
import { getParentChildId } from './role-service'

const PARENT_GOALS_KEY = 'parent-goals'

// ============================================
// 获取孩子数据（从远程 Gist）
// ============================================

let cachedChildData: Record<string, any> | null = null
let lastFetchTime = 0
const CACHE_DURATION = 30 * 1000 // 30秒缓存

async function fetchChildData(): Promise<Record<string, any> | null> {
  const childId = getParentChildId()
  if (!childId) return null

  // 检查缓存
  if (cachedChildData && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedChildData
  }

  try {
    const response = await fetch(`/api/child/data?childId=${childId}`)
    if (!response.ok) return null

    const result = await response.json()
    cachedChildData = result.data
    lastFetchTime = Date.now()
    return result.data
  } catch (error) {
    console.error('获取孩子数据失败:', error)
    return null
  }
}

// 获取孩子今日数据
export async function getChildTodayData(): Promise<{
  duration: number
  questions: number
  correctRate: number
}> {
  const data = await fetchChildData()
  if (!data) {
    return { duration: 0, questions: 0, correctRate: 0 }
  }

  const records: StudyRecord[] = data['study-records'] || []
  const today = new Date().toISOString().split('T')[0]
  const todayRecord = records.find(r => r.date === today)

  if (!todayRecord) {
    return { duration: 0, questions: 0, correctRate: 0 }
  }

  return {
    duration: todayRecord.duration,
    questions: todayRecord.questions,
    correctRate: todayRecord.questions > 0
      ? Math.round((todayRecord.correct / todayRecord.questions) * 100)
      : 0
  }
}

// 获取孩子本周数据
export async function getChildWeekData(): Promise<{
  totalDuration: number
  totalQuestions: number
  avgCorrectRate: number
  studyDays: number
}> {
  const data = await fetchChildData()
  if (!data) {
    return { totalDuration: 0, totalQuestions: 0, avgCorrectRate: 0, studyDays: 0 }
  }

  const records: StudyRecord[] = data['study-records'] || []
  const today = new Date()
  const weekAgo = new Date(today)
  weekAgo.setDate(today.getDate() - 7)

  const weekRecords = records.filter(r => {
    const date = new Date(r.date)
    return date >= weekAgo && date <= today
  })

  const totalDuration = weekRecords.reduce((sum, r) => sum + r.duration, 0)
  const totalQuestions = weekRecords.reduce((sum, r) => sum + r.questions, 0)
  const totalCorrect = weekRecords.reduce((sum, r) => sum + r.correct, 0)
  const avgCorrectRate = totalQuestions > 0
    ? Math.round((totalCorrect / totalQuestions) * 100)
    : 0

  return {
    totalDuration,
    totalQuestions,
    avgCorrectRate,
    studyDays: weekRecords.length
  }
}

// 获取孩子总体数据
export async function getChildOverallData(): Promise<{
  totalDuration: number
  totalQuestions: number
  knowledgeMastery: number
  streak: number
}> {
  const data = await fetchChildData()
  if (!data) {
    return { totalDuration: 0, totalQuestions: 0, knowledgeMastery: 0, streak: 0 }
  }

  const records: StudyRecord[] = data['study-records'] || []
  const totalDuration = records.reduce((sum, r) => sum + r.duration, 0)
  const totalQuestions = records.reduce((sum, r) => sum + r.questions, 0)

  // 从知识点状态计算掌握率
  const knowledgeStatus: Record<string, string> = data['knowledge-status'] || {}
  const totalKnowledge = Object.keys(knowledgeStatus).length || 100
  const masteredKnowledge = Object.values(knowledgeStatus).filter(s => s === 'mastered').length
  const knowledgeMastery = totalKnowledge > 0
    ? Math.round((masteredKnowledge / totalKnowledge) * 100)
    : 0

  const streak = data['learning-streak'] || 0

  return {
    totalDuration,
    totalQuestions,
    knowledgeMastery,
    streak
  }
}

// 获取完整仪表盘数据
export async function getParentDashboard(): Promise<ParentDashboard> {
  const [today, thisWeek, overall] = await Promise.all([
    getChildTodayData(),
    getChildWeekData(),
    getChildOverallData()
  ])

  return { today, thisWeek, overall }
}

// ============================================
// 获取孩子的错题本
// ============================================

export interface MistakeRecord {
  id: string
  question: string
  subject: string
  difficulty: string
  userAnswer: string
  correctAnswer: string
  timestamp: number
  reviewCount: number
  mastered: boolean
}

export async function getChildMistakes(): Promise<MistakeRecord[]> {
  const data = await fetchChildData()
  if (!data) return []

  const mistakes = data['mistakes'] || []
  return Array.isArray(mistakes) ? mistakes : []
}

// 按科目筛选错题
export async function getMistakesBySubject(subject: string): Promise<MistakeRecord[]> {
  const mistakes = await getChildMistakes()
  if (subject === 'all') return mistakes
  return mistakes.filter(m => m.subject === subject)
}

// 按掌握状态筛选错题
export async function getMistakesByStatus(status: 'all' | 'pending' | 'mastered'): Promise<MistakeRecord[]> {
  const mistakes = await getChildMistakes()
  if (status === 'all') return mistakes
  if (status === 'mastered') return mistakes.filter(m => m.mastered)
  return mistakes.filter(m => !m.mastered)
}

// ============================================
// 知识点掌握情况
// ============================================

export async function getKnowledgeProgress(): Promise<KnowledgeProgress> {
  const data = await fetchChildData()
  if (!data) {
    return { total: 100, mastered: 0, learning: 0, notStarted: 100 }
  }

  const status: Record<string, string> = data['knowledge-status'] || {}
  const values = Object.values(status)

  const total = values.length || 100
  const mastered = values.filter(v => v === 'mastered').length
  const learning = values.filter(v => v === 'learning').length
  const notStarted = total - mastered - learning

  return { total, mastered, learning, notStarted }
}

// ============================================
// 获取孩子的学习记录
// ============================================

export async function getChildStudyRecords(): Promise<StudyRecord[]> {
  const data = await fetchChildData()
  if (!data) return []

  const records = data['study-records'] || []
  return Array.isArray(records) ? records : []
}

// ============================================
// 家长设置的目标
// ============================================

function getParentGoalsStore(): Record<string, ParentGoal[]> {
  try {
    const data = localStorage.getItem(PARENT_GOALS_KEY)
    if (!data) return {}
    return JSON.parse(data)
  } catch {
    return {}
  }
}

function saveParentGoalsStore(store: Record<string, ParentGoal[]>): void {
  localStorage.setItem(PARENT_GOALS_KEY, JSON.stringify(store))
}

// 获取家长为孩子设置的目标
export function getParentGoals(): ParentGoal[] {
  const childId = getParentChildId()
  if (!childId) return []

  const store = getParentGoalsStore()
  return store[childId] || []
}

// 添加目标
export function addParentGoal(goal: Omit<ParentGoal, 'id' | 'createdAt'>): ParentGoal {
  const childId = getParentChildId()
  if (!childId) throw new Error('未绑定孩子')

  const store = getParentGoalsStore()
  const childGoals = store[childId] || []

  const newGoal: ParentGoal = {
    ...goal,
    id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now()
  }

  childGoals.push(newGoal)
  store[childId] = childGoals
  saveParentGoalsStore(store)

  return newGoal
}

// 更新目标
export function updateParentGoal(goalId: string, updates: Partial<ParentGoal>): boolean {
  const childId = getParentChildId()
  if (!childId) return false

  const store = getParentGoalsStore()
  const childGoals = store[childId] || []

  const index = childGoals.findIndex(g => g.id === goalId)
  if (index === -1) return false

  childGoals[index] = { ...childGoals[index], ...updates }
  store[childId] = childGoals
  saveParentGoalsStore(store)

  return true
}

// 删除目标
export function deleteParentGoal(goalId: string): boolean {
  const childId = getParentChildId()
  if (!childId) return false

  const store = getParentGoalsStore()
  const childGoals = store[childId] || []

  const filtered = childGoals.filter(g => g.id !== goalId)
  if (filtered.length === childGoals.length) return false

  store[childId] = filtered
  saveParentGoalsStore(store)

  return true
}

// ============================================
// 格式化工具
// ============================================

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
}

export function formatCorrectRate(rate: number): string {
  return `${rate}%`
}
