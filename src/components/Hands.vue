<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue'
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands'
import { Camera, CameraOptions } from '@mediapipe/camera_utils'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import throttle from 'lodash.throttle';

const emit = defineEmits(['landmarks']);

interface Props {
  throttleLandmarks?: number,
  throttleGesture?: number,
  canvasWidth?: number,
  canvasHeight?: number,
  cameraOptions?: Omit<CameraOptions, 'onFrame'>,
}

const props = withDefaults(defineProps<Props>(), {
  throttleLandmarks: 2000,
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
const throttled_log = throttle((landmarks) => console.log(landmarks), props.throttleLandmarks);
onMounted(() => {
    if (canvas.value instanceof HTMLCanvasElement) {
      const canvasCtx = canvas.value.getContext('2d') as CanvasRenderingContext2D;
      function onResults(results) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvas.value?.width || 720, canvas.value?.height || 720);
        if (results.multiHandLandmarks && results.multiHandedness) {
            for (const landmarks of results.multiHandLandmarks) {
            throttled_log(results);
            emit('landmarks', results);
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                            {color: '#00FF00', lineWidth: 1});
            drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 1});
            }
        }
        canvasCtx.restore();
      }

      const hands = new Hands({locateFile: (file) => {
          return `hands/${file}`;
      }});
      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        selfieMode: true,
      });
      hands.onResults(onResults);

      if (video.value instanceof HTMLVideoElement) {
        camera.value = new Camera(video.value, {
          onFrame: async () => {
              await hands.send({image: video.value as HTMLVideoElement});
          },
          ...props.cameraOptions
        });
      console.log(camera.value)
      }
    }
});

function stopCamera()  {
    console.log('STOP')
    camera.value?.stop();
}
function startCamera() {
    console.log('START')
    camera.value?.start();
}

defineExpose({
  stopCamera,
  startCamera
})
</script>

<template>
   <div class="container">
    <video ref="video" class="input_video"></video>
    <canvas ref="canvas" class="output_canvas" :width="props.canvasWidth" :height="props.canvasHeight"></canvas>
  </div>
</template>

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
