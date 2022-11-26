<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue'
import Gestures from './components/Gestures.vue';

const gestures: Ref<null | typeof Gestures> = ref(null);

function startCamera() {
  gestures.value?.startCamera();
}
function stopCamera() {
  gestures.value?.stopCamera();
}

</script>

<template>
    <button @click="startCamera">start KAMERA</button>
    <button @click="stopCamera">stop KAMERA</button>
    <Gestures ref="gestures" />
</template>

<style scoped>

</style>
