import { State } from "./State";

export class WorkerState<T> extends State<T>{

	connect(url: string) {
		const names = this.getNames()
		const worker = new Worker(url)
		const unsubscribers = names.map(name => this.on(name, value => worker.postMessage({ name, value })))
		worker.onmessage = (event) => {
			const { name, value } = event.data
			const index = names.indexOf(name)
			const unsubscriber = unsubscribers[index]
			const subscriber = unsubscriber()
			this.set(name, value)
			subscriber()
		}

		return () => {
			unsubscribers.forEach(unsubscriber => unsubscriber())
			worker.terminate()
		}
	}

	init(self: DedicatedWorkerGlobalScope) {
		const names = this.getNames()
		const unsubscribers = names.map(name => this.on(name, value => self.postMessage({ name, value })))
		self.addEventListener('message', event => {
			const { name, value } = event.data
			const index = names.indexOf(name)
			const unsubscriber = unsubscribers[index]
			const subsciber = unsubscriber()
			this.set(name, value)
			subsciber()
		})

		return () => {
			unsubscribers.forEach(unsubscriber => unsubscriber())
			self.close()
		}
	}

}