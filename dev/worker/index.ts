import { createEffect } from 'solid-js'
import { createBuffer } from '../../src'

onmessage = message => {
  const buffer = createBuffer(new Int32Array(message.data))

  createEffect(() => {
    console.log('effect worker', buffer[0])
  })

  setTimeout(() => {
    console.log('set value on worker thread')
    buffer[0] = 10
  }, 2000)
}
