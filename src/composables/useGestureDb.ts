import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { LabelledLandmark } from '../types';

class GestureDB extends Dexie {
  gestures!: Table<LabelledLandmark>; 

  constructor() {
    super('gestueDB');
    this.version(1).stores({
      gestures: '++id, label, tensoredLandmarks, handedness'
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