// ============================================
// 风筝学堂 - 角色服务
// ============================================

import { UserRole, ParentChildBinding } from './types'

const ROLE_KEY = 'user-role'
const BINDING_KEY = 'parent-child'

// ============================================
// 角色管理
// ============================================

export function getRole(): UserRole | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(ROLE_KEY)
  return data ? JSON.parse(data) : null
}

export function setRole(role: UserRole): void {
  localStorage.setItem(ROLE_KEY, JSON.stringify(role))
}

export function isStudent(): boolean {
  const role = getRole()
  return role?.role === 'student' || role === null
}

export function isParent(): boolean {
  const role = getRole()
  return role?.role === 'parent'
}

export function getChildId(): string | null {
  const role = getRole()
  return role?.childId || null
}

// ============================================
// 邀请码管理（使用 GitHub Gist 存储）
// ============================================

// 生成 6 位邀请码（包含用户ID）
function generateCode(userId: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  // 前2位随机字母
  const prefix = chars.charAt(Math.floor(Math.random() * chars.length)) +
                 chars.charAt(Math.floor(Math.random() * chars.length))
  // 后4位是用户ID（补齐4位）
  const suffix = userId.toString().padStart(4, '0').slice(-4)
  return prefix + suffix
}

// 为学生生成邀请码
export function generateInviteCode(userId: string): string {
  const existingCode = getStudentInviteCode(userId)
  if (existingCode) {
    return existingCode
  }

  const code = generateCode(parseInt(userId))

  // 存储到 localStorage
  localStorage.setItem('my-invite-code', code)

  // 更新用户角色
  setRole({
    role: 'student',
    inviteCode: code
  })

  return code
}

// 获取学生的邀请码
export function getStudentInviteCode(userId: string): string | null {
  return localStorage.getItem('my-invite-code')
}

// 验证邀请码（通过 API 查询）
export async function verifyInviteCode(code: string): Promise<{ valid: boolean; childId?: string; childName?: string }> {
  try {
    const response = await fetch('/api/invite/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.toUpperCase() })
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('验证邀请码失败:', error)
    return { valid: false }
  }
}

// ============================================
// 家长-孩子绑定
// ============================================

// 获取绑定关系
export function getBinding(): ParentChildBinding | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(BINDING_KEY)
  return data ? JSON.parse(data) : null
}

// 保存绑定关系
export function saveBinding(binding: ParentChildBinding): void {
  localStorage.setItem(BINDING_KEY, JSON.stringify(binding))
}

// 家长绑定孩子
export async function bindParentToChild(parentId: string, inviteCode: string): Promise<{ success: boolean; childName?: string }> {
  // 直接调用 API 验证
  const result = await verifyInviteCode(inviteCode)

  if (!result.valid || !result.childId) {
    return { success: false }
  }

  // 保存绑定关系
  const binding: ParentChildBinding = {
    parentId,
    childId: result.childId,
    inviteCode: inviteCode.toUpperCase(),
    boundAt: Date.now()
  }
  saveBinding(binding)

  // 更新家长角色
  setRole({
    role: 'parent',
    parentId,
    childId: result.childId,
    inviteCode: inviteCode.toUpperCase()
  })

  return { success: true, childName: result.childName }
}

// 检查家长是否已绑定孩子
export function isParentBound(): boolean {
  const role = getRole()
  return role?.role === 'parent' && !!role?.childId
}

// 获取孩子 ID（家长端使用）
export function getParentChildId(): string | null {
  const role = getRole()
  if (role?.role === 'parent' && role.childId) {
    return role.childId
  }
  const binding = getBinding()
  return binding?.childId || null
}

// ============================================
// 初始化
// ============================================

// 初始化学生角色（登录时调用）
export function initStudentRole(userId: string): void {
  const existingRole = getRole()
  if (!existingRole) {
    const code = getStudentInviteCode(userId)
    setRole({
      role: 'student',
      inviteCode: code || undefined
    })
  }
}

// 清除角色信息
export function clearRole(): void {
  localStorage.removeItem(ROLE_KEY)
  localStorage.removeItem(BINDING_KEY)
}
