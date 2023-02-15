import { useEventBus } from '@vueuse/core'
import { landmarksKey } from '../consts';

const bus = useEventBus(landmarksKey)

export default bus;