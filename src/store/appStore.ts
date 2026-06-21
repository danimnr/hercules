import { create } from 'zustand'

type Theme = 'dark' | 'light'
type TitlebarStyle = 'native' | 'macos'

interface AppStore {
  accent: string
  opacity: number
  platform: string
  theme: Theme
  titlebarStyle: TitlebarStyle

  setAccent: (color: string) => void
  setOpacity: (value: number) => void
  setPlatform: (platform: string) => void
  setTheme: (theme: Theme) => void
  setTitlebarStyle: (style: TitlebarStyle) => void
}

export const useAppStore = create<AppStore>((set) => ({
  accent: '#7c6af7',
  opacity: 0.88,
  platform: 'Linux',
  theme: 'dark',
  titlebarStyle: 'native',

  setAccent:        (color)    => set({ accent: color }),
  setOpacity:       (value)    => set({ opacity: value }),
  setPlatform:      (platform) => set({ platform }),
  setTheme:         (theme)    => set({ theme }),
  setTitlebarStyle: (style)    => set({ titlebarStyle: style }),
}))
