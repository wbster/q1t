import type { IObservable } from "@/core/IObservable";
import { Observable } from "@/core/Observable";
import { combineLatest } from "@/methods/combineLatest";
import { distinctUntilChanged } from "@/operators/distinctUntilChanged";
import { mapObservable } from "@/operators/mapObservable";

type ObsValue<T> =
	T extends IObservable<infer U>
		? U
		: {
				[K in keyof T]: T[K] extends IObservable<infer U> ? U : never;
			};

export function computed<
	T extends IObservable<any>[] | [IObservable<any>, ...IObservable<any>[]],
	R,
>(
	observables: T,
	computeValue: (values: ObsValue<T>) => R,
	isEqualCompare?: (a: R, b: R) => boolean,
): Observable<R> {
	return combineLatest(observables)
		.pipe(mapObservable((values) => computeValue(values as ObsValue<T>)))
		.pipe(distinctUntilChanged(isEqualCompare));
}
