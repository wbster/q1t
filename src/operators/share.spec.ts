import { describe, expect, test, vitest } from "vitest"
import { Observable } from "../core/Observable"
import { share } from "./share"

describe("share", () => {
	test("test 1", () => {
		const obsConstructor = vitest.fn(() => undefined)
		const obs = new Observable<number>((sub) => {
			sub(1)
			obsConstructor()

			return () => undefined
		}).pipe(share())

		const subscriber = vitest.fn((v: number) => undefined)
		obs.subscribe(subscriber)

		const subscriber2 = vitest.fn((v: number) => undefined)
		obs.subscribe(subscriber2)

		expect(obsConstructor.mock.calls.length).toEqual(1)
		expect(subscriber.mock.calls.length).toEqual(1)
		expect(subscriber2.mock.calls.length).toEqual(1)
	})
})
