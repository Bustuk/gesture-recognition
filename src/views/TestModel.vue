<template>
  <div class="flex center flex-column">
    <n-button :loading="loading" @click="loadModel">
      Test Model
    </n-button>
    <!-- <n-divider /> -->
    <n-h5>Predicted label:</n-h5>
    {{ prediction.className }}
    <n-h5>Accuracy:</n-h5>
    {{ prediction.probability }}
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { NButton, NH5 } from 'naive-ui';
import { ref } from 'vue';
import type { Ref } from 'vue';
import useGestureRecognition from '../composables/useGestureRecognition';
import { landmarksKey } from '../consts';
import { useEventBus } from '@vueuse/core'
import type { PredictionResult } from '../types';
const { predict } = useGestureRecognition();
const prediction: Ref<PredictionResult> = ref({className: '', probability: 0})
const bus = useEventBus(landmarksKey)
bus.on(async ({landmarks})=> {
  for (const landmark of landmarks) {
    const result = await predict(landmark)
    prediction.value = result
  }
})

const message = useMessage(); 
const loading: Ref<boolean> = ref(false)
const loadModel = () => {
  loading.value = true
  try {
    throw 123;
    // loadModel
  } catch(e) {
    console.log(e)
    message.error('Error loading model')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

</style>