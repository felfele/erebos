// @flow

import Bzz from '@erebos/api-bzz-node'
import { pubKeyToAddress } from '@erebos/keccak256'
import { createKeyPair, sign } from '@erebos/secp256k1'

import { Feedlinks } from '.'

const sleep = (time: number) => new Promise(r => setTimeout(r, time))

async function run() {
  const keyPair = createKeyPair(
    'feedfeedfeedfeedfeedfeedfeedfeedfeedfeedfeedfeedfeedfeedfeedfeed',
    'hex',
  )
  const address = pubKeyToAddress(keyPair.getPublic().encode())
  const bzz = new Bzz({
    signFeedDigest: async digest => sign(digest, keyPair.getPrivate()),
    url: 'http://localhost:8500',
  })
  const feedLinks = new Feedlinks(bzz)

  const feedHash = await bzz.createFeedManifest(address, { name: 'test9' })
  console.log('feed hash', feedHash)
  const updater = await feedLinks.createUpdater(feedHash, {
    author: address,
  })

  await updater({ content: 'update1' })

  const start = Date.now()
  const subscription = feedLinks
    .live(feedHash, { interval: 10000 })
    .subscribe(async payload => {
      console.log(
        'feed update',
        Math.floor((Date.now() - start) / 1000),
        payload.content,
      )
    })

  await sleep(1000)
  await updater({ content: 'update2' })
  await sleep(1000)
  await updater({ content: 'update3' })
  await sleep(1000)
  await updater({ content: 'update4' })
  await sleep(3000)
  await updater({ content: 'update5' })
  await sleep(2000)
  await updater({ content: 'update6' })
  await sleep(3000)
  await updater({ content: 'update7' })
  await sleep(2000)
  await updater({ content: 'update8' })
}

run().catch(console.error)
