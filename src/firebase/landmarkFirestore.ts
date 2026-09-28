import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { Landmark } from '../types/landmark';

const LANDMARKS_COLLECTION = 'landmarks';

/**
 * Fetch all published landmarks from Firestore database
 */
export async function fetchLandmarksFromFirestore(): Promise<Landmark[]> {
  try {
    const colRef = collection(db, LANDMARKS_COLLECTION);
    const snap = await getDocs(colRef);
    const results: Landmark[] = [];

    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.id && data.name) {
        results.push(data as Landmark);
      }
    });

    return results;
  } catch (error) {
    console.warn('Could not load landmarks from Firestore, using offline/local cache:', error);
    return [];
  }
}

/**
 * Save or update a landmark in Firestore database
 */
export async function saveLandmarkToFirestore(
  landmark: Landmark,
  authorUid: string,
  authorEmail: string
): Promise<void> {
  try {
    const docRef = doc(db, LANDMARKS_COLLECTION, landmark.id);
    const payload = {
      ...landmark,
      authorUid,
      authorEmail,
      updatedAt: new Date().toISOString(),
      firestoreUpdatedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    console.error('Error saving landmark to Firestore:', error);
    throw error;
  }
}

/**
 * Delete a landmark from Firestore
 */
export async function deleteLandmarkFromFirestore(landmarkId: string): Promise<void> {
  try {
    const docRef = doc(db, LANDMARKS_COLLECTION, landmarkId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting landmark from Firestore:', error);
    throw error;
  }
}
