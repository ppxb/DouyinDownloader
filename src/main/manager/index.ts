import fs from 'fs'
import progress from 'progress-stream'
import { Response } from 'node-fetch'

import { IDownloadVideoFile } from '../../common/types'

const fetch = (...args: [RequestInfo, RequestInit?]) =>
  //@ts-ignore
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

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
    const response: Response = await fetch(task.url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/octet-stream' }
    })
    if (!response.ok) {
      throw new Error(`Unexpected response ${response.statusText}`)
    }

    const contentLength = response.headers.get('content-length')
    if (contentLength === null) {
      throw new Error('Response size header not found')
    }

    const progressStream = progress({
      length: parseInt(contentLength, 10),
      time: 100
    })

    // progressStream.on('progress', progressData => {
    //   console.log(progressData)
    // })

    const ext = this.getExtFromContentType(
      response.headers.get('contentType') || ''
    )
    const savePath = `${task.folder}\\${task.name}${ext}`
    const fileStream = fs.createWriteStream(savePath)
    response.body?.pipe(progressStream).pipe(fileStream)

    return new Promise((resolve, reject) => {
      fileStream.on('finish', resolve)
      fileStream.on('error', reject)
    })
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
