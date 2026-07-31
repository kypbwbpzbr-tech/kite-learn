// 必背内容数据
// 按年级组织，包含数学公式（LaTeX格式）和需要背诵的内容

export interface MemorizeItem {
  id: string
  title: string
  category: 'formula' | 'definition' | 'theorem' | 'vocabulary'
  content: string
  formula?: string // LaTeX公式
  grade: string
  subject: string
  difficulty: 1 | 2 | 3
  points: number // 背诵奖励积分
}

export interface GradeContent {
  grade: string
  gradeName: string
  items: MemorizeItem[]
}

// 三年级必背内容
const grade3Content: MemorizeItem[] = [
  // 数学公式
  {
    id: 'g3-formula-1',
    title: '加法交换律',
    category: 'formula',
    content: '两个数相加，交换加数的位置，和不变',
    formula: 'a + b = b + a',
    grade: 'g3',
    subject: 'math',
    difficulty: 1,
    points: 5,
  },
  {
    id: 'g3-formula-2',
    title: '加法结合律',
    category: 'formula',
    content: '三个数相加，先把前两个数相加，或者先把后两个数相加，和不变',
    formula: '(a + b) + c = a + (b + c)',
    grade: 'g3',
    subject: 'math',
    difficulty: 1,
    points: 5,
  },
  {
    id: 'g3-formula-3',
    title: '乘法交换律',
    category: 'formula',
    content: '两个数相乘，交换因数的位置，积不变',
    formula: 'a \\times b = b \\times a',
    grade: 'g3',
    subject: 'math',
    difficulty: 1,
    points: 5,
  },
  {
    id: 'g3-formula-4',
    title: '乘法结合律',
    category: 'formula',
    content: '三个数相乘，先把前两个数相乘，或者先把后两个数相乘，积不变',
    formula: '(a \\times b) \\times c = a \\times (b \\times c)',
    grade: 'g3',
    subject: 'math',
    difficulty: 1,
    points: 5,
  },
  {
    id: 'g3-formula-5',
    title: '乘法分配律',
    category: 'formula',
    content: '两个数的和与一个数相乘，可以先把它们与这个数分别相乘，再相加',
    formula: '(a + b) \\times c = a \\times c + b \\times c',
    grade: 'g3',
    subject: 'math',
    difficulty: 2,
    points: 10,
  },
  {
    id: 'g3-definition-1',
    title: '分数的意义',
    category: 'definition',
    content: '把一个整体平均分成若干份，表示这样的一份或几份的数叫做分数',
    grade: 'g3',
    subject: 'math',
    difficulty: 1,
    points: 5,
  },
  {
    id: 'g3-definition-2',
    title: '分数各部分名称',
    category: 'definition',
    content: '分数中间的横线叫做分数线，分数线上面的数叫做分子，分数线下面的数叫做分母',
    grade: 'g3',
    subject: 'math',
    difficulty: 1,
    points: 5,
  },
]

// 七年级必背内容
const grade7Content: MemorizeItem[] = [
  // 有理数
  {
    id: 'g7-formula-1',
    title: '有理数加法法则',
    category: 'theorem',
    content: '同号两数相加，取相同的符号，并把绝对值相加；异号两数相加，取绝对值较大的加数的符号，并用较大的绝对值减去较小的绝对值',
    grade: 'g7',
    subject: 'math',
    difficulty: 1,
    points: 10,
  },
  {
    id: 'g7-formula-2',
    title: '有理数减法法则',
    category: 'theorem',
    content: '减去一个数，等于加上这个数的相反数',
    formula: 'a - b = a + (-b)',
    grade: 'g7',
    subject: 'math',
    difficulty: 1,
    points: 10,
  },
  {
    id: 'g7-formula-3',
    title: '有理数乘法法则',
    category: 'theorem',
    content: '两数相乘，同号得正，异号得负，并把绝对值相乘',
    grade: 'g7',
    subject: 'math',
    difficulty: 1,
    points: 10,
  },
  {
    id: 'g7-formula-4',
    title: '有理数除法法则',
    category: 'theorem',
    content: '除以一个不等于0的数，等于乘以这个数的倒数',
    formula: 'a \\div b = a \\times \\frac{1}{b} \\quad (b \\neq 0)',
    grade: 'g7',
    subject: 'math',
    difficulty: 1,
    points: 10,
  },
  {
    id: 'g7-formula-5',
    title: '平方差公式',
    category: 'formula',
    content: '两个数的和与这两个数的差的积，等于这两个数的平方差',
    formula: '(a+b)(a-b) = a^2 - b^2',
    grade: 'g7',
    subject: 'math',
    difficulty: 2,
    points: 15,
  },
  {
    id: 'g7-formula-6',
    title: '完全平方公式',
    category: 'formula',
    content: '两数和（或差）的平方，等于它们的平方和，加上（或减去）它们积的2倍',
    formula: '(a+b)^2 = a^2 + 2ab + b^2',
    grade: 'g7',
    subject: 'math',
    difficulty: 2,
    points: 15,
  },
  {
    id: 'g7-formula-7',
    title: '完全平方公式（差）',
    category: 'formula',
    content: '两数差的平方公式',
    formula: '(a-b)^2 = a^2 - 2ab + b^2',
    grade: 'g7',
    subject: 'math',
    difficulty: 2,
    points: 15,
  },
  {
    id: 'g7-definition-1',
    title: '相反数定义',
    category: 'definition',
    content: '只有符号不同的两个数叫做互为相反数。0的相反数是0',
    grade: 'g7',
    subject: 'math',
    difficulty: 1,
    points: 5,
  },
  {
    id: 'g7-definition-2',
    title: '绝对值定义',
    category: 'definition',
    content: '数轴上表示数a的点与原点的距离叫做数a的绝对值，记作|a|',
    formula: '|a| = \\begin{cases} a, & a > 0 \\\\ 0, & a = 0 \\\\ -a, & a < 0 \\end{cases}',
    grade: 'g7',
    subject: 'math',
    difficulty: 2,
    points: 10,
  },
  {
    id: 'g7-definition-3',
    title: '单项式定义',
    category: 'definition',
    content: '由数或字母的积组成的代数式叫做单项式，单独的一个数或一个字母也叫做单项式',
    grade: 'g7',
    subject: 'math',
    difficulty: 1,
    points: 5,
  },
  {
    id: 'g7-definition-4',
    title: '多项式定义',
    category: 'definition',
    content: '几个单项式的和叫做多项式',
    grade: 'g7',
    subject: 'math',
    difficulty: 1,
    points: 5,
  },
]

// 八年级必背内容
const grade8Content: MemorizeItem[] = [
  {
    id: 'g8-formula-1',
    title: '一次函数表达式',
    category: 'formula',
    content: '一般地，形如y=kx+b(k,b是常数，k≠0)的函数，叫做一次函数',
    formula: 'y = kx + b \\quad (k \\neq 0)',
    grade: 'g8',
    subject: 'math',
    difficulty: 1,
    points: 10,
  },
  {
    id: 'g8-formula-2',
    title: '正比例函数',
    category: 'formula',
    content: '当b=0时，y=kx叫做正比例函数',
    formula: 'y = kx \\quad (k \\neq 0)',
    grade: 'g8',
    subject: 'math',
    difficulty: 1,
    points: 10,
  },
  {
    id: 'g8-formula-3',
    title: '勾股定理',
    category: 'theorem',
    content: '如果直角三角形的两条直角边长分别为a,b，斜边长为c，那么',
    formula: 'a^2 + b^2 = c^2',
    grade: 'g8',
    subject: 'math',
    difficulty: 2,
    points: 15,
  },
  {
    id: 'g8-formula-4',
    title: '勾股定理逆定理',
    category: 'theorem',
    content: '如果三角形的三边长a,b,c满足a²+b²=c²，那么这个三角形是直角三角形',
    grade: 'g8',
    subject: 'math',
    difficulty: 2,
    points: 15,
  },
  {
    id: 'g8-formula-5',
    title: '一次函数图像性质',
    category: 'theorem',
    content: 'k>0时，y随x的增大而增大；k<0时，y随x的增大而减小',
    grade: 'g8',
    subject: 'math',
    difficulty: 2,
    points: 10,
  },
  {
    id: 'g8-definition-1',
    title: '函数定义',
    category: 'definition',
    content: '一般地，在一个变化过程中，如果有两个变量x和y，并且对于x的每一个确定的值，y都有唯一确定的值与其对应，那么我们就说x是自变量，y是x的函数',
    grade: 'g8',
    subject: 'math',
    difficulty: 1,
    points: 10,
  },
]

// 九年级必背内容
const grade9Content: MemorizeItem[] = [
  {
    id: 'g9-formula-1',
    title: '二次函数一般式',
    category: 'formula',
    content: '一般地，形如y=ax²+bx+c(a,b,c是常数，a≠0)的函数，叫做二次函数',
    formula: 'y = ax^2 + bx + c \\quad (a \\neq 0)',
    grade: 'g9',
    subject: 'math',
    difficulty: 1,
    points: 10,
  },
  {
    id: 'g9-formula-2',
    title: '二次函数顶点式',
    category: 'formula',
    content: '二次函数的顶点式，其中(h,k)是顶点坐标',
    formula: 'y = a(x-h)^2 + k',
    grade: 'g9',
    subject: 'math',
    difficulty: 2,
    points: 15,
  },
  {
    id: 'g9-formula-3',
    title: '求根公式',
    category: 'formula',
    content: '一元二次方程ax²+bx+c=0(a≠0)的求根公式',
    formula: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
    grade: 'g9',
    subject: 'math',
    difficulty: 3,
    points: 20,
  },
  {
    id: 'g9-formula-4',
    title: '判别式',
    category: 'formula',
    content: '一元二次方程根的判别式',
    formula: '\\Delta = b^2 - 4ac',
    grade: 'g9',
    subject: 'math',
    difficulty: 2,
    points: 15,
  },
  {
    id: 'g9-theorem-1',
    title: '判别式与根的关系',
    category: 'theorem',
    content: 'Δ>0时，方程有两个不相等的实数根；Δ=0时，方程有两个相等的实数根；Δ<0时，方程没有实数根',
    grade: 'g9',
    subject: 'math',
    difficulty: 2,
    points: 15,
  },
  {
    id: 'g9-formula-5',
    title: '韦达定理',
    category: 'theorem',
    content: '一元二次方程ax²+bx+c=0的两根x₁,x₂与系数的关系',
    formula: 'x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 \\cdot x_2 = \\frac{c}{a}',
    grade: 'g9',
    subject: 'math',
    difficulty: 3,
    points: 20,
  },
  {
    id: 'g9-formula-6',
    title: '二次函数对称轴',
    category: 'formula',
    content: '二次函数y=ax²+bx+c的对称轴',
    formula: 'x = -\\frac{b}{2a}',
    grade: 'g9',
    subject: 'math',
    difficulty: 2,
    points: 10,
  },
  {
    id: 'g9-formula-7',
    title: '二次函数顶点坐标',
    category: 'formula',
    content: '二次函数y=ax²+bx+c的顶点坐标',
    formula: '\\left(-\\frac{b}{2a}, \\frac{4ac-b^2}{4a}\\right)',
    grade: 'g9',
    subject: 'math',
    difficulty: 2,
    points: 15,
  },
]

// 所有年级内容
export const allGradeContent: GradeContent[] = [
  { grade: 'g3', gradeName: '三年级', items: grade3Content },
  { grade: 'g7', gradeName: '七年级', items: grade7Content },
  { grade: 'g8', gradeName: '八年级', items: grade8Content },
  { grade: 'g9', gradeName: '九年级', items: grade9Content },
]

// 获取年级内容
export function getGradeContent(grade: string): GradeContent | undefined {
  return allGradeContent.find(g => g.grade === grade)
}

// 获取所有年级
export function getAllGrades(): string[] {
  return allGradeContent.map(g => g.grade)
}

// 分类名称映射
export const categoryNames: Record<string, { name: string; icon: string; color: string }> = {
  formula: { name: '公式', icon: '📐', color: 'bg-blue-100 text-blue-700' },
  definition: { name: '定义', icon: '📖', color: 'bg-green-100 text-green-700' },
  theorem: { name: '定理', icon: '🎯', color: 'bg-purple-100 text-purple-700' },
  vocabulary: { name: '词汇', icon: '📝', color: 'bg-yellow-100 text-yellow-700' },
}

// 难度名称映射
export const difficultyNames: Record<number, string> = {
  1: '基础',
  2: '进阶',
  3: '挑战',
}
