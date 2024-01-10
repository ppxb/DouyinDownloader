import path from 'path'
import fs from 'fs'
import { App, IVideoDownloadFilePreview } from '../../common/types'
import { store } from '../ipc/store'

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

export const _generateDownloadFolder = () =>
  new Date().toISOString().slice(0, 10)

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
