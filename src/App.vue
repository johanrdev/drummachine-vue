<template lang="html">
  <div class="flex flex-col max-w-7xl shadow-xl border rounded-lg overflow-hidden mx-4 my-10 xl:mx-auto lg:mt-32">
    <header class="bg-slate-400 p-3">
      <span class="block font-semibold text-slate-200 text-2xl text-center">GrooveBox</span>
    </header>
    <section class="grid grid-cols-1 gap-3 md:grid-cols-12 p-3">
      <div class="border md:col-span-3 order-1 md:order-0 p-3">
        <span>Section 1</span>
      </div>
      <div class="md:col-span-9 order-0 md:order-1">
        <nav class="grid md:grid-cols-3 md:grid-cols-3 gap-3 mb-3">
          <div class="md-col-start-1 md:flex justify-start gap-1 hidden">
            <button class="w-full md:w-10 h-10 block border rounded select-none" @click="filters.reverse">
              <font-awesome-icon :icon="['fas', 'arrows-rotate']"></font-awesome-icon>
            </button>
            <button class="w-full md:w-10 h-10 block border rounded select-none" @click="filters.shuffle">
              <font-awesome-icon :icon="['fas', 'shuffle']"></font-awesome-icon>
            </button>
            <button class="w-full md:w-10 h-10 block border rounded select-none" @click="filters.sort">
              <font-awesome-icon
                :icon="['fas', filters.dir === 'asc' ? 'arrow-down-z-a' : 'arrow-down-a-z']"></font-awesome-icon>
            </button>
          </div>
          <div class="md:col-start-2 flex justify-center gap-1">
            <button class="w-full md:w-10 h-10 border rounded" @click="toggle">
              <font-awesome-icon :icon="['fas', 'play']" v-if="!playback.playing"></font-awesome-icon>
              <font-awesome-icon :icon="['fas', 'pause']" v-else></font-awesome-icon>
            </button>
            <button class="w-full md:w-10 h-10 border rounded" @click="stop">
              <font-awesome-icon :icon="['fas', 'stop']"></font-awesome-icon>
            </button>
            <button class="w-full md:w-10 h-10 border rounded" @click="rewind">
              <font-awesome-icon :icon="['fas', 'backward']"></font-awesome-icon>
            </button>
          </div>
          <div class="md-col-start-3 md:flex justify-end gap-1 hidden">
            <label for="bpm">
              <input type="number" id="bpm" v-model="playback.bpm.value" :min="playback.bpm.min" :max="playback.bpm.max" class="px-2 text-2xl font-semibold border-2 rounded w-24" @input="updateInterval" @change="updateTempo" />
            </label>
          </div>
        </nav>
        <div class="border p-3">
          <ul class="overflow-auto h-80">
            <li v-for="(track, trackIndex) in pattern" class="flex">
              <span
                class="h-12 px-2 mr-1 min-w-[150px] whitespace-nowrap overflow-hidden border hidden md:flex md:grow md:items-center select-none cursor-move">{{
                  track.name }}</span>

              <ul class="flex">
                <li v-for="(_, noteIndex) in track.notes" class="mr-1 last:mr-0">
                  <input type="checkbox" v-model="pattern[trackIndex].notes[noteIndex]"
                    class="w-12 h-12 border-2 border-slate-300 rounded appearance-none cursor-pointer checked:bg-teal-500 checked:border-teal-600"
                    :class="{ 'bg-slate-200 checked:bg-teal-600': noteIndex === playback.beat.value - 1 }"
                    :false-value="0" :true-value="1" @keydown.prevent />
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { Howl } from 'howler'
import Timer from './classes/Timer'
import { ref } from 'vue'

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

    const playback = ref({
      playing: false,
      bpm: {
        value: 120,
        min: 30,
        max: 300
      },
      beat: {
        value: 0,
        max: 16
      }
    })

    const pattern = ref([
      {
        name: 'Closed-Hihat-01',
        notes: [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1]
      },
      {
        name: 'Snare-01',
        notes: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
      },
      {
        name: 'Kick-02',
        notes: [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0]
      }
    ])

    const filters = ref({
      dir: 'asc',
      reverse: () => pattern.value.reverse(),
      shuffle: () => {
        let currentIndex = pattern.value.length
        let randomIndex

        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex)
          currentIndex--

          [pattern.value[currentIndex], pattern.value[randomIndex]] = [pattern.value[randomIndex], pattern.value[currentIndex]]
        }
      },
      sort: () => {
        if (filters.value.dir === 'asc') {
          pattern.value.sort((a, b) => a.name < b.name)
        } else {
          pattern.value.sort((a, b) => a.name > b.name)
        }

        filters.value.dir = filters.value.dir === 'asc' ? 'desc' : 'asc'
      }
    })

    const repeat = () => {
      if (playback.value.beat.value >= playback.value.beat.max) {
        playback.value.beat.value = 0
      }

      pattern.value.forEach((track) => {
        if (track.notes[playback.value.beat.value] === 1) {
          howl.play(track.name)
        }
      })

      playback.value.beat.value += 1
    }

    const toggle = () => {
      if (!playback.value.playing) {
        timer.start()
      } else {
        timer.stop()
      }

      playback.value.playing = !playback.value.playing
    }

    const stop = () => {
      playback.value.playing = false
      playback.value.beat.value = 0
      timer.stop()
    }

    const rewind = () => {
      playback.value.beat.value = 0
    }

    const updateTempo = () => {
      if (playback.value.bpm.value < playback.value.bpm.min) {
        playback.value.bpm.value = playback.value.bpm.min
      }

      if (playback.value.bpm.value > playback.value.bpm.max) {
        playback.value.bpm.value = playback.value.bpm.max
      }

      timer.updateInterval((60000 / playback.value.bpm.value) / 4)
    }

    const updateInterval = () => {
      if (playback.value.bpm.value < playback.value.bpm.min) return
      if (playback.value.bpm.value > playback.value.bpm.max) return

      timer.updateInterval((60000 / playback.value.bpm.value) / 4)
    }

    const howl = new Howl(sprite)
    const timer = new Timer(repeat, (60000 / playback.value.bpm.value) / 4)

    return {
      playback,
      toggle,
      stop,
      rewind,
      updateTempo,
      updateInterval,
      filters,
      pattern
    }
  }
}
</script>
<style lang="css"></style>