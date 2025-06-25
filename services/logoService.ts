import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface LogoGeneration {
  id?: string;
  prompt: string;
  style: string;
  status: 'processing' | 'completed' | 'failed';
  imageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId?: string;
}

const COLLECTION_NAME = 'logoGenerations';

export class LogoService {
  // Create a new logo generation request
  static async createLogoGeneration(data: Omit<LogoGeneration, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating logo generation:', error);
      throw error;
    }
  }

  // Update logo generation status
  static async updateLogoGeneration(id: string, updates: Partial<LogoGeneration>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating logo generation:', error);
      throw error;
    }
  }

  // Get all logo generations for a user
  static async getUserLogoGenerations(userId: string): Promise<LogoGeneration[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LogoGeneration));
    } catch (error) {
      console.error('Error getting user logo generations:', error);
      throw error;
    }
  }

  // Delete a logo generation
  static async deleteLogoGeneration(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Error deleting logo generation:', error);
      throw error;
    }
  }
}