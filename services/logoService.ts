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
  Timestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { functions, db } from '@/lib/firebase';

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

export interface GenerationData {
  prompt: string;
  style: string;
  status: 'processing' | 'done' | 'error';
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  error?: string;
}

export interface GenerationResponse {
  success: boolean;
  generationId: string;
  message: string;
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

  // Call Firebase Function to start generation
  static async startGeneration(prompt: string, style: string): Promise<GenerationResponse> {
    try {
      const startGenerationFunction = httpsCallable(functions, 'startGeneration');
      const result = await startGenerationFunction({ prompt, style });
      return result.data as GenerationResponse;
    } catch (error) {
      console.error('Error calling startGeneration function:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to start generation');
    }
  }

  // Listen to generation status updates in real-time
  static listenToGeneration(
    generationId: string,
    onUpdate: (data: GenerationData | null) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    const docRef = doc(db, 'generations', generationId);
    
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          onUpdate({
            prompt: data.prompt,
            style: data.style,
            status: data.status,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            imageUrl: data.imageUrl,
            error: data.error
          });
        } else {
          onUpdate(null);
        }
      },
      (error) => {
        console.error('Error listening to generation updates:', error);
        if (onError) {
          onError(error);
        }
      }
    );
  }

  // Test Firebase Functions connection
  static async testConnection(): Promise<boolean> {
    try {
      const healthCheckFunction = httpsCallable(functions, 'healthCheck');
      const result = await healthCheckFunction();
      console.log('Firebase Functions connection test:', result.data);
      return true;
    } catch (error) {
      console.error('Firebase Functions connection test failed:', error);
      return false;
    }
  }
}