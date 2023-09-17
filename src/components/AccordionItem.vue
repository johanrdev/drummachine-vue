<template lang="html">
  <div class="flex flex-col border rounded">
    <header class="cursor-pointer select-none p-2 bg-slate-100 text-slate-400" @click="show = !show">
      <slot name="toggler"></slot>
    </header>
    <transition appear name="slide" tag="div">
      <div class="h-full overflow-hidden" v-if="show">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: ['show'],
  setup() {

  }
}
</script>
<style lang="css">
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 338px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all .25s ease-in-out;
}
</style>