<template lang="html">
  <div class="relative my-32">
    <button @click="play" class="block w-24 h-12 mx-auto border rounded border-gray-400 bg-gray-200">Play</button>
  </div>
</template>
<script>
import { Howl } from 'howler'
import Timer from './classes/Timer'

export default {
  setup() {
    const sprite = {
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

    const playback = {
      bpm: 120,
      beat: {
        value: 0,
        max: 16
      }
    }

    const pattern = [
      { name: 'Closed-Hihat-01', notes: [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1] },
      { name: 'Snare-01', notes: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0] },
      { name: 'Kick-02', notes: [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0] }
    ]

    const repeat = () => {
      if (playback.beat.value >= playback.beat.max) {
        playback.beat.value = 0
      }

      pattern.forEach((track) => {
        if (track.notes[playback.beat.value] === 1) {
          howl.play(track.name)
        }
      }) 

      playback.beat.value += 1
    }

    const play = () => {
      timer.start()
    }

    const howl = new Howl(sprite)
    const timer = new Timer(repeat, (60000 / playback.bpm) / 4)

    return { 
      play
    }
  }
}
</script>
<style lang="css"></style>