<template lang="html">
    <transition appear name="fade" mode="out-in" tag="div" @drop="onDrop($event)" @dragenter.prevent @dragover.prevent>
      <accordion-item :show="true" class="mb-1">
        <template v-slot:toggler>
          <font-awesome-icon :icon="['fas', 'drum']" class="mr-2"></font-awesome-icon> Samples ({{
            audioStore.getSamples.length
          }})
        </template>
        <div class="p-2 flex flex-col">
          <label for="search" class="block mb-2">
            <input type="text" v-model="audioStore.search" class="p-2 w-full border rounded outline-none"
              placeholder="Search sample" />
          </label>
          <transition-group appear tag="ul" name="list-fade" class="h-[287px] overflow-y-auto relative" v-if="audioStore.getSamples.length">
              <sample-item v-for="sample in audioStore.getSamples" :key="sample.id" :sample="sample" draggable="true" @dragstart="useStartDrag($event, sample)" />
          </transition-group>
          <div
            class="p-2 border-2 border-dashed border-slate-200 grow flex flex-col justify-center items-center h-[338px]"
            v-else>
            <span class="text-slate-400 mx-4 select-none text-center">Drag samples here to add them</span>
          </div>
        </div>
      </accordion-item>
    </transition>
</template>
<script>
import { useAudioStore } from '../stores/audioStore'
import useStartDrag from '../composables/useStartDrag'
import SampleItem from './SampleItem.vue'
import AccordionItem from './AccordionItem.vue'

export default {
  components: { AccordionItem, SampleItem },
  setup() {
    const audioStore = useAudioStore()

    const onDrop = (event) => {
      const id = event.dataTransfer.getData('id')
      const track = audioStore.pattern.find(t => t.id === id)
      if (track) {
        const index = audioStore.pattern.findIndex(t => t.id === id)
        audioStore.samples.push(track)
        audioStore.pattern.splice(index, 1)
      }
    }

    return {
      audioStore,
      useStartDrag,
      onDrop
    }
  }
}
</script>
<style lang="css"></style>