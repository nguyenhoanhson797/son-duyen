import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();
const guestsCollection = db.collection("guests");

// POST endpoint to add a new guest
export const addGuest =
functions.https.onRequest(async (request, response) => {
  // Set CORS headers
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'POST');
  response.set('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const {name, email, phone} = request.body;
    const guest = {name, email, phone};
    const docRef = await guestsCollection.add(guest);
    const newGuest = {id: docRef.id, ...guest};
    response.json(newGuest);
  } catch (error) {
    console.error(error);
    response.status(500).send("Error adding guest");
  }
});

// PATCH endpoint to update an existing guest
export const updateGuest =
functions.https.onRequest(async (request, response) => {
  // Set CORS headers
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'POST');
  response.set('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const {id} = request.params;
    const {name, email, phone} = request.body;
    const guest = {name, email, phone};
    await guestsCollection.doc(id).update(guest);
    response.json({id, ...guest});
  } catch (error) {
    console.error(error);
    response.status(500).send("Error updating guest");
  }
});

// GET-one endpoint to retrieve a single guest by ID
export const getGuestById =
functions.https.onRequest(async (request, response) => {
  // Set CORS headers
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'POST');
  response.set('Access-Control-Allow-Headers', 'Content-Type');
  
  try {
    const {id} = request.params;
    const doc = await guestsCollection.doc(id).get();
    if (!doc.exists) {
      response.status(404).send("Guest not found");
    } else {
      const guest = {id: doc.id, ...doc.data()};
      response.json(guest);
    }
  } catch (error) {
    console.error(error);
    response.status(500).send("Error retrieving guest");
  }
});

// GET-all endpoint to retrieve all guests
export const getAllGuests =
functions.https.onRequest(async (request, response) => {
  // Set CORS headers
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'POST');
  response.set('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const snapshot = await guestsCollection.get();
    const guests = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    response.json(guests);
  } catch (error) {
    console.error(error);
    response.status(500).send("Error retrieving guests");
  }
});

// DELETE endpoint to delete an existing guest
export const deleteGuest =
functions.https.onRequest(async (request, response) => {
  // Set CORS headers
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'POST');
  response.set('Access-Control-Allow-Headers', 'Content-Type');
  
  try {
    const {id} = request.params;
    await guestsCollection.doc(id).delete();
    response.json({id});
  } catch (error) {
    console.error(error);
    response.status(500).send("Error deleting guest");
  }
});
