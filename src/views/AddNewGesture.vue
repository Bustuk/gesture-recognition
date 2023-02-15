<template>
  <n-input placeholder="Input new gesture label" type="text" :value="label" :on-update:value="setLabel"/>
  <n-layout>
    <n-button :disabled="capture" @click = "startCapture">Start</n-button>
    <n-button :disabled="!capture" @click = "stopCapture">Stop</n-button>
  </n-layout>
</template>

<script setup lang="ts">
import { NButton, NInput, NLayout } from 'naive-ui';
import { useCaptureControlStore } from '../store';
import { storeToRefs } from 'pinia'
import useGestureDB from '../composables/useGestureDb';
import eventBus from '../services/EventBus';
const store = useCaptureControlStore();
const { label, capture } = storeToRefs(store);
const { startCapture, stopCapture, setLabel } = store
const { add } = useGestureDB();

eventBus.on(({ landmarks })=> {
  if (capture.value)
    landmarks.forEach(hand => add({...hand, label: label.value}))
})

</script>

<style scoped>
.n-input {
  width: 300px;
  margin: 10px 10px;
}
.n-button {
  margin: 10px 10px;
}
</style>