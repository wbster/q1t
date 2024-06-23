import { describe, expect, test, vitest } from "vitest"
import { combineLatest } from "../methods/combileLatest"
import { switchMap } from "../operators"
import { mapObservable } from "../operators/mapObservable"
import { skipAfter } from "../operators/skipAfter"
import { EventEmitter } from "./EventEmitter"
import { Observable } from "./Observable"
import { State } from "./State"
import { Subject } from "./Subject"

describe("observable", () => {
	test("observable", () => {
		const onCreate = vitest.fn(() => undefined)
		const onDestroy = vitest.fn(() => undefined)

		const obs = new Observable(() => {
			onCreate()

			return () => [onDestroy()]
		})

		obs
			.subscribe(() => {
				//
			})
			.unsubscribe()

		expect(onCreate.mock.calls.length).toEqual(1)
		expect(onDestroy.mock.calls.length).toEqual(1)
	})
	test("subject", () => {
		const cb = vitest.fn((bool: boolean) => undefined)
		const subject = new Subject<boolean>()

		subject.subscribe(cb)

		subject.setValue(false)

		expect(cb.mock.calls.length).toEqual(1)
		expect(cb.mock.calls[0][0]).toBeFalsy()
	})

	test("state", () => {
		const be = new State(1)

		const cb = vitest.fn((v: number) => v)
		be.subscribe(cb)

		be.pipe(mapObservable((v) => v * 2)).subscribe(cb)

		expect(cb.mock.calls.length).toEqual(2)
		expect(cb.mock.calls[0][0]).toEqual(1)
		expect(cb.mock.calls[1][0]).toEqual(2)
	})

	test("combineLatest", () => {
		const fn = vitest.fn(() => undefined)
		const list = combineLatest([new State(1), new State(2)])

		list.subscribe(fn)

		expect(fn.mock.calls.length).toEqual(1)
	})

	test("skipAfter", () => {
		const events = new EventEmitter<{ type: "move" | "up" }>()
		const mousemove = new Observable((sub) => {
			return events.on("move", sub)
		})
		const mouseup = new Observable((sub) => {
			return events.on("up", sub)
		})

		const mouseMoveTrigger = vitest.fn(() => undefined)
		const mouseUpTrigger = vitest.fn(() => undefined)
		mousemove.pipe(skipAfter(mouseup)).subscribe(mouseMoveTrigger)
		mouseup.subscribe(mouseUpTrigger)

		events.emit("move", {})
		events.emit("up", {})
		events.emit("move", {})
		events.emit("move", {})
		events.emit("move", {})

		expect(mouseMoveTrigger.mock.calls.length).toEqual(1)
	})

	test("switchMap", () => {
		const subject = new State(1)
		const observable = subject.pipe(
			switchMap((value) => {
				return new Observable<number>((sub) => {
					sub(value * 2)

					return () => undefined
				})
			}),
		)

		const sub = vitest.fn((v: number) => undefined)
		observable.subscribe(sub)

		expect(sub.mock.calls.length).toEqual(1)
		expect(sub.mock.calls[0][0]).toEqual(2)

		subject.setValue(2)

		expect(sub.mock.calls.length).toEqual(2)
		expect(sub.mock.calls[1][0]).toEqual(4)
	})
})
