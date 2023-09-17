<template lang="html">
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
            <input type="number" id="bpm" v-model="audioStore.playback.bpm.value" :min="audioStore.playback.bpm.min"
              :max="audioStore.playback.bpm.max" class="px-2 border rounded w-24 bg-slate-100 text-slate-500 outline-none"
              @input="audioStore.updateInterval" @change="audioStore.updateTempo" @focus.native="$event.target.select()" />
          </dd>
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