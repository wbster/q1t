import { describe, expect, it } from "bun:test"
import { State } from "./State"

describe('state', () => {
	it('actions', () => {
		const state = new State(1)

		const { inc, dec } = state.createActions({
			inc: v => v + 1,
			dec: v => v - 1
		})

		expect(state.getValue()).toEqual(1)

		inc()

		expect(state.getValue()).toEqual(2)

		dec()

		expect(state.getValue()).toEqual(1)
	})
})