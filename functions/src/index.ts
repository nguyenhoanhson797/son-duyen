import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

const corsHandler = cors({origin: true});

interface GuestTypeAll {
  id: string
  name: string
  email: string
  phone: number
}

interface GuestType {
  name: string
  email: string
  phone: number
}

admin.initializeApp();

// POST endpoint to add a new guest
exports.createGuest =
functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  corsHandler(req, res, async () => {
    try {
      const guest = req.body;
      const result = await admin.firestore().collection("guests").add(guest);
      res.status(201).send(`Guest created with ID: ${result.id}`);
    } catch (error) {
      res.status(400).send(`Error creating guest: ${error}`);
    }
  });
});


// PATCH endpoint to update an existing guest
exports.updateGuest =
functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  corsHandler(req, res, async () => {
    try {
      const guestId = req.params.id;
      const guest = req.body;
      await admin.firestore().collection("guests").doc(guestId).update(guest);
      res.status(200).send(`Guest with ID: ${guestId} updated`);
    } catch (error) {
      res.status(400).send(`Error updating guest: ${error}`);
    }
  });
});


// GET-one endpoint to retrieve a single guest by ID
exports.getGuest =
functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  corsHandler(req, res, async () => {
    try {
      const guestId = req.params.id;
      const guest =
      await admin.firestore().collection("guests").doc(guestId).get();
      if (!guest.exists) {
        res.status(404).send(`Guest with ID: ${guestId} not found`);
      } else {
        res.status(200).send(guest.data());
      }
    } catch (error) {
      res.status(400).send(`Error getting guest: ${error}`);
    }
  });
});


// GET-all endpoint to retrieve all guests
exports.getAllGuests =
functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  corsHandler(req, res, async () => {
    try {
      const guests = await admin.firestore().collection("guests").get();
      const allGuests: GuestTypeAll[] = [];
      guests.forEach((guest) => {
        allGuests.push({id: guest.id, ...guest.data() as GuestType});
      });
      res.status(200).send(allGuests);
    } catch (error) {
      res.status(400).send(`Error getting guests: ${error}`);
    }
  });
});


// DELETE endpoint to delete an existing guest
exports.deleteGuest =
functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  corsHandler(req, res, async () => {
    try {
      const guestId = req.params.id;
      await admin.firestore().collection("guests").doc(guestId).delete();
      res.status(200).send(`Guest with ID: ${guestId} deleted`);
    } catch (error) {
      res.status(400).send(`Error deleting guest: ${error}`);
    }
  });
});
