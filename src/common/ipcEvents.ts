export enum IpcEvents {
  APP_SET_STORE = 'app:set-store',
  APP_GET_STORE = 'app:get-store',
  APP_DELETE_STORE = 'app:delete-store',

  APP_OPEN_GITHUB = 'app:open-github',
  APP_DEFAULT_DOWNLOAD_DIRECTORY = 'app:default-download-directory',
  APP_SET_DOWNLOAD_DIRECTORY = 'app:set-download-directory',

  APP_ASSET_PREVIEW = 'app:asset-preview',
  APP_NEW_DOWNLOAD = 'app:new-download',

  APP_ITEM_DOWNLOADING = 'app:item-downloading',
  APP_ITEM_DOWNLOAD_UPDATE = 'app:item-download-update',
  APP_ITEM_DOWNLOAD_FINISH = 'app:item-download-finish',
  APP_ITEM_DOWNLOAD_PAUSE = 'app:item-download-pause',
  APP_ITEM_DOWNLOAD_RESUME = 'app:item-download-resume',

  APP_GET_VIDEO_DOWNLOAD_DATA = 'app:get-video-download-data'
}
