import { createWriteStream } from 'fs'
import axios from 'axios'
import progress from 'progress-stream'

import { IDownloadVideoFile } from '../../common/types'

class DownloadManager {
  private maxConcurrentDownloads: number
  private currentDownloads: Set<Promise<void>> = new Set()

  constructor(maxConcurrentDownloads: number) {
    this.maxConcurrentDownloads = maxConcurrentDownloads
  }

  async download(task: IDownloadVideoFile): Promise<void> {
    while (this.currentDownloads.size >= this.maxConcurrentDownloads) {
      await Promise.race(this.currentDownloads)
    }

    const downloadPromise = this.downloadFile(task)
      .then(() => {
        this.currentDownloads.delete(downloadPromise)
      })
      .catch(error => {
        this.currentDownloads.delete(downloadPromise)
        console.error(`Download failed for ${task.url}`, error)
      })

    this.currentDownloads.add(downloadPromise)
  }

  private async downloadFile(task: IDownloadVideoFile) {
    try {
      const response = await axios({
        url: task.url,
        method: 'GET',
        headers: { 'Content-Type': 'application/octet-stream' },
        responseType: 'stream'
      })

      const contentLength = response.headers['content-length']
      if (contentLength === null) {
        throw new Error('Response size header not found')
      }

      const progressStream = progress({
        length: parseInt(contentLength, 10),
        time: 500
      })

      //@ts-ignore
      progressStream.on('progress', progressData => {
        // console.log(progressData)
      })

      const ext = this.getExtFromContentType(
        response.headers['contentType'] || ''
      )
      const savePath = `${task.folder}\\${task.name}${ext}`
      const fileStream = createWriteStream(savePath)

      return new Promise((resolve, reject) => {
        response.data.pipe(progressStream).pipe(fileStream)
        fileStream.on('finish', resolve)
        fileStream.on('error', reject)
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  private getExtFromContentType(contentType: string): string {
    const extensionMap = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'video/mp4': '.mp4'
    }

    return extensionMap[contentType] || '.mp4'
  }
}

export default DownloadManager
