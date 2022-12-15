import { SingleHandLandmarks, predictionResult } from '../types';
import { tensor2d, loadLayersModel } from '@tensorflow/tfjs';
import type { LayersModel } from '@tensorflow/tfjs';

export default function useGestureRecognition(modelPath: string = 'model/model.json') {
  let model: LayersModel | null = null; 
  const labelMap = new Map()
  labelMap.set(0, 'pause')
  labelMap.set(1, 'flat')
  labelMap.set(2, 'victory')
  const predict = async (singleHand: SingleHandLandmarks): Promise<predictionResult> => {
    // w zależności od tego czy jest lewa czy prawa ręka
    // użyjemy rónych modeli - narazie jest zbudowany tylko ten dla lewej ręki
    // lub wymyślę jak je przemapować 

    const tensor = tensor2d(singleHand.tensoredLandmarks, [1, 42])
    const prediction = await (await getModel()).predict(tensor);
    const arr = await (prediction as any).array();
    const max = Math.max(...arr[0])
    const index = arr[0].indexOf(max)
    const gestureName = labelMap.get(index)
    // console.log('PREDICTION', gestureName, max) //, arr[0])
    return {
      className: gestureName,
      probability: max
    };
  };

  const getModel = async (): Promise<LayersModel> => {
    if (!model) {
      model = await loadLayersModel(modelPath)
    } 
    
    return model
  }

  return { predict };
}