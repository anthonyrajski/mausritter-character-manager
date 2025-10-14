'use client'

import { useState, useEffect, useRef } from 'react'
import type { InventoryItem } from '@/lib/types'
import { ItemCard } from './ItemCard'
import { SAMPLE_ITEMS, createItemFromTemplate } from '@/lib/sampleItems'

interface InventoryGridProps {
  inventory: InventoryItem[]
  onInventoryChange: (inventory: InventoryItem[]) => void
}

type SlotType = 'mainPaw' | 'offPaw' | 'body1' | 'body2' | 'backpack'

interface SlotPosition {
  type: SlotType
  index?: number // For backpack slots
  canFitTwoSlot: boolean // Can this slot accommodate a 2-slot item?
}

const CARRIED_SLOTS: SlotPosition[] = [
  { type: 'mainPaw', canFitTwoSlot: true }, // Can extend down to offPaw
  { type: 'body1', canFitTwoSlot: true }, // Can extend down to body2
  { type: 'offPaw', canFitTwoSlot: false }, // Bottom row - can't extend down
  { type: 'body2', canFitTwoSlot: false }, // Bottom row - can't extend down
]

const BACKPACK_SLOTS: SlotPosition[] = Array.from({ length: 6 }, (_, i) => ({
  type: 'backpack',
  index: i,
  canFitTwoSlot: i < 3, // Can fit 2-slot if in top row (extends down to bottom row)
}))

export function InventoryGrid({
  inventory = [],
  onInventoryChange,
}: InventoryGridProps) {
  const draggedItemRef = useRef<InventoryItem | null>(null)
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null)
  const [showItemPicker, setShowItemPicker] = useState<string | null>(null)

  // Get slot identifier
  const getSlotId = (slot: SlotPosition): string => {
    return slot.type === 'backpack' ? `backpack-${slot.index}` : slot.type
  }

  // Check if a slot is occupied
  const getItemInSlot = (slotId: string): InventoryItem | null => {
    return inventory.find((item) => item.position === slotId) || null
  }

  // Check if a 2-slot item can fit starting at this slot
  const canFitTwoSlotItem = (slotId: string, slots: SlotPosition[]): boolean => {
    const slotIndex = slots.findIndex((s) => getSlotId(s) === slotId)
    if (slotIndex === -1) return false

    const slot = slots[slotIndex]
    if (!slot.canFitTwoSlot) return false

    // Check if slot below is available
    // For carried grid: next slot is +2 (skip across row)
    // For backpack grid: next slot is +3 (skip across 3-wide row)
    const isBackpack = slotId.startsWith('backpack')
    const nextSlotIndex = slotIndex + (isBackpack ? 3 : 2)
    const nextSlot = slots[nextSlotIndex]
    if (!nextSlot) return false

    const nextSlotId = getSlotId(nextSlot)
    const nextSlotOccupied = getItemInSlot(nextSlotId)

    return !nextSlotOccupied
  }

  // Check if item occupies this slot (for 2-slot items spanning multiple slots)
  const isSlotOccupiedByTwoSlotItem = (slotId: string): InventoryItem | null => {
    // Determine which grid we're in
    const isBackpack = slotId.startsWith('backpack')
    const slots = isBackpack ? BACKPACK_SLOTS : CARRIED_SLOTS

    const slotIndex = slots.findIndex((s) => getSlotId(s) === slotId)
    if (slotIndex === -1) return null

    // Check slot above in the same grid
    // For carried grid: previous slot is -2 (skip back across row)
    // For backpack grid: previous slot is -3 (skip back across 3-wide row)
    const prevSlotIndex = slotIndex - (isBackpack ? 3 : 2)
    const prevSlot = slots[prevSlotIndex]
    if (!prevSlot) return null

    const prevSlotId = getSlotId(prevSlot)
    const prevItem = getItemInSlot(prevSlotId)

    if (prevItem && prevItem.slots === 2) {
      return prevItem
    }

    return null
  }

  const handleDragStart = (item: InventoryItem) => {
    draggedItemRef.current = item
  }

  const handleDragEnd = () => {
    draggedItemRef.current = null
    setDragOverSlot(null)
  }

  const handleDragOver = (e: React.DragEvent, slotId: string) => {
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move'
    }
    setDragOverSlot(slotId)
  }

  const handleDrop = (e: React.DragEvent, targetSlotId: string) => {
    e.preventDefault()
    setDragOverSlot(null)

    let item: InventoryItem

    // Check if dragging from inventory or from item picker
    try {
      const data = e.dataTransfer.getData('application/json')
      item = JSON.parse(data)
    } catch {
      return
    }

    // Don't allow dropping on occupied slots (unless it's the same item moving)
    const targetItem = getItemInSlot(targetSlotId)
    const spansSecondSlot = isSlotOccupiedByTwoSlotItem(targetSlotId)

    if (targetItem && targetItem.id !== item.id) return
    if (spansSecondSlot && spansSecondSlot.id !== item.id) return

    // Check if 2-slot item can fit
    if (item.slots === 2) {
      const slots = targetSlotId.startsWith('backpack')
        ? BACKPACK_SLOTS
        : CARRIED_SLOTS
      if (!canFitTwoSlotItem(targetSlotId, slots)) return
    }

    // Remove item from old position
    const newInventory = inventory.filter((i) => i.id !== item.id)

    // Add item to new position
    const updatedItem = { ...item, position: targetSlotId }
    newInventory.push(updatedItem)

    // Update inventory
    onInventoryChange(newInventory)
    draggedItemRef.current = null
  }

  const handleAddItem = (template: typeof SAMPLE_ITEMS[0], slotId: string) => {
    const newItem = createItemFromTemplate(template, slotId)

    // Check if slot is available
    const targetItem = getItemInSlot(slotId)
    if (targetItem) {
      console.log('Slot already occupied:', slotId)
      return
    }

    // Check if 2-slot item can fit
    if (newItem.slots === 2) {
      const slots = slotId.startsWith('backpack') ? BACKPACK_SLOTS : CARRIED_SLOTS
      const canFit = canFitTwoSlotItem(slotId, slots)
      console.log('2-slot item fit check:', { slotId, canFit })
      if (!canFit) {
        console.log('Cannot fit 2-slot item at:', slotId)
        return
      }
    }

    console.log('Adding item:', newItem)
    onInventoryChange([...inventory, newItem])
    setShowItemPicker(null)
  }

  const handleDeleteItem = (itemId: string) => {
    onInventoryChange(inventory.filter((i) => i.id !== itemId))
  }

  const handleUsageDotClick = (itemId: string, newUsage: number) => {
    const newInventory = inventory.map((item) =>
      item.id === itemId ? { ...item, currentUsage: newUsage as 0 | 1 | 2 | 3 } : item
    )
    onInventoryChange(newInventory)
  }

  const renderSlot = (slot: SlotPosition, label?: string, labelSize: 'small' | 'large' = 'small') => {
    const slotId = getSlotId(slot)
    const item = getItemInSlot(slotId)
    const spansHere = isSlotOccupiedByTwoSlotItem(slotId)
    const isDragOver = dragOverSlot === slotId
    const draggedItem = draggedItemRef.current

    // Check if the dragged item can be dropped in this slot
    const canDrop =
      draggedItem &&
      (!item || item.id === draggedItem.id) &&
      (!spansHere || spansHere.id === draggedItem.id) &&
      (draggedItem.slots === 1 ||
        canFitTwoSlotItem(
          slotId,
          slotId.startsWith('backpack') ? BACKPACK_SLOTS : CARRIED_SLOTS
        ))

    return (
      <div
        key={slotId}
        className="relative w-full h-full overflow-visible"
        onDragOver={(e) => handleDragOver(e, slotId)}
        onDrop={(e) => handleDrop(e, slotId)}
      >
        {/* Slot label as watermark */}
        {label && !item && !spansHere && (
          <div
            className={`absolute top-3 left-3 text-gray-700 opacity-30 pointer-events-none z-0 ${
              labelSize === 'large' ? 'text-5xl' : 'text-2xl leading-tight'
            }`}
            style={{ fontFamily: 'var(--font-brokenscript), serif', fontWeight: 'bold' }}
          >
            {label}
          </div>
        )}

        {/* Item container - full height */}
        <div className="relative w-full h-full overflow-visible">
          {/* Drop zone indicator - green if can drop, red if cannot */}
          {isDragOver && canDrop && (
            <div className="absolute inset-0 bg-green-300 bg-opacity-30 border-2 border-green-500 border-dashed rounded z-10 pointer-events-none transition-all duration-150" />
          )}

          {isDragOver && !canDrop && draggedItem && (
            <div className="absolute inset-0 bg-red-300 bg-opacity-30 border-2 border-red-500 border-dashed rounded z-10 pointer-events-none transition-all duration-150" />
          )}

          {/* Item or empty slot */}
          {item && item.position === slotId ? (
            item.slots === 2 ? (
              // 2-slot item: absolutely positioned to span two cells vertically
              <div className="absolute inset-0 top-0 bottom-[-101%] z-20">
                <ItemCard
                  item={item}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDelete={() => handleDeleteItem(item.id)}
                  onUsageDotClick={(newUsage) => handleUsageDotClick(item.id, newUsage)}
                  isDragging={draggedItemRef.current?.id === item.id}
                />
              </div>
            ) : (
              // 1-slot item: normal height
              <div className="h-full">
                <ItemCard
                  item={item}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDelete={() => handleDeleteItem(item.id)}
                  onUsageDotClick={(newUsage) => handleUsageDotClick(item.id, newUsage)}
                  isDragging={draggedItemRef.current?.id === item.id}
                />
              </div>
            )
          ) : spansHere ? (
            // This slot is occupied by a 2-slot item from previous slot
            <div className="h-full" />
          ) : (
            // Empty slot - show add button
            <button
              onClick={() => setShowItemPicker(slotId)}
              className="w-full h-full border-2 border-dashed border-gray-400 rounded hover:border-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-600 text-xs font-semibold"
            >
              + Add Item
            </button>
          )}
        </div>

        {/* Item picker modal */}
        {showItemPicker === slotId && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowItemPicker(null)}
            />
            <div className="absolute top-0 left-0 right-0 bg-white border-2 border-black rounded-lg shadow-2xl z-50 max-h-[400px] overflow-y-auto p-4">
              <h4 className="font-bold mb-3 text-sm">Select an item:</h4>
              <div className="grid grid-cols-1 gap-2">
                {SAMPLE_ITEMS.map((template, i) => (
                  <button
                    key={i}
                    onClick={() => handleAddItem(template, slotId)}
                    className="text-left p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-semibold text-sm">
                      {template.name} {template.slots === 2 && '(2 slots)'}
                    </div>
                    <div className="text-xs text-gray-600">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4" style={{ contain: 'layout style paint' }}>
      {/* SVG Filter for hand-drawn effect */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="sketch-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <h3
        className="text-2xl text-gray-900 border-b-2 border-gray-700 pb-2"
        style={{ fontFamily: 'var(--font-brokenscript), serif', fontWeight: 'bold' }}
      >
        Inventory
      </h3>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4">
        {/* Left: Carried/Worn items (2x2 grid) */}
        <div className="bg-gray-100 sketch-border border-gray-700 rounded-lg p-0 relative overflow-visible aspect-square">
          <div className="grid grid-cols-2 grid-rows-2 h-full w-full overflow-visible">
            {/* Main Paw - Top Left */}
            <div className="border-r border-b border-gray-600 relative overflow-visible">
              {renderSlot(CARRIED_SLOTS[0], 'main paw')}
            </div>

            {/* Body 1 - Top Right */}
            <div className="border-b border-gray-600 relative overflow-visible">
              {renderSlot(CARRIED_SLOTS[1], 'body')}
            </div>

            {/* Off Paw - Bottom Left */}
            <div className="border-r border-gray-600 relative overflow-visible">
              {renderSlot(CARRIED_SLOTS[2], 'off paw')}
            </div>

            {/* Body 2 - Bottom Right */}
            <div className="relative overflow-visible">{renderSlot(CARRIED_SLOTS[3], 'body')}</div>
          </div>
        </div>

        {/* Right: Backpack (3x2 grid) */}
        <div className="bg-gray-100 sketch-border border-gray-700 rounded-lg p-0 relative overflow-visible aspect-[3/2]">
          <div className="grid grid-cols-3 grid-rows-2 h-full w-full overflow-visible">
            {BACKPACK_SLOTS.map((slot, idx) => {
              const slotNum = idx + 1
              const isRightEdge = slotNum % 3 === 0
              const isBottomRow = slotNum > 3

              return (
                <div
                  key={getSlotId(slot)}
                  className={`relative overflow-visible ${!isRightEdge ? 'border-r' : ''} ${
                    !isBottomRow ? 'border-b' : ''
                  } border-gray-600`}
                >
                  {renderSlot(slot, slotNum.toString(), 'large')}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
