import type { IpcRendererEvent } from 'electron'

import {
  IDownloadFile,
  IVideoDownloadFilePreview,
  IVideoPatternItem
} from '@common/types'

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

export const newDownloadFile = (list: any): Promise<IDownloadFile | null> =>
  ipcRendererInvoke<IDownloadFile | null>('newDownloadFile', list)

export const getVideoDownloadData = (
  items: IVideoPatternItem[]
): Promise<IVideoDownloadFilePreview[]> =>
  ipcRendererInvoke(IpcEvents.APP_GET_VIDEO_DOWNLOAD_DATA, items)

export const listenerNewDownloadItem = (
  cb: (evene: IpcRendererEvent, ...args: any[]) => void
): void => ipcRendererOn('newDownloadItem', cb)

export const listenerDownloadItemUpdate = (
  cb: (event: IpcRendererEvent, ...args: any[]) => void
) => ipcRendererOn('downloadItemUpdate', cb)

export const listenerDownloadItemDone = (
  cb: (event: IpcRendererEvent, ...args: any[]) => void
) => ipcRendererOn('downloadItemDone', cb)
