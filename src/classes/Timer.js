export default class Timer {
  running
  callback
  interval
  time
  timeout

  constructor(callback, interval) {
    this.callback = callback
    this.interval = interval
  }

  start = () => {
    this.running = true
    this.stop()
    this.time = Date.now() + this.interval
    this.timeout = setTimeout(this.repeat, this.interval)

    console.log(this.running)
  }

  stop = () => {
    this.running = false
    clearTimeout(this.timeout)
  }

  updateInterval = (interval) => {
    this.interval = interval
  }

  repeat = () => {
    let drift = Date.now() - this.time
    this.callback()
    this.time += this.interval
    this.timeout = setTimeout(this.repeat, this.interval - drift)
  }
}