import type { EventBusKey } from '@vueuse/core'
import type { SingleHandLandmarks } from './types'
export const landmarksKey: EventBusKey<{ landmarks: SingleHandLandmarks[] }> = Symbol('landmarksKey')