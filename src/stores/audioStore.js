import { defineStore } from 'pinia'

export const useAudioStore = defineStore('audioStore', {
  state: () => ({
    search: '',
    howl: null,
    timer: null,
    playback: {
      playing: false,
      bpm: {
        value: 120,
        min: 30,
        max: 300
      },
      beat: {
        value: 0,
        max: 16
      },
      stereo: {
        volume: 0.5,
        panning: 0
      }
    },
    samples: [],
    pattern: [],
    audioSource: {
      'src': [
        '../assets/sprites/drums.webm',
        '../assets/sprites/drums.mp3'
      ],
      'sprite': {
        'Closed-Hihat-01': [
          0,
          720.7256235827665
        ],
        'Closed-Hihat-02': [
          2000,
          862.3809523809523
        ],
        'Closed-Hihat-03': [
          4000,
          889.5691609977323
        ],
        'Closed-Hihat-04': [
          6000,
          817.8458049886625
        ],
        'Closed-Hihat-05': [
          8000,
          884.7392290249427
        ],
        'Closed-Hihat-06': [
          10000,
          936.7573696145133
        ],
        'Closed-Hihat-07': [
          12000,
          961.6326530612245
        ],
        'Closed-Hihat-08': [
          14000,
          905.0793650793647
        ],
        'Closed-Hihat-09': [
          16000,
          848.7755102040815
        ],
        'Kick-01': [
          18000,
          879.3877551020408
        ],
        'Kick-02': [
          20000,
          860.5442176870746
        ],
        'Kick-03': [
          22000,
          1090.1587301587306
        ],
        'Kick-04': [
          25000,
          1116.3492063492058
        ],
        'Kick-05': [
          28000,
          887.777777777778
        ],
        'Kick-06': [
          30000,
          1216.7120181405905
        ],
        'Kick-07': [
          33000,
          1226.0090702947864
        ],
        'Kick-08': [
          36000,
          1375.9863945578204
        ],
        'Open-Hihat-01': [
          39000,
          870.4761904761895
        ],
        'Open-Hihat-02': [
          41000,
          4765.464852607707
        ],
        'Open-Hihat-03': [
          47000,
          1115.0340136054454
        ],
        'Open-Hihat-04': [
          50000,
          1061.9501133786855
        ],
        'Open-Hihat-05': [
          53000,
          1114.7392290249413
        ],
        'Open-Hihat-06': [
          56000,
          2104.4444444444466
        ],
        'Open-Hihat-07': [
          60000,
          7591.655328798182
        ],
        'Pedal-Hihat-01': [
          69000,
          571.6553287981867
        ],
        'Pedal-Hihat-02': [
          71000,
          492.244897959182
        ],
        'Pedal-Hihat-03': [
          73000,
          5191.63265306122
        ],
        'Pedal-Hihat-04': [
          80000,
          5065.600907029477
        ],
        'Snare-01': [
          87000,
          860.6575963718797
        ],
        'Snare-02': [
          89000,
          1098.6167800453472
        ],
        'Snare-03': [
          92000,
          1267.9365079365111
        ],
        'Snare-04': [
          95000,
          1248.2539682539623
        ],
        'Snare-05': [
          98000,
          1191.519274376418
        ]
      }
    }
  }),
  getters: {
    getSamples: (state) => {
      return state.samples.filter(s => s.name.toLowerCase().includes(state.search.toLowerCase())).sort((a, b) => a.name > b.name)
    }
  },
  actions: {
    updateTempo() {
      if (this.playback.bpm.value < this.playback.bpm.min) {
        this.playback.bpm.value = this.playback.bpm.min
      }

      if (this.playback.bpm.value > this.playback.bpm.max) {
        this.playback.bpm.value = this.playback.bpm.max
      }

      this.timer.updateInterval((60000 / this.playback.bpm.value) / 4)
    },
    updateInterval() {
      if (this.playback.bpm.value < this.playback.bpm.min) return
      if (this.playback.bpm.value > this.playback.bpm.max) return

      this.timer.updateInterval((60000 / this.playback.bpm.value) / 4)
    },
    updateVolume() {
      this.howl.volume(this.playback.stereo.volume)
    },
    updatePanning() {
      this.howl.stereo(parseFloat(this.playback.stereo.panning))
    }
  }
})