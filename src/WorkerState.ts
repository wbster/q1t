import State from "./State";

export default class WorkerState<T> extends State<T>{

	connect(url: string) {
		const names = this.getNames()
		const worker = new Worker(url)
		const describers = names.map(name => this.on(name, value => worker.postMessage({ name, value })))
		worker.onmessage = (event) => {
			const { name, value } = event.data
			const index = names.indexOf(name)
			const describer = describers[index]
			const subsciber = describer()
			this.set(name, value)
			subsciber()
		}

		return () => {
			describers.forEach(describer => describer())
			worker.terminate()
		}
	}
	
	init(self: DedicatedWorkerGlobalScope) {
		const names = this.getNames()
		const describers = names.map(name => this.on(name, value => self.postMessage({ name, value })))
		self.addEventListener('message', event => {
			const { name, value } = event.data
			const index = names.indexOf(name)
			const describer = describers[index]
			const subsciber = describer()
			this.set(name, value)
			subsciber()
		})
		
		return () => {
			describers.forEach(describer => describer())
			self.close()
		}
	}

}