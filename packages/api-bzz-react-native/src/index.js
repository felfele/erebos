// @flow
/* eslint-env browser */

import { URL } from 'universal-url'
import BaseBzz, {
  type BzzConfig,
  type DirectoryData,
  type UploadOptions,
} from '@erebos/api-bzz-base'
import type { hexValue } from '@erebos/hex'

export type * from '@erebos/api-bzz-base'

export default class Bzz extends BaseBzz {
  constructor(config: BzzConfig) {
    const { url, ...cfg } = config
    super({ ...cfg, url: new URL(url).href })
    this._fetch = window.fetch.bind(window)
  }

  uploadDirectory(
    directory: DirectoryData,
    options?: UploadOptions = {},
  ): Promise<hexValue> {
    const form = new FormData()
    Object.keys(directory).forEach(key => {
      form.append(
        key,
        ({
          uri: directory[key].data,
          type: directory[key].contentType,
          name: key,
        }: any),
        key,
      )
    })
    if (options.defaultPath != null) {
      const file = directory[options.defaultPath]
      if (file != null) {
        form.append(
          '',
          ({
            uri: directory[options.defaultPath].data,
            type: directory[options.defaultPath].contentType,
            name: options.defaultPath,
          }: any),
          '',
        )
      }
    }
    return this._upload(form, options)
  }
}
