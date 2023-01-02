import type { SingleHandLandmarks, PredictionResult } from '../types';
import { tensor2d, loadLayersModel } from '@tensorflow/tfjs';
import type { LayersModel } from '@tensorflow/tfjs';
import { useStorage } from '@vueuse/core'
import type { Ref } from 'vue'
export default function useGestureRecognition(modelPath: string = 'indexeddb://gesture-recongition-model') {
  let model: LayersModel | null = null; 
  const labelMap: Ref<Record<number, string>> = useStorage('gesture-recognition-model-labels', {})

  const predict = async (singleHand: SingleHandLandmarks): Promise<PredictionResult> => {
    // w zależności od tego czy jest lewa czy prawa ręka
    // użyjemy rónych modeli - narazie jest zbudowany tylko ten dla lewej ręki
    // lub wymyślę jak je przemapować 
    let gestureName = '', max = 0;
    try {
      const tensor = tensor2d(singleHand.tensoredLandmarks, [1, 42])
      const prediction = await (await getModel()).predict(tensor);
      const arr = await (prediction as any).array();
      max = Math.max(...arr[0])
      const index = arr[0].indexOf(max)
      gestureName = labelMap.value[index]
      console.log('PREDICTION', gestureName, max) //, arr[0])
    } catch(err) {
      console.error(err)
    }
    
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