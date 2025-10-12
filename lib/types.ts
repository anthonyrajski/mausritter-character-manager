// Database schema types
export interface Character {
  id: string
  user_id: string
  name: string
  background: string | null
  birthsign: string | null
  coat: string | null
  look: string | null
  portrait_url: string | null
  strength_current: number
  strength_max: number
  dexterity_current: number
  dexterity_max: number
  will_current: number
  will_max: number
  hp_current: number
  hp_max: number
  level: number
  pips: number
  grit: number
  inventory: InventoryItem[] | null
  banked_items: string | null
  banked_pips: number
  ignored_conditions: string[] | null
  created_at: string
  updated_at: string
}

export interface InventoryItem {
  id: string
  name: string
  description?: string
  quantity?: number
  equipped?: boolean
  slot?: string
  [key: string]: string | number | boolean | undefined
}

export interface Profile {
  id: string
  email: string
  username?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// Database type for Supabase client
export interface Database {
  public: {
    Tables: {
      characters: {
        Row: Character
        Insert: Omit<Character, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Character, 'id' | 'created_at' | 'updated_at'>> & {
          updated_at?: string
        }
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>> & {
          updated_at?: string
        }
      }
    }
  }
}
