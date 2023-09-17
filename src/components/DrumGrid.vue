<template lang="html">
  <div class="grow min-h-[500px] max-h-[500px] flex flex-col" @drop="onDrop($event)" @dragenter.prevent
    @dragover.prevent>
    <transition appear name="fade" mode="out-in" tag="div" class="overflow-auto grow flex">
      <div v-if="audioStore.pattern.length">
        <span ref="scrollTargetLeft"></span>
        <div class="flex flex-col">
          <span ref="scrollTargetTop"></span>
          <transition-group appear tag="ul" name="list-fade" @before-leave="beforeLeave" class="flex flex-col relative">
            <li v-for="(track, trackIndex) in audioStore.pattern" :key="track.id" :id="track.id" class="flex"
              draggable="true" @dragstart="useStartDrag($event, track)">
              <span :id="track.id"
                class="h-12 px-2 mr-2 min-w-[150px] whitespace-nowrap overflow-hidden hidden md:flex md:grow md:items-center select-none cursor-move bg-slate-100 text-slate-500 rounded">{{
                  track.name }}</span>

              <transition-group appear tag="ul" :css="false" @before-enter="beforeEnter" @enter="enter" class="flex">
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
</template>
<script>
import gsap from 'gsap'
import { ref, watch } from 'vue'
import { useAudioStore } from '../stores/audioStore'
import useStartDrag from '../composables/useStartDrag'

export default {
  setup() {
    const audioStore = useAudioStore()
    const scrollTargetLeft = ref(null)
    const scrollTargetTop = ref(null)
    const scrollTargetRight = ref(null)
    const scrollTargetBottom = ref(null)

    const onDrop = (event) => {
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

    return {
      audioStore,
      scrollTargetLeft,
      scrollTargetTop,
      scrollTargetRight,
      scrollTargetBottom,
      onDrop,
      beforeEnter,
      enter,
      beforeLeave,
      useStartDrag
    }
  }
}
</script>
<style lang="css"></style>