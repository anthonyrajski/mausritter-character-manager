'use client'

import { useState, useRef, useEffect } from 'react'

interface EditableFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  multiline?: boolean
}

export function EditableField({
  label,
  value,
  onChange,
  placeholder = 'Click to edit',
  className = '',
  multiline = false,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = () => {
    if (editValue !== value) {
      onChange(editValue)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(value)
      setIsEditing(false)
    }
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-gray-900">
        {label}
      </label>
      {isEditing ? (
        multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`w-full px-3 py-2 bg-white border-2 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 ${className}`}
            rows={3}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`w-full px-3 py-2 bg-white border-2 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 ${className}`}
          />
        )
      ) : (
        <div
          onClick={() => {
            setEditValue(value)
            setIsEditing(true)
          }}
          className={`w-full px-3 py-2 bg-gray-50 sketch-border border-gray-300 rounded cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-colors text-gray-900 ${className} ${
            !value ? 'text-gray-600 italic' : ''
          }`}
        >
          {value || placeholder}
        </div>
      )}
    </div>
  )
}
