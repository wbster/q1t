import { IObservable } from './IObservable'
import { Observable } from './Observable'
import { Subscription } from './Subscription'


export class Subject<E> implements IObservable<E> {

	protected inited = false
	protected subs = [] as ((e: E) => void)[]
	protected value: E | undefined = undefined

	next(value: E) {
		this.inited = true
		this.value = value
		this.subs.forEach(sub => {
			sub(value)
		})
	}

	/**
	 * @example const subscription = subject.subscribe(value => console.log(value))
	 * subject.next('newValue') // console.log('newValue")
	 * subscription.unsubscribe()
	 */
	subscribe(cb: (event: E) => void) {
		this.subs.push(cb)
		if (this.inited) cb(this.value as E)
		return new Subscription(() => {
			this.subs = this.subs.filter(h => h !== cb)
		})
	}

	pipe<R>(operator: (obs: Observable<E>) => Observable<R>): Observable<R> {
		return new Observable<E>(sub => {
			const subscription = this.subscribe(value => {
				sub(value)
			})
			return () => subscription.unsubscribe()
		}).pipe(operator)
	}

	connect(obs: Observable<E>) {
		return obs.subscribe(value => this.next(value))
	}
}
