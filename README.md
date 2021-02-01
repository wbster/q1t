# **q1t** *(quant)*


**q1t** - is a library for managing states inside an object.
You no longer need to create new objects, just update the value by `key` and there will be a reaction to the change.

```javascript
    const quantum = require('q1t')

    const user = quantum({
        name: 'alex',
        age: 15
    })

    user.on('age', newAge => {
        console.log('Happy Birthday!')
    })

    user.set('age', 16)

    console.log(user.target)
    // { "name": "alex", "age": 16 }
```