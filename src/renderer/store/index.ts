import { create } from 'zustand'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'

import createSelectors from './selectors'

type Theme = 'light' | 'dark' | 'system'

type State = {
  cookie: string
  theme: Theme
  dir: string
}

type Actions = {
  updateCookie: (cookie: string) => void
  updateTheme: (theme: Theme) => void
  updateDir: (dir: string) => void
}

const storage: StateStorage = {
  getItem: (name: string): string => {
    return window.api.getStoreValue(name)
  },
  setItem: (name: string, value: string) => {
    window.api.setStoreValue(name, value)
  },
  removeItem: (name: string) => {
    window.api.removeStoreValue(name)
  }
}

const initialState: State = {
  cookie: '',
  theme: 'light',
  dir: './download'
}

const appStore = create<State & Actions>()(
  persist(
    set => ({
      ...initialState,
      updateCookie: (cookie: string) => {
        set({ cookie })
      },
      updateTheme: (theme: Theme) => {
        set({ theme })
      },
      updateDir: (dir: string) => {
        set({ dir })
      },
      reset: () => {
        set(initialState)
      }
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => storage),
      version: 0
    }
  )
)

export default createSelectors(appStore)
