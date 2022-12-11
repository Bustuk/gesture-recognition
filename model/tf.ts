import data from './hands.json';
import { SingleHandLandmarks } from '../src/types';
import * as tf from '@tensorflow/tfjs-node';
import flatten from 'lodash/flatten';
type label = 'pause' | 'flat' | 'victory'

const myData = data as myData;

const labelMap: Record<label, number> = {
    'pause': 0,
    'flat': 1,
    'victory': 2
}
const model = createSimpleModel();

const input = [];
const output = [];
Object.keys(labelMap).forEach((label: label) => {
    myData[label].forEach((hand) => {
        const data = flatten(hand.tensoredLandmarks.map((landmark) => landmark.slice(0, 2)))
        // console.log(data)
        input.push(data);
        output.push(labelMap[label]);
    });
});
console.log(input, output)
const inputTensor = tf.tensor2d(input, [input.length, 42]);
const outputTensor = tf.tensor(output, [output.length,]);
// //inputTensor.print();
// //outputTensor.print();
// console.log(inputTensor.shape);
// console.log(outputTensor.shape);

initModel(inputTensor, outputTensor);

async function initModel(inputTensor, outputTensor) {
    // skip for brevity

    await model.fit(inputTensor, outputTensor, {
        epochs: 600,
        shuffle: true,
        batchSize: 128,
        callbacks: {
            onEpochEnd: async (epoch, { loss }) => {
                // any actions on during any epoch of training
                // if (epoch % 100 === 0) {
                //     console.log(`epoch: ${epoch}, loss: ${loss}`)
                // }
                await tf.nextFrame();
            },
        }
    })

    model.predict(
      tf.reshape(input[20], [1, 42])
    ).print();
    model.predict(
      tf.reshape(input[700], [1, 42])
    ).print();
    model.predict(
      tf.reshape(input[1400], [1, 42])
    ).print();
    model.save('file://../public/model');
}

function createSimpleModel() { 
    const model = tf.sequential({ name: 'simple-model' });
    model.add(tf.layers.dropout({inputShape: [42, ], rate: 0.2}))
    model.add(tf.layers.dense({ inputShape: [42, ], units: 24, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.2}))
    model.add(tf.layers.dense({ units: 10, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

    model.compile({
        optimizer: 'adam',
        loss: 'sparseCategoricalCrossentropy',
        metrics: ['accuracy'],
    });
    return model;
}
