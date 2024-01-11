import path from 'path'
import fs from 'fs'
import { App, IVideoDownloadFilePreview } from '../../common/types'
import { store } from '../ipc/store'

export const _getCurrentFormattedTime = (): string => {
  const now = new Date()
  const pad = (num: number) => num.toString().padStart(2, '0')

  const year = now.getFullYear()
  const month = pad(now.getMonth() + 1) // getMonth() is zero-indexed
  const day = pad(now.getDate())

  const hours = pad(now.getHours())
  const minutes = pad(now.getMinutes())
  const seconds = pad(now.getSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const _formatFileName = (
  format: string,
  file: IVideoDownloadFilePreview
): string =>
  Object.keys(file)
    .reduce((str, key) => {
      return str.replace(new RegExp(`{${key}}`, 'g'), file[key])
    }, format)
    .replace(/(\/|\|?:|\?|\*|"|>|<|\|)/g, '')

const pathJoin = (...p: string[]): string => path.join(...p)

export const _generateDownloadFolder = (): string => {
  const dateTime = new Date(+new Date() + 8 * 60 * 60 * 1000)
  return new Date(dateTime).toISOString().slice(0, 10)
}

export const _createFolder = (folder: string): string => {
  const { state } = JSON.parse(store.get('app') as string) as App
  const path = pathJoin(state.dir, folder)

  try {
    fs.mkdirSync(path, { recursive: true })
    return path
  } catch (error) {
    return ''
  }
}
