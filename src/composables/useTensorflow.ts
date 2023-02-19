import * as tf from '@tensorflow/tfjs'
import type { Sequential } from '@tensorflow/tfjs'
import type { LabelledLandmark } from '../types';
import { useStorage } from '@vueuse/core'
import type { Ref } from 'vue'
import * as tfvis from '@tensorflow/tfjs-vis';

const labels: Ref<Record<number, string>> = useStorage('gesture-recognition-model-labels', {"0":"victory","1":"pause","2":"spiderman","3":"l","4":"flat"})

export default function useTensorflow(params: { modelSavePath: string} = { modelSavePath: 'indexeddb://gesture-recongition-model' }) {
  const X_dataset: number[][] = [] //: Ref<> = ref([]);
  const Y_dataset: number[] = []//: Ref<> = ref([]);
  let model: null | Sequential = null;
  const labelMap: Record<string, number> = {}

  const loadData = async (data: LabelledLandmark[]) => {
    labels.value = {}
    data.forEach((hand: LabelledLandmark) => {
      X_dataset.push(hand.tensoredLandmarks);
      if (labelMap[hand.label] === undefined) {
        labelMap[hand.label] = Object.keys(labelMap).length;
      }
      Y_dataset.push(labelMap[hand.label]);
    });
    for (const [key, value] of Object.entries(labelMap)) {
      labels.value[value] = key
    }
  };

  const saveModel = async () => {
    if (!model) {
      throw new Error('Model doesn\'t exist');
    }
    model.save(params.modelSavePath);
  }

  const downloadModel = async () => {
    if (!model) {
      model = await tf.loadLayersModel(params.modelSavePath) as Sequential;
      if (!model) {
        throw new Error('Model doesn\'t exist');
      }
    }
    model.save('downloads://gesture-recongition-model')
  }

  const prepareModel = async () => {
    model = tf.sequential({ name: 'gesture-recognition-model' });
    model.add(tf.layers.dropout({inputShape: [42, ], rate: 0.2}))
    model.add(tf.layers.dense({ inputShape: [42, ], units: 24, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.2}))
    model.add(tf.layers.dense({ units: 10, activation: 'relu' }));
    model.add(tf.layers.dense({ units: Object.keys(labels.value).length, activation: 'softmax' }));

    model.compile({
        optimizer: 'adam',
        loss: 'sparseCategoricalCrossentropy',
        metrics: ['accuracy'],
    });
  }

  const showModelInfo = () => {
    if (!model) {
      throw new Error('Model doesn\'t exist');
    }
    const surface = { name: 'Model Summary', tab: 'Model Inspection'};
    tfvis.show.modelSummary(surface, model);
  }

  const train = async () => {
    if (!model) {
      throw new Error('Model doesn\'t exist');
    }
    const inputTensor = tf.tensor2d(X_dataset, [X_dataset.length, 42]);
    const outputTensor = tf.tensor(Y_dataset, [Y_dataset.length,]);
    const surface = { name: 'show.fitCallbacks', tab: 'Training' };
    const start = Date.now();
    await model.fit(inputTensor, outputTensor, {
      epochs: 300,
      shuffle: true,
      batchSize: 128,
      callbacks: tfvis.show.fitCallbacks(surface, ['acc'], { callbacks: ['onEpochEnd'] }),
    })
    const end = Date.now();
    console.log(`Execution time: ${end - start} ms`);
    console.log('useTensorflow MODEL TEACHING FINISHED', model)
  }

  return { loadData, saveModel, train, prepareModel, downloadModel, showModelInfo };
}