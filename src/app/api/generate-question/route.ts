import { NextRequest, NextResponse } from 'next/server'

// AI 出题接口
// 支持接入多种 AI API（讯飞星火、MiniMax、OpenAI 等）

interface GenerateRequest {
  nodeId: string
  nodeName: string
  grade: string
  difficulty: number
  type: 'choice' | 'fill' | 'judge'
  count?: number
}

// 构建 prompt
function buildPrompt(data: GenerateRequest): string {
  const difficultyText = data.difficulty === 1 ? '简单' : data.difficulty === 2 ? '中等' : '困难'
  const typeText = data.type === 'choice' ? '选择题' : data.type === 'fill' ? '填空题' : '判断题'

  return `你是一位专业的数学教师，请为初中学生出一道${typeText}。

要求：
1. 知识点：${data.nodeName}
2. 年级：${data.grade}
3. 难度：${difficultyText}
4. 题目必须准确，答案必须正确

${data.type === 'choice' ? `请按以下格式返回：
{
  "content": "题目内容",
  "options": ["选项A", "选项B", "选项C", "选项D"],
  "answer": "正确选项",
  "explanation": "详细解析"
}` : data.type === 'fill' ? `请按以下格式返回：
{
  "content": "题目内容（用___表示空格）",
  "answer": "正确答案",
  "explanation": "详细解析"
}` : `请按以下格式返回：
{
  "content": "题目内容",
  "answer": "对"或"错",
  "explanation": "详细解析"
}`}

只返回JSON，不要其他内容。`
}

// 调用 AI API（示例：讯飞星火）
async function callXunfeiAPI(prompt: string): Promise<string> {
  // TODO: 替换为实际的 API 配置
  const apiKey = process.env.XUNFEI_API_KEY || ''
  const baseUrl = 'https://maas-coding-api.cn-huabei-1.xf-yun.com/anthropic'

  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'astron-code-latest',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  const data = await response.json()
  return data.content?.[0]?.text || ''
}

// 调用 AI API（示例：MiniMax）
async function callMiniMaxAPI(prompt: string): Promise<string> {
  // TODO: 替换为实际的 API 配置
  const apiKey = process.env.MINIMAX_API_KEY || ''
  const baseUrl = 'https://api.minimax.chat'

  const response = await fetch(`${baseUrl}/v1/text/chatcompletion_v2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'MiniMax-M2.7',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()

    // 验证请求参数
    if (!body.nodeId || !body.nodeName || !body.grade || !body.difficulty || !body.type) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    const prompt = buildPrompt(body)

    // 根据环境变量选择 API
    let result: string
    if (process.env.XUNFEI_API_KEY) {
      result = await callXunfeiAPI(prompt)
    } else if (process.env.MINIMAX_API_KEY) {
      result = await callMiniMaxAPI(prompt)
    } else {
      // 无 API Key 时返回模拟数据
      result = JSON.stringify({
        content: `这是一道关于${body.nodeName}的练习题（模拟数据，请配置AI API后获取真实题目）`,
        options: body.type === 'choice' ? ['选项A', '选项B', '选项C', '选项D'] : undefined,
        answer: body.type === 'choice' ? '选项A' : body.type === 'judge' ? '对' : '答案',
        explanation: '这是解析内容（模拟数据）',
      })
    }

    // 解析 AI 返回的 JSON
    let question
    try {
      // 尝试提取 JSON
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        question = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('无法解析AI返回内容')
      }
    } catch {
      return NextResponse.json(
        { error: 'AI返回格式错误', raw: result },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      question: {
        ...question,
        nodeId: body.nodeId,
        type: body.type,
        difficulty: body.difficulty,
      },
    })
  } catch (error) {
    console.error('生成题目失败:', error)
    return NextResponse.json(
      { error: '生成题目失败' },
      { status: 500 }
    )
  }
}
