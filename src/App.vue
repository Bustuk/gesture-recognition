<script setup lang="ts">
import { NMessageProvider } from 'naive-ui';
</script>

<template>
  <n-message-provider>
    <RouterView />
  </n-message-provider>
</template>

<style>
/* body {
  background-color: antiquewhite;
} */

.n-card {
  -webkit-box-shadow: 0px 1px 7px 0px rgba(20, 45, 1, 1);
  -moz-box-shadow: 0px 1px 7px 0px rgba(20, 45, 1, 1);
  box-shadow: 0px 1px 7px 0px rgba(20, 45, 1, 1);
}

#app {
  margin: auto;
  height: 100vh;
  width: 80%;
}

.flex {
  display: flex;
}

.flex-row {
  flex-direction: row;
}

.flex-column {
  flex-direction: column;
}

.center {
  align-items: center;
  justify-content: center;
}
</style>
