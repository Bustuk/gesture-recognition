import { sequential, layers, tensor, tensor2d, reshape, nextFrame } from '@tensorflow/tfjs'
import type { Sequential } from '@tensorflow/tfjs'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { SingleHandLandmarks } from '../types';
import flatten from 'lodash/flatten';

type TrainData = Record<string, SingleHandLandmarks[]>;

export async function useTensorflow(params: { modelSavePath: string, labelMap: Record<string, number> }) {
  const X_dataset: Ref<number[][]> = ref([]);
  const Y_dataset: Ref<number[]> = ref([]);
  const model: Ref<Sequential | null> = ref(null);

  const loadData = async (data: TrainData) => {
    Object.keys(data).forEach((label: string, index: number) => {
        data[label].forEach((hand: SingleHandLandmarks) => {
            const data = flatten(hand.tensoredLandmarks)
            // console.log(data)
            X_dataset.value.push(data);
            Y_dataset.value.push(index);
        });
    });
  };

  const saveModel = async () => {
    if (!model.value) {
      throw new Error('Model doesn\'t exist');
    }
    model.value.save(params.modelSavePath);
  }

  const prepareModel = async () => {
    model.value = sequential({ name: 'simple-model' });
    model.value.add(layers.dropout({inputShape: [42, ], rate: 0.2}))
    model.value.add(layers.dense({ inputShape: [42, ], units: 24, activation: 'relu' }));
    model.value.add(layers.dropout({ rate: 0.2}))
    model.value.add(layers.dense({ units: 10, activation: 'relu' }));
    model.value.add(layers.dense({ units: 3, activation: 'softmax' }));

    model.value.compile({
        optimizer: 'adam',
        loss: 'sparseCategoricalCrossentropy',
        metrics: ['accuracy'],
    });
  }

  const train = async () => {
    if (!model.value) {
      throw new Error('Model doesn\'t exist');
    }
    model.value.save(params.modelSavePath);

    const inputTensor = tensor2d(X_dataset.value, [X_dataset.value.length, 42]);
    const outputTensor = tensor(Y_dataset.value, [Y_dataset.value.length,]);
    await model.value.fit(inputTensor, outputTensor, {
      epochs: 300,
      shuffle: true,
      batchSize: 128,
      callbacks: {
          onEpochEnd: async (epoch, { loss }) => {
              // any actions on during any epoch of training
              if (epoch % 100 === 0) {
                  console.log(`epoch: ${epoch}, loss: ${loss}`)
              }
              await nextFrame();
          },
      }
  })
  }

  return { loadData, saveModel };
}