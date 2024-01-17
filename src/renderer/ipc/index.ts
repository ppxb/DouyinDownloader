import type { IpcRendererEvent } from 'electron'

import { IVideoDownloadFilePreview, IVideoPatternItem } from '@common/types'

import { IpcEvents } from '@common/ipcEvents'

const { ipcRenderer } = window.electron

export const ipcRendererOn = (
  ipcEventName: string,
  cb: (event: IpcRendererEvent, ...args: any[]) => void
) => {
  ipcRenderer.on(ipcEventName, (event, ...args: any[]) => {
    cb(event, ...args)
  })
}

export const ipcRendererInvoke = <T>(
  ipcEventName: string,
  ...args: any[]
): Promise<T> => ipcRenderer.invoke(ipcEventName, ...args)

export const getVideoDownloadData = (
  items: IVideoPatternItem[]
): Promise<IVideoDownloadFilePreview[]> =>
  ipcRendererInvoke(IpcEvents.APP_GET_VIDEO_DOWNLOAD_DATA, items)

export const listenerNewDownloadItem = (
  cb: (evene: IpcRendererEvent, ...args: any[]) => void
): void => ipcRendererOn(IpcEvents.APP_ITEM_DOWNLOADING, cb)

export const listenerDownloadItemUpdate = (
  cb: (event: IpcRendererEvent, ...args: any[]) => void
) => ipcRendererOn(IpcEvents.APP_ITEM_DOWNLOAD_UPDATE, cb)

export const listenerDownloadItemFinish = (
  cb: (event: IpcRendererEvent, ...args: any[]) => void
) => ipcRendererOn(IpcEvents.APP_ITEM_DOWNLOAD_FINISH, cb)

export const openDownloadItemFolder = (
  cb: (event: IpcRendererEvent, ...args: any[]) => void
) => ipcRendererOn(IpcEvents.APP_OPEN_DOWNLOAD_FOLDER, cb)
