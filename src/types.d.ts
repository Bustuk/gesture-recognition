import type { NormalizedLandmarkList } from '@mediapipe/hands';

type SingleHandLandmarks = {
    handedness: 'Left' | 'Right',
    landmarks: NormalizedLandmarkList,
    tensoredLandmarks: number[],
};

type PredictionResult = {
    className: string,
    probability: number
};