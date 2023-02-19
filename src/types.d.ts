import type { NormalizedLandmarkList } from '@mediapipe/hands';

type PredictionResult = {
  className: string,
  probability: number
};

interface LabelledLandmark extends SingleHandLandmarks {
  id?: number;
  label: string;
}

interface SingleHandLandmarks {
  tensoredLandmarks: number[]; // 21 * 2 numbers for x,y coordinates
  handedness:  'Left' | 'Right'
}