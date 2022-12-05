import data from './hands.json';
import { SingleHandLandmarks } from '../src/types';
import * as tf from '@tensorflow/tfjs';
import { tensor2d } from '@tensorflow/tfjs';
type label = 'pause' | 'flat' | 'victory'
type myData = Record<label, SingleHandLandmarks[]>;


const csv = require('csv-parser');
const fs = require('fs');
const csvData = []
const csvDataLabels = []

const myData = data as myData;

const labelMap: Record<label, number> = {
    'pause': 0,
    'flat': 1,
    'victory': 2
}
const model = createSimpleModel();
fs.createReadStream('keypoint.csv')
  .pipe(csv())
  .on('data', (row) => {
    const label = row['0']
    delete row['0']
    const landmarks = []
    for (let i of Array(42).keys()) {
      landmarks.push(Number(row[(i+1).toString()]))
    }
    csvData.push(landmarks)
    csvDataLabels.push(Number(label))
  })
  .on('end', () => {
    console.log(csvData, csvDataLabels)
    tf.reshape(csvData, [csvData.length, 42])
    const inputTensor = tf.tensor2d(csvData, [csvData.length, 42]);
    const outputTensor = tf.tensor(csvDataLabels, [csvDataLabels.length,]);
    // inputTensor.print();
    // outputTensor.print();
    // console.log(inputTensor.shape);
    // console.log(outputTensor.shape);
    

    initModel(inputTensor, outputTensor);
  });

// const input = [];
// const output = [];
// Object.keys(labelMap).forEach((label: label) => {
//     myData[label].forEach((hand) => {
//         const data = flattern(hand.tensoredLandmarks.map((landmark) => landmark.slice(0, 2)))
//         // console.log(data)
//         input.push(data);
//         output.push(labelMap[label]);
//     });
// });
// const inputTensor = tf.tensor2d(input, [input.length, 42]);
// const outputTensor = tf.tensor(output);
// //inputTensor.print();
// //outputTensor.print();
// //console.log(inputTensor.shape);
// //console.log(outputTensor.shape);
// const model = createSimpleModel();

// //initModel();

async function initModel(inputTensor, outputTensor) {
    // skip for brevity

    await model.fit(inputTensor, outputTensor, {
        epochs: 200,
        //shuffle: true,
        batchSize: 128,
        callbacks: {
            onEpochEnd: async (epoch, { loss }) => {
                // any actions on during any epoch of training
                if (epoch % 50 === 0) {
                    console.log(`epoch: ${epoch}, loss: ${loss}`)
                }
                await tf.nextFrame();
            },
        }
    })
    model.predict(
      tf.reshape(csvData[20], [1, 42])
    ).print();
    model.predict(
      tf.reshape(csvData[150], [1, 42])
    ).print();
    model.predict(
      tf.reshape(csvData[1900], [1, 42])
    ).print();
}

function createSimpleModel() { 
    const model = tf.sequential({ name: 'simple-model' });
    model.add(tf.layers.dropout({inputShape: [42, ], rate: 0.2}))
    model.add(tf.layers.dense({ inputShape: [42, ], units: 24, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.2}))
    model.add(tf.layers.dense({ units: 10, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 4, activation: 'softmax' }));
    model.compile({
        optimizer: 'adam',
        loss: 'sparseCategoricalCrossentropy',
        metrics: ['accuracy'],
    });
    return model;
}