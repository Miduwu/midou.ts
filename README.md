# midou.ts
A powerful library to manage your persistent timeouts!

# Table of content
- [Installation](#install)
- [Example](#example)
- [Functions](#functions)
- [Interfaces](#interfaces)

# Install
```
npm i midou.ts
```

# Example:
```js
import { Timeouts } from "midou.ts";

const timeouts = new Timeouts({ restore: true })

(async() => {
    await timeouts.add(15_000, "myCustomId", { "save": 12345 })
    await timeouts.add(60_000, "otherCustomId", { "save": { "o": [1,2,3] } })
})()

timeouts.on('expires', timeout => {
    console.log('Expired!', timeout)
})

timeouts.on('create', timeout => {
    console.log('Created!', timeout)
})

timeouts.start() // this allow us to restore the timeouts after crash
```

# Functions
**`<Timeouts>.add(ms: number, id: string, data: any): Promise<void>`**
**`<Timeouts>.remove(timeout: Timeout): Promise<void>`**
**`<Timeouts>.get_timeouts(): Promise<Timeout[]>`**
**`<Timeouts>.update_timeouts(timeouts: Timeouts[]): Promise<void>`**
**`<Timeouts>.start(): Promise<void>`**

# Interfaces
### Timeout
```ts
{
    "id": string,
    "time": number,
    "expires": number,
    "data": any
}
```