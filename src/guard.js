export class Guard {
  constructor(name) {
    this._name = name
  }

  _promise(context) {
    return new Promise((resolve, reject) => {
      this.handle(resolve, reject, context)
    })
  }

  _canLog() {
    const logMethod = 'logPromiseOutcomes'

    return this[logMethod] && typeof this[logMethod] === 'function' && this[logMethod]()
  }

  _logResolution({ from, to }) {
    if (this._canLog()) console.info(`${this.name()}.resolved: ${from.path} → ${to.path}`)
  }

  _logRejection({ from, to }, rejection) {
    if (this._canLog()) console.warn(`${this.name()}.rejected: ${from.path} → ${to.path} with:`, rejection)
  }

  name() {
    return this._name || 'UntitledGuard'
  }

  handle(resolve) {
    console.warn('Guards must implement the handle() method.')
    resolve()
  }
}
