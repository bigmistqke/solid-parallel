import { Component, createEffect } from 'solid-js'
import { createBuffer } from '../src'

const App: Component = () => {
  const shared = new SharedArrayBuffer(1024)
  const buffer = createBuffer(new Int32Array(shared))

  const worker = new Worker(new URL('./worker', import.meta.url), {
    type: 'module',
  })

  worker.postMessage(shared)

  setTimeout(() => {
    console.log('set value on main thread')
    buffer[0] = 2
  }, 1000)

  createEffect(() => console.log('effect main thread', buffer[0]))

  return <></>
}

export default App
