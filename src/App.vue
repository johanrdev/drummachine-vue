<template lang="html">
  <transition appear name="slide-fade">
    <div class="flex flex-col max-w-7xl shadow-xl border rounded-lg overflow-hidden mx-4 my-10 xl:mx-auto lg:mt-32">
      <header class="bg-slate-400 p-3">
        <span class="block font-semibold text-slate-200 text-2xl text-center select-none§">GrooveBox</span>
      </header>
      <section class="grid grid-cols-1 gap-3 md:grid-cols-12 p-3">
        <div class="flex flex-col md:col-span-3 order-1 md:order-0">
          <transition appear name="fade" mode="out-in" tag="div" @drop="onDropToSamplesList($event)" @dragenter.prevent
            @dragover.prevent>
            <accordion-item :show="true" class="mb-1 md:mb-0">
              <template v-slot:toggler>
                <font-awesome-icon :icon="['fas', 'drum']" class="mr-2"></font-awesome-icon> Samples ({{ getSamples.length
                }})
              </template>
              <div class="p-2 flex flex-col">
                <transition-group appear tag="ul" name="list-fade" class="h-[338px] overflow-y-auto relative"
                  v-if="getSamples.length">
                  <li v-for="sample in getSamples" :key="sample.id"
                    class="p-4 mb-1 last:mb-0 flex justify-between items-center border rounded border-slate-300 bg-slate-100 text-slate-500 select-none cursor-move overflow-hidden whitespace-nowrap"
                    @click="preview(sample)" draggable="true" @dragstart="startDrag($event, sample)">
                    {{ sample.name }}

                    <font-awesome-icon :icon="['fas', 'drum']" v-if="sample.previewing"></font-awesome-icon>
                    <font-awesome-icon :icon="['fas', 'music']" v-show="sample.notes.includes(1)"
                      v-else></font-awesome-icon>
                  </li>
                </transition-group>
                <div
                  class="p-2 border-2 border-dashed border-slate-200 grow flex flex-col justify-center items-center h-[338px]"
                  v-else>
                  <span class="text-slate-400 mx-4 select-none text-center">Drag samples here to add them</span>
                </div>
              </div>
            </accordion-item>
          </transition>
          <transition appear name="fade" mode="out-in" tag="div" class="md:hidden">
            <accordion-item :show="true">
              <template v-slot:toggler>
                <font-awesome-icon :icon="['fas', 'gear']" class="mr-2"></font-awesome-icon> Settings
              </template>
              <div class="p-2">
                <dl class="flex items-center text-slate-500">
                  <dt class="grow">
                    <label for="bpm">BPM:</label>
                  </dt>
                  <dd>
                    <input type="number" id="bpm" v-model="audioStore.playback.bpm.value"
                      :min="audioStore.playback.bpm.min" :max="audioStore.playback.bpm.max"
                      class="px-2 border rounded w-24 bg-slate-100 text-slate-500 outline-none" @input="updateInterval"
                      @change="updateTempo" @focus.native="$event.target.select()" />
                  </dd>
                </dl>
              </div>
            </accordion-item>
          </transition>
        </div>

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
              <button class="action-btn" :class="{ 'bg-rose-500 border-rose-700 text-white': audioStore.playback.playing }"
                @click="toggle">
                <font-awesome-icon :icon="['fas', 'play']" v-if="!audioStore.playback.playing"></font-awesome-icon>
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
                <input type="number" id="bpm" v-model="audioStore.playback.bpm.value" :min="audioStore.playback.bpm.min"
                  :max="audioStore.playback.bpm.max"
                  class="px-2 text-2xl border rounded w-24 bg-slate-100 text-slate-500 outline-none"
                  @input="updateInterval" @change="updateTempo" @focus.native="$event.target.select()" />
              </label>
            </div>
          </nav>
          <div class="grow min-h-[344px] max-h-[344px] flex flex-col" @drop="onDropToPattern($event)" @dragenter.prevent
            @dragover.prevent>
            <transition appear name="fade" mode="out-in" tag="div" class="overflow-auto grow flex">
              <div v-if="audioStore.pattern.length">
                <span ref="scrollTargetLeft"></span>
                <div class="flex flex-col">
                  <span ref="scrollTargetTop"></span>
                  <transition-group appear tag="ul" name="list-fade" @before-leave="beforeLeave"
                    class="flex flex-col relative">
                    <li v-for="(track, trackIndex) in audioStore.pattern" :key="track.id" :id="track.id" class="flex"
                      draggable="true" @dragstart="startDrag($event, track)">
                      <span :id="track.id"
                        class="h-12 px-2 mr-2 min-w-[150px] whitespace-nowrap overflow-hidden hidden md:flex md:grow md:items-center select-none cursor-move bg-slate-100 text-slate-500 rounded">{{
                          track.name }}</span>

                      <transition-group appear tag="ul" :css="false" @before-enter="beforeEnter" @enter="enter"
                        class="flex">
                    <li v-for="(_, noteIndex) in track.notes" :data-index="noteIndex" :key="noteIndex"
                      class="flex mb-1 mr-1 last:mr-0">
                      <input type="checkbox" v-model="audioStore.pattern[trackIndex].notes[noteIndex]"
                        class="w-12 h-12 border-2 border-slate-300 rounded appearance-none cursor-pointer checked:bg-teal-500 checked:border-teal-600"
                        :class="{
                          'bg-slate-200 checked:bg-teal-700 checked:border-teal-800': noteIndex === audioStore.playback.beat.value - 1,
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
  </transition>
</template>
<script>
import { Howl } from 'howler'
import Timer from './classes/Timer'
import { ref, computed, watch, onMounted } from 'vue'
import { useAudioStore } from './stores/audioStore'
import { uuid } from 'vue-uuid'
import gsap from 'gsap'
import AccordionItem from './components/AccordionItem.vue'

export default {
  setup() {
    const audioStore = useAudioStore()
    const scrollTargetLeft = ref(null)
    const scrollTargetTop = ref(null)
    const scrollTargetRight = ref(null)
    const scrollTargetBottom = ref(null)
    const filters = ref({
      dir: 'asc',
      reverse: () => audioStore.pattern.reverse(),
      shuffle: () => {
        let currentIndex = audioStore.pattern.length;
        let randomIndex;
        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          // Swap
          [
            audioStore.pattern[currentIndex],
            audioStore.pattern[randomIndex]
          ] =
            [
              audioStore.pattern[randomIndex],
              audioStore.pattern[currentIndex]
            ];
        }
      },
      sort: () => {
        if (filters.value.dir === 'asc') {
          audioStore.pattern.sort((a, b) => a.name < b.name);
        }
        else {
          audioStore.pattern.sort((a, b) => a.name > b.name);
        }
        filters.value.dir = filters.value.dir === 'asc' ? 'desc' : 'asc';
      }
    })
    const term = ref('')
    const repeat = () => {
      if (audioStore.playback.beat.value >= audioStore.playback.beat.max) {
        audioStore.playback.beat.value = 0
      }
      audioStore.pattern.forEach((track) => {
        if (track.notes[audioStore.playback.beat.value] === 1) {
          howl.play(track.slug)
        }
      });
      audioStore.playback.beat.value += 1
    }
    const toggle = () => {
      if (!audioStore.playback.playing) {
        timer.start()
      }
      else {
        timer.stop()
      }
      audioStore.playback.playing = !audioStore.playback.playing
    }
    const stop = () => {
      audioStore.playback.playing = false
      audioStore.playback.beat.value = 0
      timer.stop()
    }
    const rewind = () => {
      audioStore.playback.beat.value = 0
    }
    const updateTempo = () => {
      if (audioStore.playback.bpm.value < audioStore.playback.bpm.min) {
        audioStore.playback.bpm.value = audioStore.playback.bpm.min
      }
      if (audioStore.playback.bpm.value > audioStore.playback.bpm.max) {
        audioStore.playback.bpm.value = audioStore.playback.bpm.max
      }
      timer.updateInterval((60000 / audioStore.playback.bpm.value) / 4)
    }
    const updateInterval = () => {
      if (audioStore.playback.bpm.value < audioStore.playback.bpm.min)
        return
      if (audioStore.playback.bpm.value > audioStore.playback.bpm.max)
        return
      timer.updateInterval((60000 / audioStore.playback.bpm.value) / 4)
    }
    const preview = (sample) => {
      sample.howl = new Howl(audioStore.audioSource)
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
      const sample = audioStore.samples.find(s => s.id === id)
      const sourceIndex = audioStore.pattern.findIndex(t => t.id === id)
      const targetIndex = audioStore.pattern.findIndex(t => t.id === event.target.id)
      if (audioStore.pattern.find(t => t.id === id)) {
        if (!event.target.id) return
        // Swap
        [
          audioStore.pattern[sourceIndex],
          audioStore.pattern[targetIndex]
        ] =
          [
            audioStore.pattern[targetIndex],
            audioStore.pattern[sourceIndex]
          ]
      }
      // Add/remove
      if (sample) {
        const index = audioStore.samples.findIndex(s => s.id === id)
        audioStore.pattern.push(audioStore.samples[index])
        audioStore.samples.splice(index, 1)
      }
    }
    const onDropToSamplesList = (event) => {
      const id = event.dataTransfer.getData('id')
      const track = audioStore.pattern.find(t => t.id === id)
      if (track) {
        const index = audioStore.pattern.findIndex(t => t.id === id)
        audioStore.samples.push(track)
        audioStore.pattern.splice(index, 1)
      }
    }
    watch(() => audioStore.playback.beat.value, (val) => {
      if (val == null || val == undefined)
        return
      if (val > audioStore.playback.beat.max / 2) {
        scrollTargetRight.value?.scrollIntoView({ behavior: 'smooth' })
      } else {
        scrollTargetLeft.value?.scrollIntoView({ behavior: 'instant' })
      }
    })
    watch(() => audioStore.pattern.length, (newVal, oldVal) => {
      if (!newVal || !oldVal) return

      if (newVal > oldVal) {
        setTimeout(() => scrollTargetBottom.value?.scrollIntoView({ behavior: 'smooth' }), 250)
      } else {
        setTimeout(() => scrollTargetTop.value?.scrollIntoView({ behavior: 'smooth' }), 250)
      }
    })
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
    const beforeLeave = (el) => {
      const { marginLeft, marginTop, width, height } = window.getComputedStyle(el)
      el.style.left = `${el.offsetLeft - parseFloat(marginLeft, 10)}px`
      el.style.top = `${el.offsetTop - parseFloat(marginTop, 10)}px`
      el.style.width = width
      el.style.height = height
    }
    const getSamples = computed(() => audioStore.samples.filter(s => s.name.toLowerCase().includes(term.value.toLowerCase())).sort((a, b) => a.name > b.name))
    const howl = new Howl(audioStore.audioSource)
    const timer = new Timer(repeat, (60000 / audioStore.playback.bpm.value) / 4)
    audioStore.samples = Object.keys(audioStore.audioSource.sprite).map((sample) => {
      return {
        id: uuid.v1(),
        name: sample.replaceAll('-', ' '),
        slug: sample,
        notes: Array(16).fill(0),
        previewing: false
      }
    })
    return {
      audioStore,
      toggle,
      stop,
      rewind,
      updateTempo,
      updateInterval,
      filters,
      term,
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
      enter,
      beforeLeave
    }
  },
  components: { AccordionItem }
}
</script>
<style lang="css">
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

#app {
  font-family: 'Poppins';
}

/* Transition: Slide Fade */
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-100px)
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 1s ease-in-out;
}

/* Transition: Fade */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .4s ease-in-out;
}

/* Transition: Fade List */
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