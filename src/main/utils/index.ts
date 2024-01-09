import path from 'path'
import fs from 'fs'
import { App, IVideoDownloadFilePreview } from '../../common/types'
import { store } from '../ipc/store'

export { v4 as uuidV4 } from 'uuid'

export const _getFileName = (fileName: string, defaultName: string): string => {
  fileName =
    fileName.replace(/(\/|\|?:|\?|\*|"|>|<|\|)/g, '') ||
    path.basename(defaultName)
  fileName = /^\.(.*)/.test(fileName) ? defaultName : fileName

  const extName = getFileExt(fileName)
  if (!extName) {
    const ext = getFileExt(defaultName)
    fileName = `${fileName}.${ext}`
  }

  return decodeURIComponent(fileName)
}

export const _getBase64Bytes = (base64: string): number => {
  if (!/^data:.*;base64/.test(base64)) return 0

  const data = base64.split(',')[1].split('=')[0]
  const { length } = data

  return Math.floor(length - (length / 8) * 2)
}

export const _getFileExt = (fileName: string): string => path.extname(fileName)

export const _formatFileName = (
  format: string,
  file: IVideoDownloadFilePreview
): string =>
  Object.keys(file)
    .reduce((str, key) => {
      return str.replace(new RegExp(`{${key}}`, 'g'), file[key])
    }, format)
    .replace(/(\/|\|?:|\?|\*|"|>|<|\|)/g, '')

export const _pathJoin = (...p: string[]): string => path.join(...p)

export const generateDatePath = () => {
  return new Date().toISOString().slice(0, 10)
}

export const _generateDownloadFolder = () =>
  new Date().toISOString().slice(0, 10)

export const _createFolder = (folder: string): string => {
  const { state } = JSON.parse(store.get('app') as string) as App
  const path = _pathJoin(state.dir, folder)

  try {
    fs.mkdirSync(path, { recursive: true })
    return path
  } catch (error) {
    return ''
  }
}
