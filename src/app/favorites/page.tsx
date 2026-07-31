'use client'

import { useState, useEffect } from 'react'
import { getNodeById, categoryNames, type KnowledgeNode } from '@/data/knowledge-graph'
import { allGradeContent, categoryNames as memoCategoryNames } from '@/data/memorize-data'

// 收藏类型
interface Favorite {
  id: string
  type: 'knowledge' | 'memorize' | 'question'
  itemId: string
  title: string
  content: string
  timestamp: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [filter, setFilter] = useState<'all' | 'knowledge' | 'memorize' | 'question'>('all')
  const [selectedFavorite, setSelectedFavorite] = useState<Favorite | null>(null)

  // 加载收藏
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(saved)
  }, [])

  // 保存收藏
  const saveFavorites = (updated: Favorite[]) => {
    setFavorites(updated)
    localStorage.setItem('favorites', JSON.stringify(updated))
  }

  // 删除收藏
  const removeFavorite = (id: string) => {
    const updated = favorites.filter(f => f.id !== id)
    saveFavorites(updated)
    if (selectedFavorite?.id === id) {
      setSelectedFavorite(null)
    }
  }

  // 清空收藏
  const clearAll = () => {
    if (confirm('确定要清空所有收藏吗？')) {
      saveFavorites([])
      setSelectedFavorite(null)
    }
  }

  // 筛选收藏
  const filteredFavorites = favorites.filter(f => {
    if (filter === 'all') return true
    return f.type === filter
  })

  // 统计
  const stats = {
    total: favorites.length,
    knowledge: favorites.filter(f => f.type === 'knowledge').length,
    memorize: favorites.filter(f => f.type === 'memorize').length,
    question: favorites.filter(f => f.type === 'question').length,
  }

  // 获取类型名称和图标
  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'knowledge': return { name: '知识点', icon: '📚', color: 'bg-blue-100 text-blue-700' }
      case 'memorize': return { name: '必背内容', icon: '📝', color: 'bg-green-100 text-green-700' }
      case 'question': return { name: '题目', icon: '❓', color: 'bg-purple-100 text-purple-700' }
      default: return { name: '其他', icon: '📌', color: 'bg-gray-100 text-gray-700' }
    }
  }

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 左侧：收藏列表 */}
        <div className="flex-1">
          {/* 页面标题 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">⭐ 我的收藏</h1>
              <p className="text-gray-600">收藏重要内容，随时查看</p>
            </div>
            {favorites.length > 0 && (
              <button onClick={clearAll} className="text-red-500 hover:text-red-600 text-sm">
                清空全部
              </button>
            )}
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="card text-center">
              <div className="text-2xl font-bold text-orange-500">{stats.total}</div>
              <div className="text-xs text-gray-500">总收藏</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-500">{stats.knowledge}</div>
              <div className="text-xs text-gray-500">知识点</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-500">{stats.memorize}</div>
              <div className="text-xs text-gray-500">必背内容</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-purple-500">{stats.question}</div>
              <div className="text-xs text-gray-500">题目</div>
            </div>
          </div>

          {/* 筛选按钮 */}
          <div className="card mb-6">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setFilter('knowledge')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === 'knowledge' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📚 知识点
              </button>
              <button
                onClick={() => setFilter('memorize')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === 'memorize' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📝 必背内容
              </button>
              <button
                onClick={() => setFilter('question')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === 'question' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ❓ 题目
              </button>
            </div>
          </div>

          {/* 收藏列表 */}
          {filteredFavorites.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {favorites.length === 0 ? '还没有收藏' : '该分类没有收藏'}
              </h3>
              <p className="text-gray-600 mb-4">
                {favorites.length === 0 ? '学习过程中点击收藏按钮即可添加' : '试试其他分类'}
              </p>
              {favorites.length === 0 && (
                <div className="flex gap-3 justify-center">
                  <a href="/graph" className="btn-kite">去知识图谱</a>
                  <a href="/memorize" className="btn-secondary">去必背内容</a>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFavorites.map((fav) => {
                const typeInfo = getTypeInfo(fav.type)
                return (
                  <div
                    key={fav.id}
                    onClick={() => setSelectedFavorite(fav)}
                    className={`card card-hover cursor-pointer ${
                      selectedFavorite?.id === fav.id ? 'ring-2 ring-orange-400' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${typeInfo.color}`}>
                        {typeInfo.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-800">{fav.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${typeInfo.color}`}>
                            {typeInfo.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">{fav.content}</p>
                        <div className="text-xs text-gray-400 mt-2">
                          {new Date(fav.timestamp).toLocaleString('zh-CN')}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFavorite(fav.id) }}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 右侧：详情面板 */}
        <div className="lg:w-96">
          <div className="card sticky top-24">
            {selectedFavorite ? (
              <FavoriteDetail
                favorite={selectedFavorite}
                onRemove={() => removeFavorite(selectedFavorite.id)}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-4">👈</div>
                <p>点击左侧收藏查看详情</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// 收藏详情组件
function FavoriteDetail({
  favorite,
  onRemove,
}: {
  favorite: Favorite
  onRemove: () => void
}) {
  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'knowledge': return { name: '知识点', icon: '📚', color: 'bg-blue-100 text-blue-700' }
      case 'memorize': return { name: '必背内容', icon: '📝', color: 'bg-green-100 text-green-700' }
      case 'question': return { name: '题目', icon: '❓', color: 'bg-purple-100 text-purple-700' }
      default: return { name: '其他', icon: '📌', color: 'bg-gray-100 text-gray-700' }
    }
  }

  const typeInfo = getTypeInfo(favorite.type)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">收藏详情</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}>
          {typeInfo.icon} {typeInfo.name}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="text-xl font-bold text-gray-800 mb-2">{favorite.title}</h4>
        <p className="text-gray-600">{favorite.content}</p>
      </div>

      <div className="text-sm text-gray-500 mb-6">
        📅 收藏时间: {new Date(favorite.timestamp).toLocaleString('zh-CN')}
      </div>

      <div className="space-y-3">
        <button
          onClick={onRemove}
          className="w-full btn-outline text-red-500 border-red-300 hover:bg-red-50"
        >
          取消收藏
        </button>
      </div>
    </div>
  )
}
