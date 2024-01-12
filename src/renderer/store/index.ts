import { create } from 'zustand'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'

import { IpcEvents } from '@common/ipcEvents'

import createSelectors from './selectors'

export type Theme = 'light' | 'dark' | 'system'
export type Language = '简体中文' | '繁體中文' | 'English'

type State = {
  cookie: string
  theme: Theme
  language: Language
  dir: string
  concurrent: string
  folderNameFormat: string
  fileNameFormat: string
}

type Actions = {
  updateCookie: (cookie: string) => void
  updateTheme: (theme: Theme) => void
  updateLanguage: (language: Language) => void
  updateDir: (dir: string) => void
  updateConcurrent: (concurrent: string) => void
  updateFolderNameFormat: (format: string) => void
  updateFileNameFormat: (format: string) => void
}

const storage: StateStorage = {
  setItem: (name: string, value: string) => {
    window.electron.ipcRenderer.send(IpcEvents.APP_SET_STORE, name, value)
  },
  getItem: async (name: string) => {
    return await window.electron.ipcRenderer.invoke(
      IpcEvents.APP_GET_STORE,
      name
    )
  },
  removeItem: (name: string) => {
    window.electron.ipcRenderer.send(IpcEvents.APP_DELETE_STORE, name)
  }
}

const initialState: State = {
  cookie: '',
  theme: 'light',
  language: '简体中文',
  dir: await window.electron.ipcRenderer.invoke(
    IpcEvents.APP_DEFAULT_DOWNLOAD_DIRECTORY
  ),
  concurrent: '5',
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
      updateConcurrent: (concurrent: string) => set({ concurrent }),
      updateFolderNameFormat: (format: string) =>
        set({ folderNameFormat: format }),
      updateFileNameFormat: (format: string) => set({ fileNameFormat: format }),
      reset: () => set(initialState)
    }),
    {
      name: 'app',
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
