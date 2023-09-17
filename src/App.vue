<template lang="html">
  <transition appear name="slide-fade">
    <div class="flex flex-col max-w-7xl shadow-xl border rounded-lg overflow-hidden mx-4 my-10 xl:mx-auto lg:mt-32">
      <header class="bg-slate-400 p-3">
        <span class="block font-semibold text-slate-200 text-2xl text-center select-none§">GrooveBox</span>
      </header>
      <section class="grid grid-cols-1 gap-3 md:grid-cols-12 p-3">
        <div class="flex flex-col md:col-span-3 order-1 md:order-0">
          <samples-list></samples-list>
          <settings-box></settings-box>
        </div>

        <div class="md:col-span-9 order-0 md:order-1 flex flex-col">
          <control-panel></control-panel>
          <drum-grid></drum-grid>
        </div>
      </section>
    </div>
  </transition>
</template>
<script>
import { useAudioStore } from './stores/audioStore'
import { uuid } from 'vue-uuid'
import SamplesList from './components/SampleList.vue'
import SettingsBox from './components/SettingsBox.vue'
import ControlPanel from './components/ControlPanel.vue'
import DrumGrid from './components/DrumGrid.vue'

export default {
  components: { SamplesList, ControlPanel, DrumGrid, SettingsBox },
  setup() {
    const audioStore = useAudioStore()

    audioStore.samples = Object.keys(audioStore.audioSource.sprite).map((sample) => {
      return {
        id: uuid.v1(),
        name: sample.replaceAll('-', ' '),
        slug: sample,
        notes: Array(16).fill(0),
        previewing: false
      }
    })
  }
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