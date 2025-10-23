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
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/json', JSON.stringify(item))

    // Create a custom drag image with rotation and shadow
    const sourceElement = e.currentTarget as HTMLElement
    const rect = sourceElement.getBoundingClientRect()

    // Create wrapper container for the rotated drag image
    const wrapper = document.createElement('div')
    wrapper.style.position = 'absolute'
    wrapper.style.top = '-10000px'
    wrapper.style.left = '-10000px'
    wrapper.style.width = `${rect.width * 1.5}px` // Extra space for rotation
    wrapper.style.height = `${rect.height * 1.5}px`
    wrapper.style.pointerEvents = 'none'
    wrapper.style.opacity = '1'

    // Clone and style the card
    const dragImage = sourceElement.cloneNode(true) as HTMLElement
    dragImage.style.position = 'absolute'
    dragImage.style.top = '50%'
    dragImage.style.left = '50%'
    dragImage.style.width = `${rect.width}px`
    dragImage.style.height = `${rect.height}px`
    dragImage.style.transform = 'translate(-50%, -50%) rotate(-6deg)'
    dragImage.style.transformOrigin = 'center center'
    dragImage.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
    dragImage.style.setProperty('opacity', '1', 'important')
    dragImage.style.filter = 'none'
    dragImage.style.WebkitFilter = 'none'

    wrapper.appendChild(dragImage)
    document.body.appendChild(wrapper)

    e.dataTransfer.setDragImage(wrapper, (rect.width * 1.5) / 2, (rect.height * 1.5) / 2)

    // Remove the temporary drag image after it's been captured
    setTimeout(() => {
      if (document.body.contains(wrapper)) {
        document.body.removeChild(wrapper)
      }
    }, 0)

    onDragStart?.(item)
  }

  const handleDragEnd = () => {
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
        relative bg-white border-2 border-black rounded item-card-border
        ${item.slots === 2 ? 'col-span-2' : ''}
        ${isDragging ? 'opacity-0' : ''}
        ${!isPreview ? 'cursor-grab active:cursor-grabbing hover:shadow-lg transition-opacity duration-150' : ''}
        ${isPreview ? 'pointer-events-none' : ''}
        w-full h-full flex flex-col min-h-[140px] max-h-full
      `}
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
            className="fixed inset-0 z-[9998]"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed bg-white border-2 border-black rounded shadow-lg z-[9999] min-w-[120px]"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
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
