export class Signal {
	private promise: Promise<void>
	private resolver?: () => void

	constructor(startAsFinished: boolean = false) {
		if (startAsFinished) {
			this.promise = Promise.resolve()
			this.resolver = () => {}
		} else {
			this.promise = new Promise<void>((res) => {
				this.resolver = res
			})
		}
	}
	finish() {
		if (!this.resolver) {
			return
		}
		this.resolver()
	}
	completed(): Promise<void> {
		return this.promise
	}
}
