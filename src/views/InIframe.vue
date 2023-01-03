<template>
  <Gestures ref="gestures" :throttle-landmarks="100" />
</template>

<script setup lang="ts">
import Gestures from '../components/Gestures.vue'
import useGestureRecognition from '../composables/useGestureRecognition';
import { landmarksKey } from '../consts';
import { useEventBus } from '@vueuse/core'
import type { Ref } from 'vue'
import { ref } from 'vue'

const { predict } = useGestureRecognition();
const bus = useEventBus(landmarksKey)

bus.on(async ({landmarks})=> {
  for (const landmark of landmarks) {
    const result = await predict(landmark)
    window.parent.postMessage({
      message: 'gesture',
      value: result.className,
      probability: result.probability
    }, '*')
  }
})

const gestures: Ref<null | typeof Gestures> = ref(null);

function startCamera() {
  gestures.value?.startCamera();
}
function stopCamera() {
  gestures.value?.stopCamera();
}

addEventListener('message', (event) => {
  switch(event.data) {
    case 'startRecognition':
      startCamera();
      break;
    case 'stopRecognition':
      stopCamera();
      break;
  }
})
</script>


<style scoped>

</style>