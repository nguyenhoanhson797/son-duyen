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
      const pageSize =
      req.query.pageSize ?
        parseInt(req.query.pageSize as string) : 10;
      const pageToken = req.query.pageToken ?
        req.query.pageToken as string : "";

      let query =
      admin.firestore().collection(
        "guests"
      ).limit(pageSize);

      if (pageToken) {
        query = query.startAfter(pageToken);
      }

      const guests = await query.get();
      const allGuests: GuestTypeAll[] = [];
      guests.forEach((guest) => {
        allGuests.push({id: guest.id, ...guest.data()} as GuestTypeAll);
      });

      const nextPageToken =
      guests.docs.length === pageSize ?
        guests.docs[guests.docs.length - 1] : null;

      const previousPageToken = pageToken ?
        guests.docs[0] : null;

      res.status(200).send({
        data: allGuests,
        nextPageToken,
        previousPageToken,
      });
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
      res.status(400).send(`Error deleting guest: ${req.params} ${req.params.id} ${error}`);
    }
  });
});
