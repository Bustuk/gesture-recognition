import { defineStore } from 'pinia'
import { ref } from 'vue';
import type { Ref } from 'vue'

export const useCaptureControlStore = defineStore('captureControl', () => {
  const label: Ref<string> = ref('');
  const capture: Ref<boolean> = ref(false);

  function startCapture()  {
    capture.value = true
  }
  function stopCapture() {
    capture.value = false;
  }
  function setLabel(value: string) {
    label.value = value;
  }

  return { label, capture, startCapture, stopCapture, setLabel }
})

export const useCameraControlStore = defineStore('cameraControl', () => {
  const capture: Ref<boolean> = ref(false);

  function startCaptureVideo()  {
    capture.value = true
  }
  function stopCaptureVideo() {
    capture.value = false;
  }

  return { capture, stopCaptureVideo, startCaptureVideo }
})

export const useGestureStore = defineStore('gesture', () => {
  const capture: Ref<boolean> = ref(false);

  function startCaptureVideo()  {
    capture.value = true
  }
  function stopCaptureVideo() {
    capture.value = false;
  }

  return { capture, stopCaptureVideo, startCaptureVideo }
})