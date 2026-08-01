// GitHub Gist 数据同步模块
// 用户数据存储在 GitHub Gist 中，实现跨设备同步

import { getGistId, saveGistId } from './auth'
import { getRole, isStudent } from './role-service'

const SYNC_KEYS = [
  'user-name',
  'kite-points',
  'memorized-items',
  'mistakes',
  'favorites',
  'study-records',
  'daily-goals',
  'learning-calendar',
  'study-plan',
  'parent-goals',
  'user-role',
  'parent-child',
  'my-invite-code',
]

// 收集 localStorage 数据
function collectData(): Record<string, string | null> {
  const data: Record<string, string | null> = {}
  SYNC_KEYS.forEach((key) => {
    data[key] = localStorage.getItem(key)
  })
  return data
}

// 将数据写入 localStorage
function applyData(data: Record<string, string | null>) {
  SYNC_KEYS.forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      localStorage.setItem(key, data[key] as string)
    }
  })
}

// 从 Gist 加载数据
export async function loadUserData(accessToken: string): Promise<boolean> {
  try {
    const gistId = getGistId()
    const params = new URLSearchParams({ access_token: accessToken })
    if (gistId) params.set('gist_id', gistId)

    const res = await fetch(`/api/auth/github/gist?${params}`)
    const result = await res.json()

    if (result.content) {
      applyData(result.content)
    }
    if (result.gist_id) {
      saveGistId(result.gist_id)
    }

    return true
  } catch (error) {
    console.error('加载数据失败:', error)
    return false
  }
}

// 保存数据到 Gist
export async function saveUserData(accessToken: string): Promise<void> {
  try {
    const gistId = getGistId()
    const data = collectData()

    const res = await fetch('/api/auth/github/gist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: accessToken,
        gist_id: gistId,
        data,
      }),
    })

    const result = await res.json()
    if (result.gist_id) {
      saveGistId(result.gist_id)
    }
  } catch (error) {
    console.error('保存数据失败:', error)
  }
}

// 自动同步（防抖）
let syncTimer: ReturnType<typeof setTimeout> | null = null
let currentToken: string | null = null

export function startAutoSync(accessToken: string) {
  currentToken = accessToken

  window.addEventListener('storage', () => {
    if (!currentToken) return
    if (syncTimer) clearTimeout(syncTimer)
    syncTimer = setTimeout(() => {
      if (currentToken) saveUserData(currentToken)
    }, 3000)
  })
}

export function stopAutoSync() {
  currentToken = null
  if (syncTimer) {
    clearTimeout(syncTimer)
    syncTimer = null
  }
}
