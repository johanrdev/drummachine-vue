<template lang="html">
  <transition appear name="fade" mode="out-in" tag="div">
    <accordion-item :show="true">
      <template v-slot:toggler>
        <font-awesome-icon :icon="['fas', 'gear']" class="mr-2"></font-awesome-icon> Settings
      </template>
      <div class="p-2">
        <dl class="grid grid-cols-2 text-slate-500">
          <dt class="mb-1">
            <label for="bpm">BPM:</label>
          </dt>
          <dd class="mb-1 text-right">
            <input type="number" id="bpm" v-model="audioStore.playback.bpm.value" :min="audioStore.playback.bpm.min"
              :max="audioStore.playback.bpm.max" class="px-2 border rounded w-24 bg-slate-100 text-slate-500 outline-none"
              @input="audioStore.updateInterval" @change="audioStore.updateTempo" @focus.native="$event.target.select()" />
          </dd>
          <dt class="mb-1">
            <label for="volume">Volume:</label>
          </dt>
          <dd class="mb-1 text-right">
            <input type="range" min="0" max="1" step="0.01" v-model="audioStore.playback.stereo.volume" class="w-full" @input="audioStore.updateVolume" />
          </dd>
          <dt class="mb-1">
            <label for="panning">Panning:</label>
          </dt>
          <dt class="mb-1 text-right">
            <input type="range" min="-1" max="1" step="0.01" v-model="audioStore.playback.stereo.panning" class="w-full" @input="audioStore.updatePanning" />
          </dt>
        </dl>
      </div>
    </accordion-item>
  </transition>
</template>
<script>
import { useAudioStore } from '../stores/audioStore'
import AccordionItem from './AccordionItem.vue'

export default {
  components: { AccordionItem },
  setup() {
    const audioStore = useAudioStore()

    return {
      audioStore
    }
  }
}
</script>
<style lang="css">
  
</style>