import { State } from "@/core/State"
import { describe, expect, it, vitest } from "vitest"
import { computed } from "./computed"

describe("computed", () => {
	it("computes value and skips equal results", () => {
		const a = new State(1)
		const b = new State(2)

		const sum = computed([a, b], ([left, right]) => left + right)
		const sub = vitest.fn((_v: number) => undefined)
		sum.subscribe(sub)

		expect(sub.mock.calls.length).toEqual(1)
		expect(sub.mock.calls[0][0]).toEqual(3)

		a.value = 2
		expect(sub.mock.calls.length).toEqual(2)
		expect(sub.mock.calls[1][0]).toEqual(4)

		b.value = 2
		expect(sub.mock.calls.length).toEqual(2)

		b.value = 3
		expect(sub.mock.calls.length).toEqual(3)
		expect(sub.mock.calls[2][0]).toEqual(5)
	})
})
