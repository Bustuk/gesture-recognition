import { ref } from 'vue';
import type { Ref } from 'vue';
import { SingleHandLandmarks, predictionResult } from '../types';
import { tensor2d, loadLayersModel } from '@tensorflow/tfjs';
import type { LayersModel, Tensor2D } from '@tensorflow/tfjs';

export default async function useGestureRecognition(modelPath: string) {
  const gesture: Ref<string> = ref('');
  const tfModel: Ref<LayersModel | null> = ref(null);
  const data: Ref<Tensor2D[]> = ref([]);

  const predict = async (singleHand: SingleHandLandmarks): Promise<predictionResult> => {
    const model = await getModel();
    const predictions = model.predict(tensor2d(singleHand.tensoredLandmarks, [21, 3]));
    const gestureName = predictions[0].className;
    gesture.value = gestureName;
    return gestureName;
  };

  const getModel = async () => {
    if (!tfModel.value) {
      tfModel.value = await loadLayersModel(modelPath);
    }
    return tfModel.value;
  }

  return { predict, gesture };
}