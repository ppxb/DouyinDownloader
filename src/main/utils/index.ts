import path from 'path'

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

const getFileExt = (fileName: string): string => path.extname(fileName)
