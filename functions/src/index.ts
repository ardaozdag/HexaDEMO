/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onCall} from "firebase-functions/v2/https";
import {getFirestore} from "firebase-admin/firestore";
import {initializeApp} from "firebase-admin/app";
import * as logger from "firebase-functions/logger";

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Function to start logo generation process
export const startGeneration = onCall(async (request) => {
  try {
    const { prompt, style } = request.data;
    
    if (!prompt || !style) {
      throw new Error("Missing required fields: prompt and style");
    }

    logger.info("Starting generation process", { prompt, style });

    // Create a new document in the 'generations' collection
    const docRef = db.collection('generations').doc();
    
    // Set initial status to processing
    await docRef.set({
      prompt,
      style,
      status: 'processing',
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: null
    });

    logger.info("Document created with processing status", { docId: docRef.id });

    // Generate random delay between 30-60 seconds (30000-60000 ms)
    const delay = Math.floor(Math.random() * 30000) + 30000;
    
    logger.info("Generation will complete in", { delayMs: delay });

    // Use setTimeout to simulate generation process
    setTimeout(async () => {
      try {
        // Mock image URL - in a real app, this would be the generated image
        const mockImageUrl = "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop&crop=center";
        
        // Update the document to 'done' status
        await docRef.update({
          status: 'done',
          updatedAt: new Date(),
          imageUrl: mockImageUrl
        });

        logger.info("Generation completed", { docId: docRef.id, imageUrl: mockImageUrl });
      } catch (error) {
        logger.error("Error updating document to done status", error);
        
        // Update to error status if something goes wrong
        await docRef.update({
          status: 'error',
          updatedAt: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }, delay);

    // Return the document ID so the client can listen to it
    return {
      success: true,
      generationId: docRef.id,
      message: "Generation started successfully"
    };

  } catch (error) {
    logger.error("Error in startGeneration function", error);
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
});

// Health check function for testing
export const healthCheck = onCall(async () => {
  return {
    success: true,
    message: "Firebase Functions are working correctly",
    timestamp: new Date().toISOString()
  };
});
