import type { NormalizedLandmarkList } from '@mediapipe/hands';

export type SingleHandLandmarks = {
    handedness: 'Left' | 'Right',
    landmarks: NormalizedLandmarkList,
    tensoredLandmarks: number[][],
};

export type predictionResult = {
    className: string,
    probability: number
};