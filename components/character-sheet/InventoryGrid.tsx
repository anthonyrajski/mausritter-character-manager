'use client'

import { useState } from 'react'
import type { InventoryItem } from '@/lib/types'

interface InventoryGridProps {
  inventory: InventoryItem[]
  onInventoryChange: (inventory: InventoryItem[]) => void
}

type SlotType = 'mainPaw' | 'offPaw' | 'body1' | 'body2' | 'backpack'

interface InventorySlot {
  type: SlotType
  label: string
  number?: number
}

const SLOTS: InventorySlot[] = [
  { type: 'mainPaw', label: 'Main Paw' },
  { type: 'offPaw', label: 'Off Paw' },
  { type: 'body1', label: 'Body', number: 1 },
  { type: 'body2', label: 'Body', number: 2 },
  { type: 'backpack', label: 'Backpack', number: 1 },
  { type: 'backpack', label: 'Backpack', number: 2 },
  { type: 'backpack', label: 'Backpack', number: 3 },
  { type: 'backpack', label: 'Backpack', number: 4 },
  { type: 'backpack', label: 'Backpack', number: 5 },
  { type: 'backpack', label: 'Backpack', number: 6 },
]

export function InventoryGrid({
  inventory,
  onInventoryChange,
}: InventoryGridProps) {
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null)

  // Get item for a specific slot
  const getItemForSlot = (slotIndex: number): InventoryItem | null => {
    return inventory.find((item) => item.slot === `slot-${slotIndex}`) || null
  }

  // Update item in slot
  const updateSlot = (slotIndex: number, itemData: Partial<InventoryItem>) => {
    const existingItemIndex = inventory.findIndex(
      (item) => item.slot === `slot-${slotIndex}`
    )

    let newInventory: InventoryItem[]

    if (existingItemIndex >= 0) {
      // Update existing item
      newInventory = [...inventory]
      newInventory[existingItemIndex] = {
        ...newInventory[existingItemIndex],
        ...itemData,
      }
    } else {
      // Add new item
      const newItem: InventoryItem = {
        id: `item-${Date.now()}`,
        name: '',
        slot: `slot-${slotIndex}`,
        ...itemData,
      }
      newInventory = [...inventory, newItem]
    }

    onInventoryChange(newInventory)
  }

  // Remove item from slot
  const clearSlot = (slotIndex: number) => {
    const newInventory = inventory.filter(
      (item) => item.slot !== `slot-${slotIndex}`
    )
    onInventoryChange(newInventory)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-amber-900 border-b-2 border-amber-700 pb-2">
        Inventory
      </h3>

      {/* Main Paw & Off Paw */}
      <div className="grid grid-cols-2 gap-4">
        {SLOTS.slice(0, 2).map((slot, index) => {
          const item = getItemForSlot(index)
          const isEditing = editingSlotIndex === index

          return (
            <InventorySlotComponent
              key={index}
              slot={slot}
              item={item}
              isEditing={isEditing}
              onEdit={() => setEditingSlotIndex(index)}
              onSave={(data) => {
                updateSlot(index, data)
                setEditingSlotIndex(null)
              }}
              onClear={() => clearSlot(index)}
              onCancel={() => setEditingSlotIndex(null)}
            />
          )
        })}
      </div>

      {/* Body Slots */}
      <div>
        <h4 className="text-lg font-semibold text-amber-900 mb-2">Body</h4>
        <div className="grid grid-cols-2 gap-4">
          {SLOTS.slice(2, 4).map((slot, idx) => {
            const index = idx + 2
            const item = getItemForSlot(index)
            const isEditing = editingSlotIndex === index

            return (
              <InventorySlotComponent
                key={index}
                slot={slot}
                item={item}
                isEditing={isEditing}
                onEdit={() => setEditingSlotIndex(index)}
                onSave={(data) => {
                  updateSlot(index, data)
                  setEditingSlotIndex(null)
                }}
                onClear={() => clearSlot(index)}
                onCancel={() => setEditingSlotIndex(null)}
              />
            )
          })}
        </div>
      </div>

      {/* Backpack */}
      <div>
        <h4 className="text-lg font-semibold text-amber-900 mb-2">Backpack</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SLOTS.slice(4).map((slot, idx) => {
            const index = idx + 4
            const item = getItemForSlot(index)
            const isEditing = editingSlotIndex === index

            return (
              <InventorySlotComponent
                key={index}
                slot={slot}
                item={item}
                isEditing={isEditing}
                onEdit={() => setEditingSlotIndex(index)}
                onSave={(data) => {
                  updateSlot(index, data)
                  setEditingSlotIndex(null)
                }}
                onClear={() => clearSlot(index)}
                onCancel={() => setEditingSlotIndex(null)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface InventorySlotComponentProps {
  slot: InventorySlot
  item: InventoryItem | null
  isEditing: boolean
  onEdit: () => void
  onSave: (data: Partial<InventoryItem>) => void
  onClear: () => void
  onCancel: () => void
}

function InventorySlotComponent({
  slot,
  item,
  isEditing,
  onEdit,
  onSave,
  onClear,
  onCancel,
}: InventorySlotComponentProps) {
  const [editName, setEditName] = useState(item?.name || '')
  const [editDescription, setEditDescription] = useState(
    item?.description || ''
  )

  const handleSave = () => {
    if (editName.trim()) {
      onSave({
        name: editName.trim(),
        description: editDescription.trim() || undefined,
      })
    } else {
      onCancel()
    }
  }

  const handleClear = () => {
    onClear()
    setEditName('')
    setEditDescription('')
  }

  return (
    <div className="bg-amber-100 border-2 border-amber-700 rounded-lg p-3 min-h-[120px] flex flex-col">
      <div className="text-xs font-semibold text-amber-900 mb-2">
        {slot.label}
        {slot.number && ` ${slot.number}`}
      </div>

      {isEditing ? (
        <div className="flex-1 flex flex-col gap-2">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Item name"
            className="px-2 py-1 text-sm bg-white border border-amber-600 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)"
            className="px-2 py-1 text-sm bg-white border border-amber-600 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none flex-1"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : item ? (
        <div className="flex-1 flex flex-col">
          <div className="font-semibold text-amber-900 text-sm mb-1">
            {item.name}
          </div>
          {item.description && (
            <div className="text-xs text-amber-800 mb-2 flex-1">
              {item.description}
            </div>
          )}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={onEdit}
              className="flex-1 px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded"
            >
              Edit
            </button>
            <button
              onClick={handleClear}
              className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setEditName('')
            setEditDescription('')
            onEdit()
          }}
          className="flex-1 border-2 border-dashed border-amber-400 rounded hover:border-amber-600 hover:bg-amber-50 transition-colors flex items-center justify-center text-amber-600 text-sm"
        >
          + Add Item
        </button>
      )}
    </div>
  )
}
