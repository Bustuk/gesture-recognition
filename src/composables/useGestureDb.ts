import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { LabelledLandmark } from '../types';

class GestureDB extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  gestures!: Table<LabelledLandmark>; 

  constructor() {
    super('gestueDB');
    this.version(1).stores({
      gestures: '++id, label, tensoredLandmarks, handedness' // Primary key and indexed props
    });
  }
}

const db = new GestureDB();

export default function useGestureDB() {
  const add = async (gesture: LabelledLandmark) => db.gestures.add(gesture)
  const bulkAdd = async (gestures: LabelledLandmark[]) => db.gestures.bulkAdd(gestures)
  const getAll = async () => db.gestures.toArray()
  const getUniqueLabels = async () => db.gestures.orderBy('label').uniqueKeys()
  const removeByLabel = async (label: string) => db.gestures.where('label').equals(label).delete()
  return { db, add, bulkAdd, getAll, getUniqueLabels, removeByLabel }
}