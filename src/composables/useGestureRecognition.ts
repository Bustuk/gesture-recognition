import { ref } from 'vue';
import type { Ref } from 'vue';
import { loadTFLiteModel } from '@tensorflow/tfjs-tflite';

export default async function useGestureRecognition() {
  const model = await loadTFLiteModel('../../model/keypoint_classifier/keypoint_classifier.tflite');
  const gesture: Ref<string> = ref('');

  const predict = (landmarks) => {
    const predictions = model.predict(landmarks);
    const gestureName = predictions[0].className;
    gesture.value = gestureName;
    return gestureName;
  };

  return { predict, gesture };
}