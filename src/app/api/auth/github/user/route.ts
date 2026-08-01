import { NextRequest, NextResponse } from 'next/server'

// 通过 access_token 获取 GitHub 用户信息
export async function POST(request: NextRequest) {
  const { access_token } = await request.json()

  if (!access_token) {
    return NextResponse.json({ error: 'Missing access_token' }, { status: 400 })
  }

  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'User-Agent': 'kite-learn',
      },
    })

    const data = await res.json()

    if (data.message) {
      return NextResponse.json({ error: data.message }, { status: 401 })
    }

    return NextResponse.json({
      id: data.id,
      login: data.login,
      name: data.name || data.login,
      email: data.email || `${data.login}@github`,
      avatar_url: data.avatar_url,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}
