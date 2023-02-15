<template>
  <Hands :draw="props.draw" :landmarks-delay="props.landmarksDelay" ref="hands" v-on:landmarks="onLandmarks"/>    
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue'
import Hands from './Hands.vue';
import type { Results as HandLandmarksResult } from '@mediapipe/hands';
import { mapResults } from '../services/Mapper';
import eventBus from '../services/EventBus';

const hands: Ref<null | typeof Hands> = ref(null);
const props = defineProps({
  draw: {
    type: Boolean,
    default: false
  },
  landmarksDelay: {
    type: Number,
    default: 100
  }
})
function startCamera() {
  hands.value?.startCamera();
}
function stopCamera() {
  hands.value?.stopCamera();
}

function onLandmarks(result: HandLandmarksResult) {
  const landmarks = mapResults(result);
  eventBus.emit({landmarks})
}

defineExpose({
  stopCamera,
  startCamera
})
</script>

<style scoped>

</style>
