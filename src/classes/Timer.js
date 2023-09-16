export default class Timer {
  callback
  interval
  time
  timeout

  constructor(callback, interval) {
    this.callback = callback
    this.interval = interval
  }

  start = () => {
    this.stop()
    this.time = Date.now() + this.interval
    this.timeout = setTimeout(this.repeat, this.interval)
  }

  stop = () => {
    clearTimeout(this.timeout)
  }

  repeat = () => {
    let drift = Date.now() - this.time
    this.callback()
    this.time += this.interval
    this.timeout = setTimeout(this.repeat, this.interval - drift)
  }
}