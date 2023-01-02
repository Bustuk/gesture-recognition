<template>
  <div class="container">
   <video ref="video" class="input_video"></video>
   <canvas ref="canvas" class="output_canvas" :width="props.canvasWidth" :height="props.canvasHeight"></canvas>
 </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { Ref } from 'vue'
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands'
import type { Results as HandLandmarksResult } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils'
import type { CameraOptions } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import throttle from 'lodash/throttle';
const emit = defineEmits<{
  (e: 'landmarks', HandLandmarksResult: HandLandmarksResult): void
}>()

interface Props {
  throttleLandmarks?: number,
  canvasWidth?: number,
  canvasHeight?: number,
  cameraOptions?: Omit<CameraOptions, 'onFrame'>,
}

const props = withDefaults(defineProps<Props>(), {
  throttleLandmarks: 500,
  canvasVisible: true,
  canvasWidth: 720,
  canvasHeight: 720,
  cameraOptions: () => ({
    facingMode: 'user',
    width: 720,
    height: 720,
  }),
})

const video: Ref<null | HTMLVideoElement> = ref(null);
const canvas: Ref<null | HTMLCanvasElement> = ref(null);
const camera: Ref<null | Camera> = ref(null);
const throttled_emit = throttle((landmarks: HandLandmarksResult) => emit('landmarks', landmarks), props.throttleLandmarks);
const cameraStarted: Ref<boolean> = ref(false);

const hands = new Hands({locateFile: (file) => {
  return `hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  selfieMode: true,
});

watch(cameraStarted, (val) => {
  if (val && video.value instanceof HTMLVideoElement) {
    camera.value = new Camera(video.value, {
      onFrame: async () => {
          await hands.send({image: video.value as HTMLVideoElement});
      },
      ...props.cameraOptions
    });
    camera.value?.start();
  }
})

onMounted(() => {
  if (canvas.value instanceof HTMLCanvasElement) {
    const canvasCtx = canvas.value.getContext('2d') as CanvasRenderingContext2D;
    function onResults(results: HandLandmarksResult) {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvas.value?.width || 720, canvas.value?.height || 720);
      if (results.multiHandLandmarks && results.multiHandedness) {
          for (const landmarks of results.multiHandLandmarks) {
          throttled_emit(results);
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                          {color: '#00FF00', lineWidth: 1});
          drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 1});
          }
      }
      canvasCtx.restore();
    }
    hands.onResults(onResults);
  }
});

function stopCamera()  {
    console.log('STOP')
    camera.value?.stop();
}
function startCamera() {
    console.log('START')
    cameraStarted.value = true
    camera.value?.start();
}

defineExpose({
  stopCamera,
  startCamera
})
</script>

<style scoped>
.container {
  position: relative;
  width: 720px;
  height: 720px;
}

.input_video {
  position: absolute;
  width: 720px;
  height: 720px;
  transform: scale(-1, 1);
}
.output_canvas {
  position: absolute;
  z-index: 1;
  width: 720px;
  height: 720px;
}
</style>
