'use client'

import { useState } from 'react'

interface StatBlockProps {
  label: string
  current: number
  max: number
  onAdjustCurrent: (delta: number) => void
  onAdjustMax: (delta: number) => void
}

export function StatBlock({
  label,
  current,
  max,
  onAdjustCurrent,
  onAdjustMax,
}: StatBlockProps) {
  const [isEditingCurrent, setIsEditingCurrent] = useState(false)
  const [tempCurrent, setTempCurrent] = useState(current.toString())

  const handleCurrentClick = () => {
    setIsEditingCurrent(true)
    setTempCurrent(current.toString())
  }

  const handleCurrentBlur = () => {
    const newValue = parseInt(tempCurrent)
    if (!isNaN(newValue) && newValue !== current) {
      const delta = newValue - current
      onAdjustCurrent(delta)
    }
    setIsEditingCurrent(false)
  }

  const handleCurrentKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCurrentBlur()
    } else if (e.key === 'Escape') {
      setIsEditingCurrent(false)
      setTempCurrent(current.toString())
    }
  }

  return (
    <div className="stat-block">
      {/* Label */}
      <div className="stat-block-label">
        {label}
      </div>

      {/* Max and Current Values in a row */}
      <div className="grid grid-cols-2 gap-4 items-center">
        {/* Max value column */}
        <div className="text-center">
          <div className="stat-label-small mb-1">MAX</div>
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => onAdjustMax(-1)}
              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors text-xl font-bold"
              aria-label={`Decrease ${label} max`}
            >
              −
            </button>
            <div className="stat-value stat-value-large">
              {max}
            </div>
            <button
              onClick={() => onAdjustMax(1)}
              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors text-xl font-bold"
              aria-label={`Increase ${label} max`}
            >
              +
            </button>
          </div>
        </div>

        {/* Current value column */}
        <div className="text-center">
          <div className="stat-label-small mb-1">CURRENT</div>
          {isEditingCurrent ? (
            <input
              type="number"
              value={tempCurrent}
              onChange={(e) => setTempCurrent(e.target.value)}
              onBlur={handleCurrentBlur}
              onKeyDown={handleCurrentKeyDown}
              className="stat-input"
              autoFocus
              aria-label={`${label} current value`}
            />
          ) : (
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => onAdjustCurrent(-1)}
                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors text-xl font-bold"
                aria-label={`Decrease ${label} current`}
              >
                −
              </button>
              <div
                onClick={handleCurrentClick}
                className="stat-value cursor-pointer hover:opacity-70 transition-opacity underline decoration-2 decoration-black underline-offset-4"
                style={{ textDecorationStyle: 'solid' }}
              >
                {current}
              </div>
              <button
                onClick={() => onAdjustCurrent(1)}
                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors text-xl font-bold"
                aria-label={`Increase ${label} current`}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
