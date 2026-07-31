// 数学知识图谱数据
// 按年级组织，每个知识点有前置依赖关系

export interface KnowledgeNode {
  id: string
  name: string
  grade: string
  subject: string
  chapter: string
  prerequisites: string[] // 前置知识点ID
  difficulty: 1 | 2 | 3 // 1-基础 2-进阶 3-挑战
  description: string
}

export interface Chapter {
  id: string
  name: string
  grade: string
  nodes: KnowledgeNode[]
}

// 小学数学知识图谱
export const elementaryMath: Chapter[] = [
  {
    id: 'g3-arith',
    name: '三年级-四则运算',
    grade: 'g3',
    nodes: [
      {
        id: 'g3-add-sub',
        name: '加减法',
        grade: 'g3',
        subject: 'math',
        chapter: 'g3-arith',
        prerequisites: [],
        difficulty: 1,
        description: '万以内加减法，包括进位和退位'
      },
      {
        id: 'g3-mul-div',
        name: '乘除法',
        grade: 'g3',
        subject: 'math',
        chapter: 'g3-arith',
        prerequisites: ['g3-add-sub'],
        difficulty: 1,
        description: '表内乘除法，多位数乘一位数'
      },
      {
        id: 'g3-mixed',
        name: '混合运算',
        grade: 'g3',
        subject: 'math',
        chapter: 'g3-arith',
        prerequisites: ['g3-add-sub', 'g3-mul-div'],
        difficulty: 2,
        description: '四则混合运算，运算顺序'
      },
    ]
  },
  {
    id: 'g3-fraction',
    name: '三年级-分数初步',
    grade: 'g3',
    nodes: [
      {
        id: 'g3-fraction-basic',
        name: '分数认识',
        grade: 'g3',
        subject: 'math',
        chapter: 'g3-fraction',
        prerequisites: [],
        difficulty: 1,
        description: '认识分数，理解分数的意义'
      },
      {
        id: 'g3-fraction-compare',
        name: '分数比较',
        grade: 'g3',
        subject: 'math',
        chapter: 'g3-fraction',
        prerequisites: ['g3-fraction-basic'],
        difficulty: 2,
        description: '同分母和异分母分数比较大小'
      },
    ]
  },
  {
    id: 'g4-geometry',
    name: '四年级-图形认识',
    grade: 'g4',
    nodes: [
      {
        id: 'g4-angle',
        name: '角的认识',
        grade: 'g4',
        subject: 'math',
        chapter: 'g4-geometry',
        prerequisites: [],
        difficulty: 1,
        description: '认识角，角的度量'
      },
      {
        id: 'g4-triangle',
        name: '三角形',
        grade: 'g4',
        subject: 'math',
        chapter: 'g4-geometry',
        prerequisites: ['g4-angle'],
        difficulty: 2,
        description: '三角形分类，三角形内角和'
      },
      {
        id: 'g4-quadrilateral',
        name: '四边形',
        grade: 'g4',
        subject: 'math',
        chapter: 'g4-geometry',
        prerequisites: ['g4-angle'],
        difficulty: 2,
        description: '平行四边形、梯形认识'
      },
    ]
  },
  {
    id: 'g5-equation',
    name: '五年级-方程入门',
    grade: 'g5',
    nodes: [
      {
        id: 'g5-variable',
        name: '用字母表示数',
        grade: 'g5',
        subject: 'math',
        chapter: 'g5-equation',
        prerequisites: ['g3-mixed'],
        difficulty: 1,
        description: '理解变量概念，用字母表示未知数'
      },
      {
        id: 'g5-simple-eq',
        name: '简易方程',
        grade: 'g5',
        subject: 'math',
        chapter: 'g5-equation',
        prerequisites: ['g5-variable'],
        difficulty: 2,
        description: '形如 x+a=b 的方程'
      },
      {
        id: 'g5-complex-eq',
        name: '复杂方程',
        grade: 'g5',
        subject: 'math',
        chapter: 'g5-equation',
        prerequisites: ['g5-simple-eq'],
        difficulty: 3,
        description: '形如 ax+b=c 的方程'
      },
    ]
  },
  {
    id: 'g6-ratio',
    name: '六年级-比和比例',
    grade: 'g6',
    nodes: [
      {
        id: 'g6-ratio-basic',
        name: '比的认识',
        grade: 'g6',
        subject: 'math',
        chapter: 'g6-ratio',
        prerequisites: ['g3-mul-div'],
        difficulty: 1,
        description: '比的意义，比的基本性质'
      },
      {
        id: 'g6-proportion',
        name: '比例',
        grade: 'g6',
        subject: 'math',
        chapter: 'g6-ratio',
        prerequisites: ['g6-ratio-basic'],
        difficulty: 2,
        description: '比例的意义和基本性质'
      },
      {
        id: 'g6-percent',
        name: '百分数',
        grade: 'g6',
        subject: 'math',
        chapter: 'g6-ratio',
        prerequisites: ['g6-ratio-basic'],
        difficulty: 2,
        description: '百分数的意义和计算'
      },
    ]
  },
]

// 初中数学知识图谱
export const middleMath: Chapter[] = [
  {
    id: 'g7-number',
    name: '七年级-有理数',
    grade: 'g7',
    nodes: [
      {
        id: 'g7-negative',
        name: '负数',
        grade: 'g7',
        subject: 'math',
        chapter: 'g7-number',
        prerequisites: ['g3-add-sub'],
        difficulty: 1,
        description: '负数的意义，有理数的概念'
      },
      {
        id: 'g7-number-line',
        name: '数轴',
        grade: 'g7',
        subject: 'math',
        chapter: 'g7-number',
        prerequisites: ['g7-negative'],
        difficulty: 1,
        description: '数轴的概念，相反数和绝对值'
      },
      {
        id: 'g7-calculation',
        name: '有理数运算',
        grade: 'g7',
        subject: 'math',
        chapter: 'g7-number',
        prerequisites: ['g7-number-line'],
        difficulty: 2,
        description: '有理数的加减乘除和乘方'
      },
    ]
  },
  {
    id: 'g7-algebra',
    name: '七年级-整式',
    grade: 'g7',
    nodes: [
      {
        id: 'g7-algebraic',
        name: '代数式',
        grade: 'g7',
        subject: 'math',
        chapter: 'g7-algebra',
        prerequisites: ['g5-variable'],
        difficulty: 1,
        description: '代数式的概念，列代数式'
      },
      {
        id: 'g7-polynomial',
        name: '整式',
        grade: 'g7',
        subject: 'math',
        chapter: 'g7-algebra',
        prerequisites: ['g7-algebraic'],
        difficulty: 2,
        description: '单项式和多项式'
      },
      {
        id: 'g7-factorization',
        name: '因式分解',
        grade: 'g7',
        subject: 'math',
        chapter: 'g7-algebra',
        prerequisites: ['g7-polynomial'],
        difficulty: 3,
        description: '提公因式法、公式法'
      },
    ]
  },
  {
    id: 'g8-function',
    name: '八年级-函数',
    grade: 'g8',
    nodes: [
      {
        id: 'g8-function-concept',
        name: '函数概念',
        grade: 'g8',
        subject: 'math',
        chapter: 'g8-function',
        prerequisites: ['g7-algebraic'],
        difficulty: 1,
        description: '函数的定义，自变量和因变量'
      },
      {
        id: 'g8-linear',
        name: '一次函数',
        grade: 'g8',
        subject: 'math',
        chapter: 'g8-function',
        prerequisites: ['g8-function-concept'],
        difficulty: 2,
        description: 'y=kx+b 的图像和性质'
      },
      {
        id: 'g8-quadratic-intro',
        name: '二次函数入门',
        grade: 'g8',
        subject: 'math',
        chapter: 'g8-function',
        prerequisites: ['g8-linear'],
        difficulty: 3,
        description: 'y=ax² 的图像和性质'
      },
    ]
  },
  {
    id: 'g9-quadratic',
    name: '九年级-二次函数',
    grade: 'g9',
    nodes: [
      {
        id: 'g9-quadratic',
        name: '二次函数',
        grade: 'g9',
        subject: 'math',
        chapter: 'g9-quadratic',
        prerequisites: ['g8-quadratic-intro'],
        difficulty: 2,
        description: 'y=ax²+bx+c 的图像和性质'
      },
      {
        id: 'g9-quadratic-eq',
        name: '一元二次方程',
        grade: 'g9',
        subject: 'math',
        chapter: 'g9-quadratic',
        prerequisites: ['g9-quadratic'],
        difficulty: 3,
        description: '求根公式，判别式'
      },
      {
        id: 'g9-quadratic-app',
        name: '二次函数应用',
        grade: 'g9',
        subject: 'math',
        chapter: 'g9-quadratic',
        prerequisites: ['g9-quadratic', 'g9-quadratic-eq'],
        difficulty: 3,
        description: '最值问题，实际应用'
      },
    ]
  },
]

// 获取所有知识节点
export function getAllNodes(): KnowledgeNode[] {
  return [...elementaryMath, ...middleMath].flatMap(chapter => chapter.nodes)
}

// 根据年级获取章节
export function getChaptersByGrade(grade: string): Chapter[] {
  const allChapters = [...elementaryMath, ...middleMath]
  return allChapters.filter(chapter => chapter.grade === grade)
}

// 根据ID获取节点
export function getNodeById(id: string): KnowledgeNode | undefined {
  return getAllNodes().find(node => node.id === id)
}

// 获取节点的后续知识点（依赖当前节点的）
export function getDependents(nodeId: string): KnowledgeNode[] {
  return getAllNodes().filter(node => node.prerequisites.includes(nodeId))
}

// 获取所有年级
export function getAllGrades(): string[] {
  return ['g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9']
}

// 年级名称映射
export const gradeNames: Record<string, string> = {
  'g3': '三年级',
  'g4': '四年级',
  'g5': '五年级',
  'g6': '六年级',
  'g7': '七年级',
  'g8': '八年级',
  'g9': '九年级',
}

// 难度名称映射
export const difficultyNames: Record<number, string> = {
  1: '基础',
  2: '进阶',
  3: '挑战',
}
