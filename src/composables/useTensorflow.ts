import * as tf from '@tensorflow/tfjs'
import type { Sequential } from '@tensorflow/tfjs'
import type { LabelledLandmark } from '../types';
import { useStorage } from '@vueuse/core'
import flatten from 'lodash/flatten'
import type { Ref } from 'vue'

const state: Ref<Record<number, string>> = useStorage('gesture-recognition-model-labels', { })

export default function useTensorflow(params: { modelSavePath: string} = { modelSavePath: 'indexeddb://gesture-recongition-model' }) {
  const X_dataset: number[][] = [] //: Ref<> = ref([]);
  const Y_dataset: number[] = []//: Ref<> = ref([]);
  let model: null | Sequential = null;
  const labelMap: Record<string, number> = {}

  const loadData = async (data: LabelledLandmark[]) => {
    state.value = {}
    data.forEach((hand: LabelledLandmark) => {
      X_dataset.push(hand.tensoredLandmarks);
      if (labelMap[hand.label] === undefined) {
        labelMap[hand.label] = Object.keys(labelMap).length;
      }
      Y_dataset.push(labelMap[hand.label]);
    });
    for (const [key, value] of Object.entries(labelMap)) {
      state.value[value] = key
    }
    console.log(labelMap.value)
    console.log(X_dataset, Y_dataset)
  };

  const saveModel = async () => {
    if (!model) {
      throw new Error('Model doesn\'t exist');
    }
    model.save(params.modelSavePath);
  }

  const prepareModel = async () => {
    model = tf.sequential({ name: 'simple-model' });
    model.add(tf.layers.dropout({inputShape: [42, ], rate: 0.2}))
    model.add(tf.layers.dense({ inputShape: [42, ], units: 24, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.2}))
    model.add(tf.layers.dense({ units: 10, activation: 'relu' }));
    model.add(tf.layers.dense({ units: Object.keys(state.value).length, activation: 'softmax' }));

    model.compile({
        optimizer: 'adam',
        loss: 'sparseCategoricalCrossentropy',
        metrics: ['accuracy'],
    });
  }

  const train = async () => {
    if (!model) {
      throw new Error('Model doesn\'t exist');
    }

    const inputTensor = tf.tensor2d(X_dataset, [X_dataset.length, 42]);
    const outputTensor = tf.tensor(Y_dataset, [Y_dataset.length,]);
    await model.fit(inputTensor, outputTensor, {
      epochs: 800,
      shuffle: true,
      batchSize: 128,
      callbacks: {
          onEpochEnd: async (epoch, logs) => {
              // any actions on during any epoch of training
              if (epoch % 50 === 0) {
                  console.log(`useTF epoch: ${epoch}, loss: ${logs?.loss}`)
              }
              await tf.nextFrame();
          },
      }
    })
    console.log('useTensorflow MODEL TEACHING FINISHED', model)
  }

  return { loadData, saveModel, train, prepareModel };
}