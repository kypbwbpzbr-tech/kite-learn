// GitHub 登录 + Gist 数据同步
// 用户数据通过 GitHub Gist 实现跨设备同步

export interface GitHubUser {
  id: number
  login: string
  name: string
  email: string
  avatar_url: string
  access_token: string
}

const SESSION_KEY = 'kite-session'
const GIST_ID_KEY = 'kite-gist-id'

// GitHub OAuth 配置
const GITHUB_CLIENT_ID = 'Ov23li0V9qq2pQ0bRV7s'

// 跳转到 GitHub 授权页面
export function redirectToGitHub() {
  const redirectUri = `${window.location.origin}/api/auth/github/callback`
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=gist`
  window.location.href = url
}

// 从 URL hash 中提取登录信息（OAuth 回调后）
export function extractUserFromHash(): GitHubUser | null {
  if (typeof window === 'undefined') return null

  const hash = window.location.hash
  if (!hash.startsWith('#auth=')) return null

  try {
    const encoded = hash.slice(6)
    const user = JSON.parse(decodeURIComponent(encoded)) as GitHubUser
    // 清除 hash
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
    return user
  } catch {
    return null
  }
}

// 保存/读取 session
export function saveSession(user: GitHubUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function getSession(): GitHubUser | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(SESSION_KEY)
  return data ? JSON.parse(data) : null
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(GIST_ID_KEY)
}

// 获取当前用户
export function getCurrentUser(): GitHubUser | null {
  return getSession()
}

// 保存 gist_id
export function saveGistId(gistId: string) {
  localStorage.setItem(GIST_ID_KEY, gistId)
}

export function getGistId(): string | null {
  return localStorage.getItem(GIST_ID_KEY)
}
