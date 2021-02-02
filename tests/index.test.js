const q1t = require('../dist')

describe('', () => {

	test('onOf', () => {
		const summ = q1t({
			a: 0,
			b: 0,
			result: 0
		})

		summ.onOf(['a', 'b'], ({ a, b }) => {
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
})