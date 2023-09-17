<template lang="html">
  <div class="flex flex-col max-w-7xl shadow-xl border rounded-lg overflow-hidden mx-4 my-10 xl:mx-auto lg:mt-32">
    <header class="bg-slate-400 p-3">
      <span class="block font-semibold text-slate-200 text-2xl text-center select-none§">GrooveBox</span>
    </header>
    <section class="grid grid-cols-1 gap-3 md:grid-cols-12 p-3">
      <transition appear name="fade" mode="out-in" tag="div"
        class="h-[396px] flex flex-col md:col-span-3 order-1 md:order-0" @drop="onDropToSamplesList($event)"
        @dragenter.prevent @dragover.prevent>
        <div v-if="getSamples.length">
          <label for="search" class="block mb-2">
            <input type="text" v-model="term" class="border rounded p-2 w-full" placeholder="Search sample" />
          </label>
          <transition-group appear tag="ul" name="list-fade" class="overflow-y-auto grow relative">
            <li v-for="sample in getSamples" :key="sample.id" class="mb-1 last:mb-0" draggable="true"
              @dragstart="startDrag($event, sample)">
              <div
                class="p-4 border-2 border-slate-300 rounded bg-slate-100 text-slate-500 cursor-move select-none flex justify-between items-center overflow-hidden whitespace-nowrap"
                @click="preview(sample)">
                <span>{{ sample.name }}</span>
                <font-awesome-icon :icon="['fas', 'drum']" v-if="sample.previewing"></font-awesome-icon>
                <font-awesome-icon :icon="['fas', 'music']" v-else v-show="sample.notes.includes(1)"></font-awesome-icon>
              </div>
            </li>
          </transition-group>
        </div>
        <div class="border-2 border-dashed border-slate-200 grow flex flex-col justify-center items-center" v-else>
          <span class="text-slate-400 mx-4 select-none text-center">Drag samples here to add them</span>
        </div>
      </transition>
      <div class="md:col-span-9 order-0 md:order-1 flex flex-col">
        <nav class="grid md:grid-cols-3 md:grid-cols-3 gap-3 mb-3">
          <div class="md-col-start-1 md:flex justify-start gap-1 hidden">
            <button class="action-btn" @click="filters.reverse">
              <font-awesome-icon :icon="['fas', 'arrows-rotate']"></font-awesome-icon>
            </button>
            <button class="action-btn" @click="filters.shuffle">
              <font-awesome-icon :icon="['fas', 'shuffle']"></font-awesome-icon>
            </button>
            <button class="action-btn" @click="filters.sort">
              <font-awesome-icon
                :icon="['fas', filters.dir === 'asc' ? 'arrow-down-z-a' : 'arrow-down-a-z']"></font-awesome-icon>
            </button>
          </div>
          <div class="md:col-start-2 flex justify-center gap-1">
            <button class="action-btn" :class="{ 'bg-rose-500 text-white': playback.playing }" @click="toggle">
              <font-awesome-icon :icon="['fas', 'play']" v-if="!playback.playing"></font-awesome-icon>
              <font-awesome-icon :icon="['fas', 'pause']" v-else></font-awesome-icon>
            </button>
            <button class="action-btn" @click="stop">
              <font-awesome-icon :icon="['fas', 'stop']"></font-awesome-icon>
            </button>
            <button class="action-btn" @click="rewind">
              <font-awesome-icon :icon="['fas', 'backward']"></font-awesome-icon>
            </button>
          </div>
          <div class="md-col-start-3 md:flex justify-end gap-1 hidden">
            <label for="bpm" class="flex">
              <input type="number" id="bpm" v-model="playback.bpm.value" :min="playback.bpm.min" :max="playback.bpm.max"
                class="px-2 text-2xl rounded w-24 bg-slate-100 text-slate-500 outline-none" @input="updateInterval"
                @change="updateTempo" @focus.native="$event.target.select()" />
            </label>
          </div>
        </nav>
        <div class="grow min-h-[344px] max-h-[344px] flex flex-col" @drop="onDropToPattern($event)" @dragenter.prevent
          @dragover.prevent>
          <transition appear name="fade" mode="out-in" tag="div" class="overflow-auto grow flex">
            <div v-if="pattern.length">
              <span ref="scrollTargetLeft"></span>
              <div class="flex flex-col">
                <span ref="scrollTargetTop"></span>
                <transition-group appear tag="ul" name="list-fade" class="flex flex-col relative">
                  <li v-for="(track, trackIndex) in pattern" :key="track.id" :id="track.id" class="flex" draggable="true"
                    @dragstart="startDrag($event, track)">
                    <span :id="track.id"
                      class="h-12 px-2 mr-2 min-w-[150px] whitespace-nowrap overflow-hidden hidden md:flex md:grow md:items-center select-none cursor-move bg-slate-100 text-slate-500 rounded">{{
                        track.name }}</span>

                    <transition-group appear tag="ul" :css="false" @before-enter="beforeEnter" @enter="enter"
                      class="flex">
                  <li v-for="(_, noteIndex) in track.notes" :data-index="noteIndex" :key="noteIndex"
                    class="flex mb-1 mr-1 last:mr-0">
                    <input type="checkbox" v-model="pattern[trackIndex].notes[noteIndex]"
                      class="w-12 h-12 border-2 border-slate-300 rounded appearance-none cursor-pointer checked:bg-teal-500 checked:border-teal-600"
                      :class="{
                        'bg-slate-200 checked:bg-teal-700 checked:border-teal-800': noteIndex === playback.beat.value - 1,
                        'bg-slate-100': noteIndex % 4 === 0,
                      }" :false-value="0" :true-value="1" @keydown.prevent />
                  </li>
                  </transition-group>
                  </li>
                </transition-group>
                <span ref="scrollTargetBottom"></span>
              </div>
              <span ref="scrollTargetRight"></span>
            </div>
            <div class="border-2 border-dashed border-slate-200 grow flex flex-col justify-center items-center" v-else>
              <span class="text-slate-400 mx-4 select-none text-center">Drag samples here to add them</span>
            </div>
          </transition>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { Howl } from 'howler'
import Timer from './classes/Timer'
import { ref, computed, watch, onMounted } from 'vue'
import { uuid } from 'vue-uuid'
import gsap from 'gsap'

export default {
  setup() {
    const audioSource = {
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

    const samples = ref([])

    const pattern = ref([])

    const scrollTargetLeft = ref(null)
    const scrollTargetTop = ref(null)
    const scrollTargetRight = ref(null)
    const scrollTargetBottom = ref(null)

    const filters = ref({
      dir: 'asc',
      reverse: () => pattern.value.reverse(),
      shuffle: () => {
        let currentIndex = pattern.value.length
        let randomIndex

        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex)
          currentIndex--

          // Swap
          [
            pattern.value[currentIndex],
            pattern.value[randomIndex]
          ] =
            [
              pattern.value[randomIndex],
              pattern.value[currentIndex]
            ]
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

    const term = ref('')

    const repeat = () => {
      if (playback.value.beat.value >= playback.value.beat.max) {
        playback.value.beat.value = 0
      }

      pattern.value.forEach((track) => {
        if (track.notes[playback.value.beat.value] === 1) {
          howl.play(track.slug)
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

    const preview = (sample) => {
      sample.howl = new Howl(audioSource)
      sample.howl.play(sample.slug)
      sample.howl.on('play', () => sample.previewing = true)
      sample.howl.on('end', () => sample.previewing = false)
      delete sample.howl
    }

    const startDrag = (event, item) => {
      event.dataTransfer.setData('id', item.id)
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
    }

    const onDropToPattern = (event) => {
      const id = event.dataTransfer.getData('id')
      const sample = samples.value.find(s => s.id === id)
      const sourceIndex = pattern.value.findIndex(t => t.id === id)
      const targetIndex = pattern.value.findIndex(t => t.id === event.target.id)

      if (pattern.value.find(t => t.id === id)) {
        if (!event.target.id) return

        // Swap
        [
          pattern.value[sourceIndex],
          pattern.value[targetIndex]
        ] =
          [
            pattern.value[targetIndex],
            pattern.value[sourceIndex]
          ]
      }

      // Add/remove
      if (sample) {
        const index = samples.value.findIndex(s => s.id === id)
        pattern.value.push(samples.value[index])
        samples.value.splice(index, 1)
      }
    }

    const onDropToSamplesList = (event) => {
      const id = event.dataTransfer.getData('id')
      const track = pattern.value.find(t => t.id === id)

      if (track) {
        const index = pattern.value.findIndex(t => t.id === id)
        samples.value.push(track)
        pattern.value.splice(index, 1)
      }
    }

    watch(() => playback.value.beat.value, (val) => {
      if (val == null || val == undefined) return

      if (val > playback.value.beat.max / 2) {
        scrollTargetRight.value?.scrollIntoView({ behavior: 'smooth' })
      } else {
        scrollTargetLeft.value?.scrollIntoView({ behavior: 'instant' })
      }
    })

    // watch(() => pattern.value.length, (newVal, oldVal) => {
    //   if (!newVal || !oldVal) return

    //   if (newVal > oldVal) {
    //     setTimeout(() => scrollTargetBottom.value?.scrollIntoView({ behavior: 'smooth' }), 250)
    //   }
    //   else {
    //     setTimeout(() => scrollTargetTop.value?.scrollIntoView({ behavior: 'smooth' }), 250)
    //   }
    // })

    const initialScrollWatch = watch(() => scrollTargetLeft.value, (val) => {
      if (val) {
        scrollTargetLeft.value?.scrollIntoView({ behavior: 'smooth' })

        // Removes the watcher
        initialScrollWatch()
      }
    })

    const beforeEnter = (el) => {
      el.style.opacity = 0
    }

    const enter = (el, done) => {
      gsap.to(el, {
        opacity: 1,
        delay: 0.075 * el.dataset.index,
        onComplete: done
      })
    }

    const getSamples = computed(() => samples.value.filter(s => s.name.toLowerCase().includes(term.value.toLowerCase())).sort((a, b) => a.name > b.name))
    const howl = new Howl(audioSource)
    const timer = new Timer(repeat, (60000 / playback.value.bpm.value) / 4)

    samples.value = Object.keys(audioSource.sprite).map((sample) => {
      return {
        id: uuid.v1(),
        name: sample.replaceAll('-', ' '),
        slug: sample,
        notes: Array(16).fill(0),
        previewing: false
      }
    })

    return {
      playback,
      toggle,
      stop,
      rewind,
      updateTempo,
      updateInterval,
      filters,
      term,
      pattern,
      getSamples,
      preview,
      startDrag,
      onDropToPattern,
      onDropToSamplesList,
      scrollTargetLeft,
      scrollTargetTop,
      scrollTargetRight,
      scrollTargetBottom,
      beforeEnter,
      enter
    }
  }
}
</script>
<style lang="css">
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

#app {
  font-family: 'Poppins';
}

/* Transition - Fade */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .4s ease-in-out;
}

/* Transition - Fade List */
.list-fade-enter-from,
.list-fade-leave-to {
  opacity: 0;
}

.list-fade-move,
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all .4s ease-in-out;
}

.list-fade-enter-to,
.list-fade-leave-from {
  opacity: 1;
}

.list-fade-leave-active {
  position: absolute;
  width: 100%;
}
</style>