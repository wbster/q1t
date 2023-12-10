# **q1t** *(quant)*


**q1t** - rxjs like state manager

## Usage


```javascript
import { createState } from 'q1t'

const counter = createState(0)

counter
	.subscribe(value => {
		console.log('value', value)
	})

counter.next(1)
```
## Actions
```javascript
const user = new State({ name: 'Max', age: 20 })

const { incAge } = user.createActions({ incAge: user => ({ ...user, age: user.age + 1 }) })

incAge()

user.getValue().age // 21
```

## Worker
one state between worker and main
___

`state.js`
```javascript
import { State } from 'q1t'

const state = new State({ value: 1 })

export default state
```
`worker.js`
```javascript
import state from './state.js'

createWorkerState(state, {
	isWorker: true
})

state.next({ value: 2 })
```

`main.js`
```javascript
import state from './state.js'

state.getValue() // 1

createWorkerState(state, {
    workerUrl: 'http://example.com/workerFIle.js'
})

state.subscribe(({ value }) => console.log(value)) // 1 -> 2
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
