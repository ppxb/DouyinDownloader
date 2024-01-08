import Store, { Schema } from 'electron-store'

import { AppSettings } from '../../common/types'

interface Entity {
  settings: AppSettings
  app: any
}

export type EntityName = keyof Entity

const schema: Schema<Entity> = {
  settings: {
    type: 'string',
    default: ''
  },
  app: {
    type: 'string',
    default: ''
  }
}

export const store = new Store<Entity>({ schema })
