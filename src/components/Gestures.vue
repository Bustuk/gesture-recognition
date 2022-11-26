<template>
    <Hands ref="hands" :v-on:landmarks="onLandmarks"/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue'
import Hands from './Hands.vue';
import useGestureRecognition from '../composables/useGestureRecognition';
// const { gesture, predict } = useGestureRecognition();
const hands: Ref<null | typeof Hands> = ref(null);

function startCamera() {
  hands.value?.startCamera();
}
function stopCamera() {
  hands.value?.stopCamera();
}

function onLandmarks(x) {
  console.log('onLandmarks', x);
}

defineExpose({
  stopCamera,
  startCamera
})
</script>

<style scoped>

</style>
