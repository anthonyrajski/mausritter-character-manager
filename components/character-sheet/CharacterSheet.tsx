'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Character, Database } from '@/lib/types'
import { StatBlock } from './StatBlock'
import { EditableField } from './EditableField'
import { InventoryGrid } from './InventoryGrid'
import { PortraitUpload } from './PortraitUpload'

interface CharacterSheetProps {
  characterId: string
}

export function CharacterSheet({ characterId }: CharacterSheetProps) {
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  // Load character data
  useEffect(() => {
    async function loadCharacter() {
      try {
        const { data, error } = await supabase
          .from('characters')
          .select('*')
          .eq('id', characterId)
          .single()

        if (error) throw error
        setCharacter(data)
      } catch (error) {
        console.error('Error loading character:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCharacter()
  }, [characterId, supabase])

  // Auto-save function with debouncing
  const saveCharacter = useCallback(
    async (updates: Partial<Character>) => {
      if (!character) return

      setSaving(true)
      try {
        const updateData: Database['public']['Tables']['characters']['Update'] = {
          ...updates,
          updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
          .from('characters')
          .update(updateData)
          .eq('id', characterId)

        if (error) throw error
      } catch (error) {
        console.error('Error saving character:', error)
      } finally {
        setSaving(false)
      }
    },
    [character, characterId, supabase]
  )

  // Update local state and trigger save
  const updateField = useCallback(
    (field: keyof Character, value: Character[keyof Character]) => {
      if (!character) return

      const updatedCharacter = { ...character, [field]: value }
      setCharacter(updatedCharacter)
      saveCharacter({ [field]: value })
    },
    [character, saveCharacter]
  )

  // Increment/decrement numeric values
  const adjustStat = useCallback(
    (field: keyof Character, delta: number, max?: number) => {
      if (!character) return

      const currentValue = character[field] as number
      let newValue = currentValue + delta

      if (max !== undefined) {
        newValue = Math.max(0, Math.min(newValue, max))
      } else {
        newValue = Math.max(0, newValue)
      }

      updateField(field, newValue)
    },
    [character, updateField]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-900 text-lg">Loading character...</div>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-700 text-lg">Character not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Save indicator - fixed position so it doesn't push content */}
      {saving && (
        <div className="fixed top-0 left-0 right-0 bg-gray-600 text-white text-center py-1 text-sm z-50">
          Saving...
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-[#f5f0e8] rounded-lg shadow-2xl sketch-border border-gray-800 overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Header Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Portrait */}
            <div className="md:col-span-1">
              <PortraitUpload
                portraitUrl={character.portrait_url}
                characterId={characterId}
                onUploadComplete={(url) => updateField('portrait_url', url)}
              />
            </div>

            {/* Basic Info */}
            <div className="md:col-span-2 space-y-4">
              <EditableField
                label="Name"
                value={character.name}
                onChange={(value) => updateField('name', value)}
                className="text-3xl font-bold text-gray-900"
              />

              <div className="grid grid-cols-2 gap-4">
                <EditableField
                  label="Background"
                  value={character.background || ''}
                  onChange={(value) => updateField('background', value)}
                  placeholder="Click to add background"
                />
                <EditableField
                  label="Birthsign"
                  value={character.birthsign || ''}
                  onChange={(value) => updateField('birthsign', value)}
                  placeholder="Click to add birthsign"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <EditableField
                  label="Coat"
                  value={character.coat || ''}
                  onChange={(value) => updateField('coat', value)}
                  placeholder="Click to add coat"
                />
                <EditableField
                  label="Look"
                  value={character.look || ''}
                  onChange={(value) => updateField('look', value)}
                  placeholder="Click to add look"
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatBlock
              label="STR"
              current={character.strength_current}
              max={character.strength_max}
              onAdjustCurrent={(delta) =>
                adjustStat('strength_current', delta, character.strength_max)
              }
              onAdjustMax={(delta) => adjustStat('strength_max', delta)}
            />
            <StatBlock
              label="DEX"
              current={character.dexterity_current}
              max={character.dexterity_max}
              onAdjustCurrent={(delta) =>
                adjustStat('dexterity_current', delta, character.dexterity_max)
              }
              onAdjustMax={(delta) => adjustStat('dexterity_max', delta)}
            />
            <StatBlock
              label="WIL"
              current={character.will_current}
              max={character.will_max}
              onAdjustCurrent={(delta) =>
                adjustStat('will_current', delta, character.will_max)
              }
              onAdjustMax={(delta) => adjustStat('will_max', delta)}
            />
            <StatBlock
              label="HP"
              current={character.hp_current}
              max={character.hp_max}
              onAdjustCurrent={(delta) =>
                adjustStat('hp_current', delta, character.hp_max)
              }
              onAdjustMax={(delta) => adjustStat('hp_max', delta)}
            />
          </div>

          {/* Level, Pips, Grit */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-100 sketch-border border-gray-700 rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-900 mb-2 text-center">
                Level
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => adjustStat('level', -1)}
                  className="w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded font-bold"
                >
                  −
                </button>
                <div className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">
                  {character.level}
                </div>
                <button
                  onClick={() => adjustStat('level', 1)}
                  className="w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-gray-100 sketch-border border-gray-700 rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-900 mb-2 text-center">
                Pips
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => adjustStat('pips', -1)}
                  className="w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded font-bold"
                >
                  −
                </button>
                <div className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">
                  {character.pips}
                </div>
                <button
                  onClick={() => adjustStat('pips', 1)}
                  className="w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-gray-100 sketch-border border-gray-700 rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-900 mb-2 text-center">
                Grit
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => adjustStat('grit', -1)}
                  className="w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded font-bold"
                >
                  −
                </button>
                <div className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">
                  {character.grit}
                </div>
                <button
                  onClick={() => adjustStat('grit', 1)}
                  className="w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          <InventoryGrid
            inventory={character.inventory || []}
            onInventoryChange={(newInventory) =>
              updateField('inventory', newInventory)
            }
          />
        </div>
      </div>
    </div>
  )
}
