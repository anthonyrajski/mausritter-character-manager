'use client'

import { useState } from 'react'
import type { InventoryItem } from '@/lib/types'

interface ItemCardProps {
  item: InventoryItem
  onDragStart?: (item: InventoryItem) => void
  onDragEnd?: () => void
  onUsageDotClick?: (newUsage: number) => void
  onDelete?: () => void
  isDragging?: boolean
  isPreview?: boolean
}

export function ItemCard({
  item,
  onDragStart,
  onDragEnd,
  onUsageDotClick,
  onDelete,
  isDragging = false,
  isPreview = false,
}: ItemCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/json', JSON.stringify(item))

    // Just use the element itself - no custom drag image
    // This prevents all layout shifts and bouncing
    onDragStart?.(item)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDragEnd?.()
  }

  const handleUsageDotClick = (dotIndex: number) => {
    if (onUsageDotClick) {
      const newUsage = dotIndex + 1 === item.currentUsage ? dotIndex : dotIndex + 1
      onUsageDotClick(newUsage)
    }
  }

  return (
    <div
      draggable={!isPreview}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        relative bg-white border-2 border-black rounded
        ${item.slots === 2 ? 'col-span-2' : ''}
        ${isDragging ? 'opacity-30 rotate-[-6deg] shadow-2xl' : ''}
        ${!isPreview ? 'cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow' : ''}
        ${isPreview ? 'pointer-events-none' : ''}
        w-full h-full flex flex-col min-h-[140px] max-h-full
      `}
      style={{
        willChange: isDragging ? 'opacity, transform' : 'auto',
        filter: isDragging ? 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4))' : 'none'
      }}
      onContextMenu={(e) => {
        if (!isPreview) {
          e.preventDefault()
          setShowMenu(!showMenu)
        }
      }}
    >
      {/* Title Bar */}
      <div className="bg-white border-b-2 border-black px-3 py-2">
        <h3 className="text-lg font-bold text-black truncate">{item.name}</h3>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 flex flex-col bg-white">
        {/* Usage Dots - always show 3 dots */}
        <div className="flex gap-1.5 mb-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleUsageDotClick(i)}
              className={`w-5 h-5 rounded-full border-2 border-black transition-colors ${
                i < item.currentUsage
                  ? 'bg-black'
                  : 'bg-white hover:bg-gray-100'
              }`}
              disabled={isPreview}
              title={`Usage ${i + 1}/3`}
            />
          ))}
        </div>

        <p className="text-sm text-gray-700 flex-1">
          {item.description}
        </p>
      </div>

      {/* Context Menu */}
      {showMenu && !isPreview && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-8 right-0 bg-white border-2 border-black rounded shadow-lg z-50 min-w-[120px]">
            <button
              onClick={() => {
                onDelete?.()
                setShowMenu(false)
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-red-100 text-red-600"
            >
              Delete Item
            </button>
          </div>
        </>
      )}

      {/* Slot indicator for 2-slot items */}
      {item.slots === 2 && !isPreview && (
        <div className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 rounded">
          2
        </div>
      )}
    </div>
  )
}
