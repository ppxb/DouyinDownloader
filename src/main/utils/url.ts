import { shell } from 'electron'

export const handleOpenGithub = () =>
  shell.openExternal('https://github.com/ppxb/DouyinDownloader')
