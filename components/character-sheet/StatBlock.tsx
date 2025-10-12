'use client'

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
  return (
    <div className="bg-amber-100 border-2 border-amber-700 rounded-lg p-4 shadow-md">
      <div className="text-sm font-semibold text-amber-900 mb-3 text-center">
        {label}
      </div>

      {/* Current Value */}
      <div className="mb-2">
        <div className="text-xs text-amber-700 mb-1 text-center">Current</div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onAdjustCurrent(-1)}
            className="w-7 h-7 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-sm transition-colors"
            aria-label={`Decrease ${label} current`}
          >
            −
          </button>
          <div className="text-2xl font-bold text-amber-900 min-w-[2.5rem] text-center">
            {current}
          </div>
          <button
            onClick={() => onAdjustCurrent(1)}
            className="w-7 h-7 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-sm transition-colors"
            aria-label={`Increase ${label} current`}
          >
            +
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-amber-400 my-2"></div>

      {/* Max Value */}
      <div>
        <div className="text-xs text-amber-700 mb-1 text-center">Max</div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onAdjustMax(-1)}
            className="w-7 h-7 bg-amber-500 hover:bg-amber-600 text-white rounded font-bold text-sm transition-colors"
            aria-label={`Decrease ${label} max`}
          >
            −
          </button>
          <div className="text-xl font-bold text-amber-800 min-w-[2.5rem] text-center">
            {max}
          </div>
          <button
            onClick={() => onAdjustMax(1)}
            className="w-7 h-7 bg-amber-500 hover:bg-amber-600 text-white rounded font-bold text-sm transition-colors"
            aria-label={`Increase ${label} max`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
