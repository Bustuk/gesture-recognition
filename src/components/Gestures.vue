<template>
  <input type="text" v-model="label"/>
    <button @click = "startCapture">Start</button>
    <button @click = "stopCapture">Stop</button>
    <button @click = "() => saveTemplateAsFile(`trainingData.json`, data)">Save</button>
    <Hands :throttle-landmarks="100" ref="hands" v-on:landmarks="onLandmarks"/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue'
import Hands from './Hands.vue';
import type { Results as HandLandmarksResult } from '@mediapipe/hands';
import { SingleHandLandmarks } from '../types';
const hands: Ref<null | typeof Hands> = ref(null);
const label: Ref<string> = ref('');
const data: Ref<HandLandmarksResult> = ref({} as HandLandmarksResult);
const capture: Ref<boolean> = ref(false);

const saveTemplateAsFile = (filename = 'trainingData.json', dataObjToWrite) => {
  const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: "text/json" });
  const link = document.createElement("a");

  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

  const evt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
  });

  link.dispatchEvent(evt);
  link.remove()
};

const addData = (landmarks: SingleHandLandmarks) => {
  if (data.value[label.value]) {
    data.value[label.value].push(landmarks);
  } else {
    data.value[label.value] = [landmarks];
  }
}

function startCamera() {
  hands.value?.startCamera();
}
function stopCamera() {
  hands.value?.stopCamera();
}

function startCapture()  {
  capture.value = true
}
function stopCapture() {
  capture.value = false;
}

function mapResults(result: HandLandmarksResult): SingleHandLandmarks[] {
  const hands: SingleHandLandmarks[] = [];
  if (result.multiHandLandmarks && result.multiHandedness) {
    for (let i = 0; i < result.multiHandLandmarks.length; i++) {
      const landmarks = result.multiHandLandmarks[i];
      const handedness = result.multiHandedness[i];
      if (handedness.score > 0.5) {
        hands.push({
          handedness: handedness.label,
          landmarks,
          tensoredLandmarks: landmarks.map(landmark => [landmark.x, landmark.y, landmark.z])
        });
      } else {
        console.warn('Handedness score is too low');
      }
    }
  }
  return hands;
}

function onLandmarks(result: HandLandmarksResult) {
  const hands = mapResults(result);
  if (capture.value) {
    hands.forEach(hand => addData(hand));
  }
  console.log('onLandmarks', hands);
}

defineExpose({
  stopCamera,
  startCamera
})
</script>

<style scoped>

</style>
