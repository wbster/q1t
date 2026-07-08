# q1t

`q1t` is a lightweight reactive state manager inspired by RxJS.

## Install

```bash
npm i q1t
```

## Quick Start

```ts
import { State, mapObservable } from "q1t"

const counter = new State(0)

counter
	.pipe(mapObservable((n) => n.toString()))
	.subscribe((valueStr) => {
		console.log("valueStr", valueStr)
	})

counter.value = 1
```

## Actions

```ts
import { State } from "q1t"

const user = new State({ name: "Max", age: 20 })

const { incAge } = user.createActions({
	incAge: (currentUser) => ({ ...currentUser, age: currentUser.age + 1 }),
})

incAge()
console.log(user.value.age) // 21
```

## combineLatest-style dependencies

```ts
import { State, combineLatest, mapObservable } from "q1t"

const items = new State([
	{ price: 1 },
	{ price: 2 },
	{ price: 3 },
])

const selectedIndex = new State(0)

const selectedItem = combineLatest([items, selectedIndex]).pipe(
	mapObservable(([list, index]) => list[index]),
)

const currency = new State({
	value: 1,
	symbol: "$",
})

const selectedItemPrice = combineLatest([selectedItem, currency]).pipe(
	mapObservable(([item, currentCurrency]) => currentCurrency.value * item.price),
)

selectedItemPrice.subscribe((price) => {
	console.log("selectedItemPrice updated", price)
})

selectedIndex.value = 1
```

## Computed values

```ts
import { State, computed } from "q1t"

const price = new State(100)
const quantity = new State(2)
const discount = new State(0.1)

const total = computed([price, quantity, discount], ([p, q, d]) => p * q * (1 - d))

total.subscribe((value) => {
	console.log("total", value)
})

quantity.value = 3
```

## Worker RPC example

`types.ts`

```ts
import type { JsonRpc, Notification } from "q1t"

export type MyJsonRpc = JsonRpc<"sum", { values: number[] }, { sum: number }>
export type MyNotifs = Notification<"notify_name", { any_data: boolean[] }>
```

`main.ts`

```ts
import { connectWorker } from "q1t"
import type { MyJsonRpc, MyNotifs } from "./types"

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })
const { fetch } = connectWorker<MyJsonRpc, MyNotifs>(worker)

const responseFromWorker = await fetch({
	requestName: "sum",
	data: { values: [1, 2] },
})

console.log(responseFromWorker.sum) // 3
```

`worker.ts`

```ts
import { connectClient } from "q1t"
import type { MyJsonRpc, MyNotifs } from "./types"

connectClient<MyJsonRpc, MyNotifs>({
	fetch(request) {
		switch (request.requestName) {
			case "sum":
				return { sum: request.data.values.reduce((acc, value) => acc + value, 0) }
			default:
				throw new Error("unexpected request")
		}
	},
})
```

## Development

See `DEVELOPING.md` for local development workflow.

## Publish checklist

```bash
npm login
npm run build
npm publish --access public
```

The package is configured with:

- ESM + CJS exports
- generated type declarations
- `prepublishOnly` build step
