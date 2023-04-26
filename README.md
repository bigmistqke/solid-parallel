<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-parallel&background=tiles&project=%20" alt="solid-parallel">
</p>

# solid-parallel

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

utilities for distributed reactivity

<!-- ## Quick start

Install it:

```bash
npm i solid-parallel
# or
yarn add solid-parallel
# or
pnpm add solid-parallel
```
 -->

Use it:

- main thread

```tsx
import { createEffect } from 'solid-js'
import { createBuffer } from 'solid-parallel'

const shared = new SharedArrayBuffer(1024)
const buffer = createBuffer(new Int32Array(shared))

const worker = new Worker('./worker.js', { type: 'module' })

worker.postMessage(shared)

setTimeout(() => {
  console.log('set value on main thread')
  buffer[0] = 2
}, 1000)

createEffect(() => console.log('effect main thread', buffer[0]))
```

- worker thread

```tsx
import { createEffect } from 'solid-js'
import { createBuffer } from 'solid-parallel'

onmessage = message => {
  const buffer = createBuffer(new Int32Array(message.data))

  createEffect(() => console.log('effect worker', buffer[0]))

  setTimeout(() => {
    console.log('set value on worker thread')
    buffer[0] = 10
  }, 2000)
}
```
