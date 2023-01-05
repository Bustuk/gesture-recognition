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