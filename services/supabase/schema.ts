export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      challenges: {
        Row: {
          category: string | null
          createdAt: string | null
          description: string | null
          endTime: string | null
          id: string
          images: string[] | null
          isPublic: boolean | null
          startTime: string | null
          status: string | null
          title: string
          userId: string
        }
        Insert: {
          category?: string | null
          createdAt?: string | null
          description?: string | null
          endTime?: string | null
          id?: string
          images?: string[] | null
          isPublic?: boolean | null
          startTime?: string | null
          status?: string | null
          title: string
          userId: string
        }
        Update: {
          category?: string | null
          createdAt?: string | null
          description?: string | null
          endTime?: string | null
          id?: string
          images?: string[] | null
          isPublic?: boolean | null
          startTime?: string | null
          status?: string | null
          title?: string
          userId?: string
        }
      }
      challengeSteps: {
        Row: {
          challengeId: string
          completed: boolean | null
          description: string | null
          stepId: number
          time: string | null
          title: string | null
        }
        Insert: {
          challengeId: string
          completed?: boolean | null
          description?: string | null
          stepId?: number
          time?: string | null
          title?: string | null
        }
        Update: {
          challengeId?: string
          completed?: boolean | null
          description?: string | null
          stepId?: number
          time?: string | null
          title?: string | null
        }
      }
      reactions: {
        Row: {
          challengeId: string | null
          reactionId: number | null
          userId: string
        }
        Insert: {
          challengeId?: string | null
          reactionId?: number | null
          userId: string
        }
        Update: {
          challengeId?: string | null
          reactionId?: number | null
          userId?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
