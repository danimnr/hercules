import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useAppStore } from '../store/appStore'

export function usePlatform() {
  const setPlatform = useAppStore(s => s.setPlatform)
  const platform = useAppStore(s => s.platform)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    invoke<string>('get_platform_info').then(p => {
      setPlatform(p)
      setLoaded(true)
    })
  }, [])

  return { platform, loaded }
}
