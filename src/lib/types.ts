// ============================================
// 风筝学堂 - 类型定义
// ============================================

// GitHub 用户信息
export interface GitHubUser {
  id: number
  login: string
  name: string
  email: string
  avatar_url: string
  access_token: string
}

// 用户角色
export interface UserRole {
  role: 'student' | 'parent'
  parentId?: string    // 家长 ID（学生角色时为空）
  childId?: string     // 孩子 ID（家长角色时填写）
  inviteCode?: string  // 邀请码（学生生成）
}

// 家长-孩子绑定关系
export interface ParentChildBinding {
  parentId: string     // 家长 GitHub ID
  childId: string      // 孩子 GitHub ID
  inviteCode: string   // 绑定时的邀请码
  boundAt: number      // 绑定时间戳
}

// 家长设置的学习目标
export interface ParentGoal {
  id: string
  type: 'daily' | 'weekly'
  target: number       // 目标值
  unit: 'minutes' | 'questions' | 'days'
  subject?: string     // 科目（可选）
  active: boolean
  createdAt: number
}

// 学习记录（用于报告展示）
export interface StudyRecord {
  date: string         // YYYY-MM-DD
  duration: number     // 学习时长（分钟）
  questions: number    // 做题数
  correct: number      // 答对数
  memorized: number    // 背诵数
  points: number       // 获得风筝币
}

// 知识点掌握情况
export interface KnowledgeProgress {
  total: number        // 总知识点数
  mastered: number     // 已掌握数
  learning: number     // 学习中数
  notStarted: number   // 未开始数
}

// 孩子学习数据（用于家长端展示）
export interface ChildStudyData {
  userName: string
  grade: number
  kitePoints: number
  learningStreak: number
  studyRecords: StudyRecord[]
  knowledgeProgress: KnowledgeProgress
  mistakesCount: number
  masteredMemorized: number
  achievements: string[]
}

// 家长端统计概览
export interface ParentDashboard {
  today: {
    duration: number
    questions: number
    correctRate: number
  }
  thisWeek: {
    totalDuration: number
    totalQuestions: number
    avgCorrectRate: number
    studyDays: number
  }
  overall: {
    totalDuration: number
    totalQuestions: number
    knowledgeMastery: number
    streak: number
  }
}

// 邀请码存储
export interface InviteCodeStore {
  [code: string]: string  // code -> userId
}

// 家长设置的目标存储
export interface ParentGoalsStore {
  [childId: string]: ParentGoal[]
}
