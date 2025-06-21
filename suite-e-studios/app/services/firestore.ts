/** @format */

import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebaseConfig";

// Generic function to get all documents from a collection
export const getCollection = async <T>(
  collectionName: string
): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
};

// Generic function to get a single document from a collection
export const getDocument = async <T>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  } else {
    console.log("No such document!");
    return null;
  }
};

// Generic function to add a document to a collection (with a specific ID)
export const addDocument = async (
  collectionName: string,
  docId: string,
  data: DocumentData
): Promise<void> => {
  await setDoc(doc(db, collectionName, docId), data);
};

// Generic function to update a document in a collection
export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data);
};

// Generic function to delete a document from a collection
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  await deleteDoc(doc(db, collectionName, docId));
};
