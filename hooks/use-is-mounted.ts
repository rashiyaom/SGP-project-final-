'use client'

import { useSyncExternalStore } from 'react'

/**
 * Returns `true` on the client after hydration, `false` on the server.
 * Uses `useSyncExternalStore` with a no-op subscribe (no external store needed)
 * to produce different snapshots for server (`false`) vs client (`true`).
 * This avoids the `useEffect + setState` anti-pattern for mount detection.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {}, // no external store to subscribe to
    () => true,     // client snapshot
    () => false     // server snapshot
  )
}
