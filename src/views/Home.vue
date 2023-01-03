<template>
  <div class="flex flex-row center h-100">
    <div class="section">
      <n-card style="width:720px; height: 720px;" :bordered="false" content-style="padding: 0;">
        <Gestures :draw="true" ref="gestures" />
      </n-card>
      <div class="flex flex-row center" style="margin-top: -50px; z-index: 2;">
        <n-space>
          <n-button type="primary" @click="startCamera">Start Camera</n-button>
          <n-button type="primary" @click="stopCamera">Stop Camera</n-button>
        </n-space>
      </div>
    </div>
    <div class="section">
      <div class="flex flex-row center">
      <n-tabs id="tabs" ref="tabsInstRef" v-model:value="value">
        <n-tab v-for="tab in tabs" :key="tab.path" :name="tab.path">
          <router-link :to="tab">
            <NText>{{ tab.label }}</NText>
          </router-link>
        </n-tab>
      </n-tabs>
    </div>
    <n-card id="right-pane" class="flex center">
      <RouterView />
    </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NSpace, NTabs, NTab, NText, NDivider, NCard } from 'naive-ui';
import type { TabsInst } from 'naive-ui';
import { ref, nextTick, computed } from 'vue';
import type { Ref } from 'vue'
import Gestures from '../components/Gestures.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const value = computed(() => (router.currentRoute.value.path))

const tabsInstRef = ref<TabsInst | null>(null)
const tabs = ref([
{
    label: 'Add new gesture',
    path: '/',
  },
  {
    label: 'Train Model',
    path: '/train-model',
  },
  {
    label: 'Test Model',
    path: '/test-model',
  },
])

const handleClick = () => {
  tabs.value.reverse()
  nextTick(() => tabsInstRef.value?.syncBarPosition())
}

const gestures: Ref<null | typeof Gestures> = ref(null);

function startCamera() {
  gestures.value?.startCamera();
}
function stopCamera() {
  gestures.value?.stopCamera();
}

</script>

<style scoped>
#tabs {
  margin-bottom: 20px;
}

#right-pane {
  height: 60%;
  width: 60%
}

.h-100 {
  height: 100%;
}
.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-height: 75%;
  width: 50%;
}
</style>