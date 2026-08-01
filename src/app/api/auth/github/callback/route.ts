import { NextRequest, NextResponse } from 'next/server'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'Ov23li0V9qq2pQ0bRV7s'
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '3a8a3903996bedce7b24a68a1606e4bf7818d9d3'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url))
  }

  try {
    // 用 code 换取 access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      return NextResponse.redirect(new URL(`/login?error=${tokenData.error}`, request.url))
    }

    // 获取用户信息
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'User-Agent': 'kite-learn',
      },
    })

    const userData = await userRes.json()

    // 构建用户信息，写入 URL hash 供前端读取
    const user = {
      id: userData.id,
      login: userData.login,
      name: userData.name || userData.login,
      email: userData.email || `${userData.login}@github`,
      avatar_url: userData.avatar_url,
      access_token: tokenData.access_token,
    }

    // 将用户信息编码到 URL 中，前端从 hash 读取
    const encoded = encodeURIComponent(JSON.stringify(user))
    const redirectUrl = new URL(`/#auth=${encoded}`, request.url)

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    return NextResponse.redirect(new URL('/login?error=server_error', request.url))
  }
}
