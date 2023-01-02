<template>
  <Hands :throttle-landmarks="100" ref="hands" v-on:landmarks="onLandmarks"/>    
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue'
import Hands from './Hands.vue';
import type { Results as HandLandmarksResult } from '@mediapipe/hands';
import type { SingleHandLandmarks } from '../types';
import flatten from 'lodash/flatten';
import { useEventBus } from '@vueuse/core'
import { landmarksKey } from '../consts';
const bus = useEventBus(landmarksKey)
const hands: Ref<null | typeof Hands> = ref(null);

function startCamera() {
  hands.value?.startCamera();
}
function stopCamera() {
  hands.value?.stopCamera();
}

async function mapResults(result: HandLandmarksResult): Promise<SingleHandLandmarks[]> {
  const handLandmarks: SingleHandLandmarks[] = [];
  if (result.multiHandLandmarks && result.multiHandedness) {
    for (let i = 0; i < result.multiHandLandmarks.length; i++) {
      const landmarks = result.multiHandLandmarks[i];
      const handedness = result.multiHandedness[i];
      if (handedness.score > 0.7) { 
        const singleHand = {
          handedness: handedness.label,
          tensoredLandmarks: flatten(landmarks.map(landmark => [
            landmark.x, 
            landmark.y
          ]))
        }
        handLandmarks.push(singleHand);
        // predictionResult.value = await predict(singleHand)
        // if (predictionResult.value.probability > 0.75) {
        //   console.log('predictionResult', predictionResult.value)
        // }
        
      } else {
        console.warn('Handedness score is too low');
      }
    }
  }
  return handLandmarks;
}

async function onLandmarks(result: HandLandmarksResult) {
  const landmarks = await mapResults(result);
  bus.emit({landmarks})
}

addEventListener('message', (event) => {
  // console.log('event', event);
  if (event.data === 'startCamera') {
    startCamera();
  } else if (event.data === 'stop') {
    stopCamera();
  }
})

defineExpose({
  stopCamera,
  startCamera
})
</script>

<style scoped>

</style>
