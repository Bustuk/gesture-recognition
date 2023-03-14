<template>
  <div class="flex center flex-column flex-grow">
    <n-button v-if="false" @click="downloadModel">
      Download Model
    </n-button>
    <!-- <n-divider /> -->
    <n-h5>Predicted label:</n-h5>
    {{ prediction.className }}
    <n-h5>Accuracy:</n-h5>
    {{ prediction.probability }}
  </div>
</template>

<script setup lang="ts">
import { NButton, NH5 } from 'naive-ui';
import { ref } from 'vue';
import type { Ref } from 'vue';
import useGestureRecognition from '../composables/useGestureRecognition';
import eventBus from '../services/EventBus';
import type { PredictionResult } from '../types';
import useTensorflow from '../composables/useTensorflow';
const { downloadModel } = useTensorflow();

const { predict } = useGestureRecognition();
const prediction: Ref<PredictionResult> = ref({className: '', probability: 0})
eventBus.on(async ({landmarks})=> {
  for (const landmark of landmarks) {
    const result = await predict(landmark)
    prediction.value = result
  }
})
</script>

<style scoped>

</style>