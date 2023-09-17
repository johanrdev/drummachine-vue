<template lang="html">
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
          class="px-2 text-2xl border rounded w-24 bg-slate-100 text-slate-500 outline-none" @input="audioStore.updateInterval"
          @change="audioStore.updateTempo" @focus.native="$event.target.select()" />
      </label>
    </div>
  </nav>
</template>
<script>
import Timer from '../classes/Timer'
import { Howl } from 'howler'
import { ref } from 'vue'
import { useAudioStore } from '../stores/audioStore'

export default {
  setup() {
    const audioStore = useAudioStore()
    
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
        audioStore.timer.start()
      }
      else {
        audioStore.timer.stop()
      }
      audioStore.playback.playing = !audioStore.playback.playing
    }
    
    const stop = () => {
      audioStore.playback.playing = false
      audioStore.playback.beat.value = 0
      audioStore.timer.stop()
    }

    const rewind = () => {
      audioStore.playback.beat.value = 0
    }

    const howl = new Howl(audioStore.audioSource)
    audioStore.timer = new Timer(repeat, (60000 / audioStore.playback.bpm.value) / 4)

    return {
      audioStore,
      filters,
      toggle,
      stop,
      rewind
    }
  }
}
</script>
<style lang="css"></style>