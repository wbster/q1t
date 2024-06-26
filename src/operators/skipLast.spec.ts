import { describe, expect, it, vitest } from "vitest"
import { Subject } from "../core/Subject"
import { skipLast } from "./skipLast"

describe("skipLast", () => {
	it("test 1", () => {
		const subject = new Subject<number>()

		const sub = vitest.fn((v: number) => undefined)

		subject.pipe(skipLast(1)).subscribe(sub)

		subject.setValue(1)
		subject.setValue(2)
		subject.setValue(3)

		expect(sub.mock.calls.length).toEqual(2)

		expect(sub.mock.calls[0][0]).toEqual(1)

		expect(sub.mock.calls[1][0]).toEqual(2)
	})

	it("test 2", () => {
		const subject = new Subject<number>()

		const sub = vitest.fn((v: number) => undefined)

		subject.pipe(skipLast(1)).subscribe(sub)

		subject.setValue(1)
		subject.setValue(2)
		subject.setValue(3)
		subject.setValue(4)
		subject.setValue(5)

		expect(sub.mock.calls.length).toEqual(4)

		expect(sub.mock.calls[2][0]).toEqual(3)

		expect(sub.mock.calls[3][0]).toEqual(4)
	})

	it("test 3", () => {
		const subject = new Subject<number>()

		const sub = vitest.fn((v: number) => undefined)

		subject.pipe(skipLast(2)).subscribe(sub)

		subject.setValue(1)
		subject.setValue(2)
		subject.setValue(3)
		subject.setValue(4)
		subject.setValue(5)

		expect(sub.mock.calls.length).toEqual(3)

		expect(sub.mock.calls[2][0]).toEqual(3)
	})
})
