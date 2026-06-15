import { create } from 'zustand'

type Theme = 'dark' | 'light'

interface AppStore {
  accent: string
  opacity: number
  platform: string
  theme: Theme

  setAccent: (color: string) => void
  setOpacity: (value: number) => void
  setPlatform: (platform: string) => void
  setTheme: (theme: Theme) => void
}

export const useAppStore = create<AppStore>((set) => ({
  accent: '#7c6af7',
  opacity: 0.88,
  platform: 'Linux',
  theme: 'dark',

  setAccent:   (color)    => set({ accent: color }),
  setOpacity:  (value)    => set({ opacity: value }),
  setPlatform: (platform) => set({ platform }),
  setTheme:    (theme)    => set({ theme }),
}))
