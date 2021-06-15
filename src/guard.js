export class Guard {
  constructor(name) {
    this.name = name || 'UntitledGuard'
  }

  promise(context) {
    return new Promise((resolve, reject) => {
      this.handle(resolve, reject, context)
    })
  }

  get canLog() {
    const logMethod = 'logPromiseOutcomes'
    return this[logMethod] && typeof this[logMethod] === 'function' && this[logMethod]()
  }

  logResolution({ from, to }) {
    this.canLog && console.info(`${this.name}.resolved: ${from.path} → ${to.path}`)
  }

  logRejection({ from, to }, rejection) {
    this.canLog && console.warn(`${this.name}.rejected: ${from.path} → ${to.path} with:`, rejection)
  }

  handle(resolve) {
    console.warn('Guards must implement the handle() method.')
    resolve()
  }
}
