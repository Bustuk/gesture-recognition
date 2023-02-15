import type { Results as HandLandmarksResult } from '@mediapipe/hands';
import type { SingleHandLandmarks } from '../types';
import flatten from 'lodash/flatten';

export function mapResults(result: HandLandmarksResult): SingleHandLandmarks[] {
  const handLandmarks: SingleHandLandmarks[] = [];
  if (result.multiHandLandmarks && result.multiHandedness) {
    for (let i = 0; i < result.multiHandLandmarks.length; i++) {
      const landmarks = result.multiHandLandmarks[i];
      const handedness = result.multiHandedness[i];
      if (handedness.score > 0.7) { 
        const singleHand = {
          handedness: handedness.label,
          tensoredLandmarks: flatten(landmarks.map(landmark => [
            landmark.x, 
            landmark.y
          ]))
        }
        handLandmarks.push(singleHand);
        
      } else {
        console.warn('Handedness score is too low');
      }
    }
  }
  return handLandmarks;
}