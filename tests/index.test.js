const q1t = require('../dist')

describe('tests', () => {

	test('oneOf', () => {
		const summ = q1t({
			a: 0,
			b: 0,
			result: 0
		})

		summ.oneOf(['a', 'b'], ({ a, b }) => {
			summ.set('result', a + b)
		})

		summ.once('result', result => {
			expect(result).toBe(5)
			summ.once('result', result => {
				expect(result).toBe(21)
			})
		})

		summ.set('a', 5)

		summ.set('b', 16)
	})

	test('update multi', () => {
		const profile = q1t({
			email: 'we@gmail.com',
			name: 'Anton',
			age: 24
		})

		profile.once('email', (email) => {
			expect(email).toBe('web@gmail.com')
		})
		profile.once('name', (name) => {
			expect(name).toBe('Max')
		})
		profile.once('age', (age) => {
			expect(age).toBe(25)
		})

		profile.update({
			email: 'web@gmail.com',
			name: 'Max',
			age: 25
		})
	})

	test('remove', () => {
		const test = q1t({
			a: false
		})

		test.on('a', () => { })

		test.remove('a')

		// @ts-ignore
		expect(test.eventEmitter.eventList['a']).toBe(undefined)
	})

	test('unsubscribe', () => {
		const test = q1t({
			a: false
		})

		const unsubscriber = test.on('a', () => { })

		unsubscriber()

		// @ts-ignore
		expect(test.eventEmitter.eventList['a'].length).toBe(0)

	})

	test('awaitChange', () => {
		const quant = q1t({
			name: 'alex'
		})
		quant
			.awaitChange('name')
			.then(name => expect(name).toBe('Max'))
		quant.set('name', 'Max')
	})

	test('depends', () => {
		const item = q1t({
			price: 2,
			currencyPrice: 0
		})

		const currency = q1t({
			value: 1,
			symbol: '$'
		})

		item.depends([
			currency.give(['value'])
		], () => {
			return ({
				currencyPrice: currency.get('value') * item.get('price')
			})
		})

		currency.update({
			symbol: '€',
			value: 0.84,
		})

		expect(item.target.currencyPrice).toBe(0.84 * 2)
	})
})