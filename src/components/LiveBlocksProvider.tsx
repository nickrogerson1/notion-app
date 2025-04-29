'use client'

import { LiveblocksProvider } from "@liveblocks/react/suspense"

export default function LiveBlocksProvider({ children }: 
    { children: React.ReactNode 
}) {
    if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
        throw new Error("Missing Liveblocks public key")
    }

  return <LiveblocksProvider
     throttle={16} authEndpoint={'/auth-endpoint'}
  >{children}</LiveblocksProvider>
}