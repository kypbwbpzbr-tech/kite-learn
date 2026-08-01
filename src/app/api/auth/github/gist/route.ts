import { NextRequest, NextResponse } from 'next/server'

// 从用户的 Gist 加载风筝学堂数据
export async function GET(request: NextRequest) {
  const access_token = request.nextUrl.searchParams.get('access_token')
  const gist_id = request.nextUrl.searchParams.get('gist_id')

  if (!access_token) {
    return NextResponse.json({ error: 'Missing access_token' }, { status: 400 })
  }

  try {
    if (gist_id) {
      // 读取指定 Gist
      const res = await fetch(`https://api.github.com/gists/${gist_id}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'User-Agent': 'kite-learn',
        },
      })
      const gist = await res.json()
      const file = gist.files?.['kite-learn-data.json']
      return NextResponse.json({
        content: file ? JSON.parse(file.content) : null,
        gist_id: gist.id,
      })
    } else {
      // 查找已有的 Gist
      const res = await fetch('https://api.github.com/gists?per_page=100', {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'User-Agent': 'kite-learn',
        },
      })
      const gists = await res.json()
      const existing = gists.find((g: any) =>
        g.files?.['kite-learn-data.json']?.description === 'kite-learn-sync'
      )

      if (existing) {
        const file = existing.files['kite-learn-data.json']
        return NextResponse.json({
          content: JSON.parse(file.content),
          gist_id: existing.id,
        })
      }

      return NextResponse.json({ content: null, gist_id: null })
    }
  } catch {
    return NextResponse.json({ error: 'Failed to access gist' }, { status: 500 })
  }
}

// 保存数据到用户的 Gist
export async function POST(request: NextRequest) {
  const { access_token, gist_id, data } = await request.json()

  if (!access_token) {
    return NextResponse.json({ error: 'Missing access_token' }, { status: 400 })
  }

  try {
    const body = {
      description: 'kite-learn-sync',
      files: {
        'kite-learn-data.json': {
          content: JSON.stringify(data, null, 2),
        },
      },
    }

    if (gist_id) {
      // 更新已有 Gist
      const res = await fetch(`https://api.github.com/gists/${gist_id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'kite-learn',
        },
        body: JSON.stringify(body),
      })
      const gist = await res.json()
      return NextResponse.json({ gist_id: gist.id, success: true })
    } else {
      // 创建新 Gist
      const res = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'kite-learn',
        },
        body: JSON.stringify(body),
      })
      const gist = await res.json()
      return NextResponse.json({ gist_id: gist.id, success: true })
    }
  } catch {
    return NextResponse.json({ error: 'Failed to save gist' }, { status: 500 })
  }
}
