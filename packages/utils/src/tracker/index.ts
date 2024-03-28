import uuid from '../uuid'

type Resolve = (value: any) => void
interface Params {
  [key: string]: any
}
interface TrackerOptions {
  url: string
  batchingDelay: number
  formatter: (paramsList: Params[]) => unknown
}

const DEFAULT_OPTIONS = {
  batchingDelay: 200,
  formatter: (x: Params[]) => x
}

export default class Tracker<S extends Params> {
  options: TrackerOptions
  trackMap: Record<string, S>
  resolves: Resolve[]
  idQueue: string[]
  constructor(opts: Partial<TrackerOptions>) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...opts
    } as TrackerOptions
    this.trackMap = {}
    this.resolves = []
    this.idQueue = []
  }

  public track(params: S, instant = false) {
    const trackID = uuid()
    if (instant) {
      const trackParams = this.makeTrackParams(trackID, params)
      this.request([trackParams])
    } else {
      this.batchingTrack(trackID, params)
    }
  }

  private batchingTrack(trackID: string, params: S) {
    const { batchingDelay } = this.options
    return new Promise(resolve => {
      this.resolves.push(resolve)
      this.trackMap[trackID] = this.makeTrackParams(trackID, params)

      if (this.idQueue.push(trackID) === 1) {
        setTimeout(() => {
          this.request(this.idQueue.map(id => this.trackMap[id]))
          this.resolves.forEach(fn => {
            fn(undefined)
          })
          this.resolves = []
          this.idQueue = []
        }, batchingDelay)
      }
    })
  }

  private makeTrackParams(id: string, params: S) {
    return {
      id,
      timestamp: new Date().getTime(),
      ...params
    }
  }

  private request(paramsList: S[]) {
    const { url } = this.options
    try {
      navigator.sendBeacon(url, JSON.stringify(this.options.formatter(paramsList)))
    } catch (error) {
      console.error('sendBeacon error: ', error)
    }
  }
}
