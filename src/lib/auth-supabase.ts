// Supabase 邮箱密码登录
import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name?: string
}

// 注册
export async function signUp(email: string, password: string, name?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  })
  return { user: data.user, error }
}

// 登录
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { user: data.user, error }
}

// 登出
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// 获取当前用户
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 监听登录状态变化
export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
}
