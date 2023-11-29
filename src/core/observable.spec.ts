
import { combineLatest } from '../methods'
import { switchMap } from '../operators'
import { skipAfter } from '../operators/skipAfter'
import { mapObservable } from '../operators/mapObservable'
import { BehaviorSubject } from './BehaviorSubject'
import { EventEmitter } from './EventEmitter'
import { Observable } from './Observable'
import { Subject } from './Subject'
import { describe, test, expect, mock } from 'bun:test'

describe('observable', () => {

	test('observable', () => {
		const onCreate = mock(() => undefined)
		const onDestroy = mock(() => undefined)

		const obs = new Observable(() => {
			onCreate()

			return () => [
				onDestroy()
			]
		})

		obs.subscribe(() => {
			//
		})
			.unsubscribe()

		expect(onCreate.mock.calls.length).toEqual(1)
		expect(onDestroy.mock.calls.length).toEqual(1)
	})
	test('subject', () => {

		const cb = mock((bool: boolean) => undefined)
		const subject = new Subject<boolean>()

		subject.subscribe(cb)

		subject.next(false)

		expect(cb.mock.calls.length).toEqual(1)
		expect(cb.mock.calls[0][0]).toBeFalsy()
	})

	test('behaviorSubject', () => {
		const be = new BehaviorSubject(1)

		const cb = mock((v: number) => undefined)
		be.subscribe(cb)

		be.pipe(mapObservable(v => v * 2))
			.subscribe(cb)

		expect(cb.mock.calls.length).toEqual(2)
		expect(cb.mock.calls[0][0]).toEqual(1)
		expect(cb.mock.calls[1][0]).toEqual(2)
	})

	test('combineLatest', () => {

		const fn = mock(() => undefined)
		const list = combineLatest([
			new BehaviorSubject(1),
			new BehaviorSubject(2)
		])


		list
			.subscribe(fn)

		expect(fn.mock.calls.length).toEqual(1)
	})

	test('skipAfter', () => {
		const events = new EventEmitter<{ type: 'move' | 'up' }>()
		const mousemove = new Observable(sub => {
			return events.on('move', sub)
		})
		const mouseup = new Observable(sub => {
			return events.on('up', sub)
		})

		const mouseMoveTrigger = mock(() => undefined)
		const mouseUpTrigger = mock(() => undefined)
		mousemove.pipe(skipAfter(mouseup)).subscribe(mouseMoveTrigger)
		mouseup.subscribe(mouseUpTrigger)

		events.emit('move', {})
		events.emit('up', {})
		events.emit('move', {})
		events.emit('move', {})
		events.emit('move', {})

		expect(mouseMoveTrigger.mock.calls.length).toEqual(1)
	})

	test('switchMap', () => {
		const subject = new BehaviorSubject(1)
		const observable = subject
			.pipe(switchMap(value => {
				return new Observable<number>(sub => {
					sub(value * 2)
					return () => undefined
				})
			}))

		const sub = mock((v: number) => undefined)
		observable.subscribe(sub)

		expect(sub.mock.calls.length).toEqual(1)
		expect(sub.mock.calls[0][0]).toEqual(2)

		subject.next(2)

		expect(sub.mock.calls.length).toEqual(2)
		expect(sub.mock.calls[1][0]).toEqual(4)
	})
})
