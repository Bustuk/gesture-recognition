<template>
  <div class="flex center flex-column">
    <n-button @click="trainModel">
      Train Model
    </n-button>
    <n-h5>Labels for training:</n-h5>
    <n-thing v-for="gesture in gestures">
      <n-text>{{ gesture }}</n-text>
      <n-icon @click="askForDelete(gesture)"><delete-filled /></n-icon>
    </n-thing>
  </div>
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    :content="`Are you sure you want to delete ${labelForDelete}?`"
    positive-text="Delete"
    negative-text="Cancel"
    @positive-click="submitCallback"
    @negative-click="cancelCallback"
    :positive-button-props="{ type: 'error' }"
    :show-icon="false"
  />
</template>

<script setup lang="ts">
import useGestureDb from '../composables/useGestureDb';
import useTensorflow from '../composables/useTensorflow';
import { DeleteFilled } from '@vicons/material';
import { NIcon, NThing, NModal, NButton, NH5, NText } from 'naive-ui';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useMessage } from 'naive-ui'
const tf = useTensorflow()
const labelForDelete = ref('');
const message = useMessage()
const { getUniqueLabels, removeByLabel, getAll, } = useGestureDb();
const askForDelete = (label: string) => {
  labelForDelete.value = label
  showModal.value = true;
};
const submitCallback = async () => {
  showModal.value = false;
  await removeByLabel(labelForDelete.value);
  message.success('Gestues map deleted')
  refreshLabels()
};
const cancelCallback = () => {
  showModal.value = false;
};

const showModal: Ref<boolean> = ref(false);
const gestures: Ref<string[]> = ref([])

const refreshLabels = () => {
  getUniqueLabels().then((labels) => {
    gestures.value = labels as string[];
  });
}

refreshLabels()

const trainModel = async () => {
  const data = await getAll();
  await tf.loadData(data)
  await tf.prepareModel()
  await tf.train()
  await tf.saveModel()
}


</script>

<style scoped>

</style>