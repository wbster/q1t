import { State } from "@/core/State"
import { describe, expect, it, vitest } from "vitest"
import { skipLast } from "./skipLast"

describe("skipLast", () => {
	it("test 1", () => {
		const state = new State<number>(0)

		const sub = vitest.fn((_v: number) => undefined)

		state.pipe(skipLast(1)).subscribe(sub)

		state.value = 1
		state.value = 2
		state.value = 3

		expect(sub.mock.calls.length).toEqual(2)

		expect(sub.mock.calls[0][0]).toEqual(1)

		expect(sub.mock.calls[1][0]).toEqual(2)
	})

	it("test 2", () => {
		const state = new State<number>(0)

		const sub = vitest.fn((v: number) => undefined)

		state.pipe(skipLast(1)).subscribe(sub)

		state.value = 1
		state.value = 2
		state.value = 3
		state.value = 4
		state.value = 5

		expect(sub.mock.calls.length).toEqual(4)

		expect(sub.mock.calls[2][0]).toEqual(3)

		expect(sub.mock.calls[3][0]).toEqual(4)
	})

	it("test 3", () => {
		const state = new State<number>(0)

		const sub = vitest.fn((v: number) => undefined)

		state.pipe(skipLast(2)).subscribe(sub)

		state.value = 1
		state.value = 2
		state.value = 3
		state.value = 4
		state.value = 5

		expect(sub.mock.calls.length).toEqual(3)

		expect(sub.mock.calls[2][0]).toEqual(3)
	})
})
