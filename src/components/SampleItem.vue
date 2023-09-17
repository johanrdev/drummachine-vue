<template lang="html">
  <li class="p-4 mb-1 last:mb-0 flex justify-between items-center border rounded border-slate-300 bg-slate-100 text-slate-500 select-none cursor-move overflow-hidden whitespace-nowrap" @click="preview(sample)">
    <span>{{ sample.name }}</span>

    <font-awesome-icon :icon="['fas', 'drum']" v-if="sample.previewing"></font-awesome-icon>
    <font-awesome-icon :icon="['fas', 'music']" v-show="sample.notes.includes(1)" v-else></font-awesome-icon>
  </li>
</template>
<script>
import { useAudioStore } from '../stores/audioStore'
import useStartDrag from '../composables/useStartDrag'

export default {
  props: ['sample'],
  setup() {
    const audioStore = useAudioStore()
    const howl = new Howl(audioStore.audioSource)
    
    const preview = (sample) => {
      howl.play(sample.slug)
      howl.on('play', () => sample.previewing = true)
      howl.on('end', () => sample.previewing = false)
    }

    return {
      useAudioStore,
      useStartDrag,
      preview
    }
  }
}
</script>
<style lang="css"></style>