'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface PortraitUploadProps {
  portraitUrl: string | null
  characterId: string
  onUploadComplete: (url: string) => void
}

export function PortraitUpload({
  portraitUrl,
  characterId,
  onUploadComplete,
}: PortraitUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${characterId}-${Date.now()}.${fileExt}`
      const filePath = `portraits/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('character-portraits')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('character-portraits').getPublicUrl(filePath)

      // Delete old portrait if exists
      if (portraitUrl) {
        const oldPath = portraitUrl.split('/').slice(-2).join('/')
        await supabase.storage.from('character-portraits').remove([oldPath])
      }

      onUploadComplete(publicUrl)
    } catch (err) {
      setError('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemovePortrait = async () => {
    if (!portraitUrl) return

    try {
      const path = portraitUrl.split('/').slice(-2).join('/')
      await supabase.storage.from('character-portraits').remove([path])
      onUploadComplete('')
    } catch (err) {
      setError('Failed to remove portrait')
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900">
        Portrait
      </label>

      <div className="relative aspect-square bg-gray-100 sketch-border border-gray-700 rounded-lg overflow-hidden shadow-md">
        {portraitUrl ? (
          <>
            <Image
              src={portraitUrl}
              alt="Character portrait"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold"
                >
                  Change
                </button>
                <button
                  onClick={handleRemovePortrait}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          </>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-full flex flex-col items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-16 h-16 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="text-sm font-semibold">
              {uploading ? 'Uploading...' : 'Add Portrait'}
            </span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-300 rounded px-3 py-2">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-700">
        Click to upload an image (max 5MB)
      </p>
    </div>
  )
}
