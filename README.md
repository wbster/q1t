# **q1t** *(quant)*


**q1t** - rxjs like state manager

## Usage


```typescript
import { State, mapObservable, toNextFrame } from 'q1t'

const counter = new State(0)

counter
	.pipe(mapObservable(n => n.toString()))
	.pipe(toNextFrame())
	.subscribe(valueStr => {
		console.log('valueStr', valueStr)
	})

counter.setValue(1)
```
## Actions
```typescript
const user = new State({ name: 'Max', age: 20 })

const { incAge } = user.createActions({ incAge: user => ({ ...user, age: user.age + 1 }) })

incAge()

user.getValue().age // 21
```

## Worker
send fetch request to worker
___

`types.ts`
```typescript
export type MyJsonRpc = JsonRpc<'sum', { values: number[] }, { sum: number }>

export type MyNotifs = Notification<'notify_name', { any_data: boolean[] }>

```
`main.ts`
```typescript
import { connectWorker, JsonRpc, Notification } from 'q1t'
import type { MyJsonRpc, MyNotifs } from './types.ts' 

const worker = new Worker('my_worker.js')

const { fetch } = connectWorker<MyJsonRpc, MyNotifs>(worker)

const responseFromWorker = await fetch({ requestName: 'sum', data: { values: [1, 2]}})

console.log(resposeFromWorker) // 3

```
`worker.ts`
```typescript
import { connectClient } from 'q1t'
import type { MyJsonRpc, MyNotifs } from './types.ts' 

connectClient<MyJsonRpc, MyNotifs>>({
	fetch(request) => {
		switch(request.requestName) {
			case 'sum': 
				return request.data.values.reduce((acc, v) => acc + v, 0)
			default: throw new Error('unexpected behavior')
		}
	}
})

```

## Depends like RxJS

```javascript
const items = createState([
	{ price: 1 },
	{ price: 2 },
	{ price: 3 },
])

const selectedIndex = createState(0)

const selectedItem = combineLatest([items, selectedIndex])
	.pipe(mapObservable(([items, index]) => items[index]))

const currency = createState({
	value: 1,
	symbol: '$'
})

const selectedItemPrice = combineLatest([
	selectedItem,
	currency,
])
	.pipe(mapObservable(([item, currency]) => {
		return currency.value * item.price
	}))

selectedItemPrice
	.subscribe(price => {
		console.log('selectedItemPrice has been updated', price)
	})

selectedIndex.next(1)
```
