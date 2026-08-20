import { demoGameSnapshot, type DemoGameSnapshot } from '../demoData'

export interface PublicGameApi {
  restore(): Promise<DemoGameSnapshot>
  submitAction(action: string, payload: unknown): Promise<{ ok: boolean; snapshot: DemoGameSnapshot }>
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

/**
 * Local-only adapter for the synthetic snapshot. It demonstrates the shape a
 * UI can consume without making a network request or pretending to be the
 * production game service.
 */
export function createDemoApiClient(): PublicGameApi {
  return {
    restore: async () => demoGameSnapshot,
    submitAction: async (action: string, payload: unknown) => {
      void action
      void payload
      return { ok: true, snapshot: demoGameSnapshot }
    },
  }
}
