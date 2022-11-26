<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue'
import Hands from './components/Hands.vue';

const handsRef: Ref<null | typeof Hands> = ref(null);

function startCamera() {
  handsRef.value?.startCamera();
}
function stopCamera() {
  handsRef.value?.stopCamera();
}

</script>

<template>
    <button @click="startCamera">start KAMERA</button>
    <button @click="stopCamera">stop KAMERA</button>
    <Hands ref="handsRef" />
</template>

<style scoped>

</style>
