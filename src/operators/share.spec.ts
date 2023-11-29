import { describe, expect, mock, test } from "bun:test"
import { Observable } from "../core/Observable"
import { share } from "./share"

describe('share', () => {

	test('test 1', () => {

		const obsConstructor = mock(() => undefined)
		const obs = new Observable<number>(sub => {
			sub(1)
			obsConstructor()
			return () => undefined
		})
			.pipe(share())

		const subscriber = mock((v: number) => undefined)
		obs
			.subscribe(subscriber)

		const subscriber2 = mock((v: number) => undefined)
		obs
			.subscribe(subscriber2)

		expect(obsConstructor.mock.calls.length).toEqual(1)
		expect(subscriber.mock.calls.length).toEqual(1)
		expect(subscriber2.mock.calls.length).toEqual(1)
	})
})