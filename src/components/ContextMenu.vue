<template lang="html">
  <transition appear name="fade" :style="{ 'left': position.x + 'px', 'top': position.y + 'px' }" v-show="show">
    <div class="p-2 z-10 absolute min-w-[100px] bg-white border-2 border-slate-300 rounded shadow">
    <slot></slot>
    </div>

  </transition>
</template>
<script>
export default {
  props: ['show', 'position'],
  setup(_, { emit }) {
    const close = () => {
      emit('closeContextMenu')
    }

    return {
      close
    }
  }
}
</script>
<style lang="css"></style>