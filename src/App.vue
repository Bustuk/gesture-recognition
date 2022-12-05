<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue'
import Gestures from './components/Gestures.vue';
import Training from './components/Training.vue';
import json from './model/hands.json'
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
    <!-- <pre>{{json['pause']}}</pre> -->
    <Gestures ref="gestures" />
    <!-- <Training /> -->
</template>

<style scoped>

</style>
