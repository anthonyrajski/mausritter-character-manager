'use client'

import { useEffect, useState } from 'react'

interface BuildInfo {
  version: string
  buildDate: string
  commitHash: string
  branch: string
  nodeVersion: string
}

export function Footer() {
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null)

  useEffect(() => {
    // Fetch build info
    fetch('/build-info.json')
      .then((res) => res.json())
      .then((data) => setBuildInfo(data))
      .catch((err) => console.error('Failed to load build info:', err))
  }, [])

  if (!buildInfo) {
    return null
  }

  const buildDate = new Date(buildInfo.buildDate)
  const formattedDate = buildDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const formattedTime = buildDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const environment = process.env.NODE_ENV === 'production' ? 'Production' : 'Development'

  return (
    <footer className="fixed bottom-2 right-2 text-xs text-gray-500 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2">
        <span className="font-semibold">v{buildInfo.version}</span>
        <span className="text-gray-400">•</span>
        <span title={`${formattedDate} at ${formattedTime}`}>
          Built: {formattedDate}
        </span>
        <span className="text-gray-400">•</span>
        <span title={`Branch: ${buildInfo.branch}`}>
          {buildInfo.commitHash}
        </span>
        <span className="text-gray-400">•</span>
        <span className={environment === 'Production' ? 'text-green-600' : 'text-blue-600'}>
          {environment}
        </span>
      </div>
    </footer>
  )
}
