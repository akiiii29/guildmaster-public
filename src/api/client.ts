export interface PublicGameApi {
  restore(): Promise<never>
  submitAction(action: string, payload: unknown): Promise<never>
}

/**
 * The production adapter is intentionally not part of this public snapshot.
 * This contract lets frontend code depend on a boundary without exposing an
 * API origin, authentication flow or backend implementation.
 */
export function createPublicApiClient(): PublicGameApi {
  const unavailable = async (): Promise<never> => {
    throw new Error('The production API adapter is not included in this snapshot.')
  }
  return {
    restore: unavailable,
    submitAction: async (action: string, payload: unknown) => {
      void action
      void payload
      return unavailable()
    },
  }
}
