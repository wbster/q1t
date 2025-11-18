import { describe, expect, it } from "vitest"
import { State } from "./core/State"

describe("state", () => {
	it("actions", () => {
		const state = new State(1)

		const { inc, dec } = state.createActions({
			inc: (v) => v + 1,
			dec: (v) => v - 1,
		})

		expect(state.value).toEqual(1)

		inc()

		expect(state.value).toEqual(2)

		dec()

		expect(state.value).toEqual(1)
	})
})
