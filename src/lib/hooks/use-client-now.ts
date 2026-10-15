'use client'

import { useEffect, useState } from 'react'

/**
 * Returns the current Date, but only after the component has mounted in the browser.
 * Until then it returns null, so server HTML and the first client render always match
 * (the server's clock and time zone are not the viewer's).
 */
export function useClientNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
  }, [])
  return now
}