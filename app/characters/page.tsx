import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { NewCharacterButton } from '@/components/characters/NewCharacterButton'
import type { Character } from '@/lib/types'

type CharacterListItem = Pick<
  Character,
  'id' | 'name' | 'level' | 'portrait_url' | 'created_at' | 'updated_at'
>

export default async function CharactersPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login')
  }

  // Fetch all characters for the current user
  const { data: characters, error: charactersError } = await supabase
    .from('characters')
    .select('id, name, level, portrait_url, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .returns<CharacterListItem[]>()

  const charactersList = characters || []

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-[#f5f0e8] rounded-lg shadow-xl border-4 border-gray-800 p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Characters
              </h1>
              <p className="text-gray-700">
                Manage your MausRitter adventurers
              </p>
            </div>
            <NewCharacterButton userId={user.id} />
          </div>
        </div>

        {/* Characters List */}
        {charactersList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg border-2 border-gray-600 p-12 text-center">
            <div className="text-6xl mb-4">🐭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Characters Yet
            </h2>
            <p className="text-gray-700 mb-6">
              Create your first MausRitter character to begin your adventure!
            </p>
            <NewCharacterButton userId={user.id} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charactersList.map((character) => (
              <Link
                key={character.id}
                href={`/characters/${character.id}`}
                className="bg-[#f5f0e8] rounded-lg shadow-lg border-3 border-gray-700 hover:border-gray-900 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="aspect-square bg-gray-100 border-b-3 border-gray-700 relative">
                  {character.portrait_url ? (
                    <Image
                      src={character.portrait_url}
                      alt={character.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl">
                      🐭
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                    {character.name || 'Unnamed Character'}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <span>Level {character.level}</span>
                    <span>
                      {new Date(character.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
