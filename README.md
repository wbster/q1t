# **q1t** *(quant)*


**q1t** - is a library for managing states inside an object.
You no longer need to create new objects, just update the value by `key` and there will be a reaction to the change.

[Worker](#Worker)<br>
[API](#API)

## Usage
---
```javascript
import quantum from 'q1t'

const user = quantum({
    name: 'alex',
    age: 15
})

user.on('age', age => {
    console.log('Happy Birthday!')
})

user.set('age', 16)

console.log(user.target)
// { "name": "alex", "age": 16 }
```

## reaction to a change in one of

```javascript
const q1t = require('q1t')

const object = q1t({
    a: 0,
    b: 0,
})

object.oneOf(['a', 'b'], ({ a, b }) => {
    console.log('one of the values (a|b) has been changed', a, b)
})

object.set('a', 5)

object.set('b', 16)
```

## Worker
one state between worker and main
___

`state.js`
```javascript
import WorkerState from 'q1t/WorkerState'

const state = new WorkerState({
    name: 'alex',
    age: 15
})
export default state
```
`worker.js`
```javascript
import state from './state.js'

state.init(self)
state.set('age', 16)
```

`main.js`
```javascript
import state from './state.js'

state.on('age', age => {
    console.log(age) // 16
})
state.connect('/worker.js')
```

# Depends

```javascript
// item with price and value in currency
const item = q1t({ 
    price: 2,
    currencyPrice: 0
})

const currency = q1t({
    value: 1,
    symbol: '$'
})

item.depends([ 
    // Depends on currency
    currency.give(['value']) // give access to change "value"
    // ... another depends
], () => {
    return ({
        // update item prop
        currencyPrice: currency.get('value') * item.get('price')
    })
})

item.once('currencyPrice', currencyPrice => {
    console.log('currencyPrice has been updated', currencyPrice)
})

currency.update({
    symbol: '€',
    value: 0.84,
})
```

Await change
```javascript
const quant = q1t({
    name: 'Alex'
})

quant
    .awaitChange('name')
    .then(name => {
        console.log('name has been changed', name)
    })

quant.set('name', 'Max')
```
# API
`const state = q1t(target: Object)`

* q1t(target: Object): new State(target)
* State
    + on(name: string, [subscribe](#subscribe)): [unsubscriber ](#unsubscriber )
    + once(name: string, [subscribe](#subscribe)): [unsubscriber ](#unsubscriber )
    + set(name: string, value: any)
    + update(target)
    + oneOf(names: [string], (target) => void): [unsubscriber ](#unsubscriber )
    + remove(name)


### subscribe
---
callback that is triggered when the value changes
```javascript
callback(value: any, target?:object) => void
```
### unsubscriber 
---
a function that unsubscribes from a change listener
