import { createSignal } from 'solid-js'

const signal = (buffer: Int32Array, index: number) => {
  const s = createSignal(undefined, { equals: false })

  const read = (debug?: string) => {
    s[0]()
    return buffer[index]
  }
  const write = (value: any) => {
    if (value === buffer[index]) {
      return
    }
    Atomics.store(buffer, index, value)
    Atomics.notify(buffer, index)
  }

  const subscribe = () => {
    // @ts-ignore
    const result = Atomics.waitAsync(buffer, index, buffer[index])
    if (result.async)
      result.value.then(() => {
        s[1]()
        subscribe()
      })
    else console.error('result.async is false', result)
  }

  subscribe()

  return [read, write] as const
}

export const createBuffer = (buffer: Int32Array) => {
  const cache = new Map()

  return new Proxy(buffer, {
    get(target, p, receiver) {
      if (typeof p !== 'string') return false
      if (isNaN(+p)) return false
      if (!cache.get(p)) cache.set(p, signal(target, +p))
      return cache.get(p)[0]()
    },
    set(target, p, newValue) {
      if (typeof p !== 'string') return false
      if (isNaN(+p)) return false
      if (!cache.get(p)) cache.set(p, signal(target, +p))
      cache.get(p)[1](newValue)
      return true
    },
  })
}
