import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CharacterSheet } from '@/components/character-sheet/CharacterSheet'
import type { Character } from '@/lib/types'

interface CharacterPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login')
  }

  // Fetch the character
  const { data: character, error: characterError } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .single<Character>()

  // Handle character not found
  if (characterError || !character) {
    notFound()
  }

  // Check if the character belongs to the current user
  if (character.user_id !== user.id) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl border-2 border-red-600 p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-700 mb-6">
            You do not have permission to view this character.
          </p>
          <Link
            href="/characters"
            className="inline-block px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
          >
            Return to Characters
          </Link>
        </div>
      </div>
    )
  }

  return <CharacterSheet characterId={id} />
}
