import { create } from 'zustand'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'

import createSelectors from './selectors'

export type Theme = 'light' | 'dark' | 'system'
export type Quality = '1080P' | '720P' | '480P'
export type Language = '简体中文' | '繁體中文' | 'English'

type State = {
  cookie: string
  theme: Theme
  language: Language
  dir: string
  quality: Quality
  folderNameFormat: string
  fileNameFormat: string
}

type Actions = {
  updateCookie: (cookie: string) => void
  updateTheme: (theme: Theme) => void
  updateLanguage: (language: Language) => void
  updateDir: (dir: string) => void
  updateQuality: (quality: Quality) => void
  updateFolderNameFormat: (format: string) => void
  updateFileNameFormat: (format: string) => void
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
  language: '简体中文',
  dir: await window.api.getDefaultDownloadDir(),
  quality: '1080P',
  folderNameFormat: '{date}',
  fileNameFormat: '{author}-{title}-{time}'
}

const appStore = create<State & Actions>()(
  persist(
    set => ({
      ...initialState,
      updateCookie: (cookie: string) => set({ cookie }),
      updateTheme: (theme: Theme) => set({ theme }),
      updateLanguage: (language: Language) => set({ language }),
      updateDir: (dir: string) => set({ dir }),
      updateQuality: (quality: Quality) => set({ quality }),
      updateFolderNameFormat: (format: string) =>
        set({ folderNameFormat: format }),
      updateFileNameFormat: (format: string) => set({ fileNameFormat: format }),
      reset: () => set(initialState)
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => storage),
      version: 0,
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          persistedState.newField = persistedState.oldField
          delete persistedState.oldField
        }
        return persistedState
      }
    }
  )
)

export default createSelectors(appStore)
