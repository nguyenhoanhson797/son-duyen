import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

interface GuestType {
  id: string
  name: string
  phone: number
  email: string
  note: string
}

const corsHandler = cors({
  origin: true,
});

admin.initializeApp();

// POST endpoint to add a new guest
exports.createGuest =
functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  corsHandler(req, res, async () => {
    try {
      const guest = req.body;
      const result = await admin.firestore().collection("guests").add(guest);
      const id = result.id;
      await admin.firestore().collection("guests").doc(id).update({Id: id});
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
      const guestId = req.query.id as string;
      const guest = req.body;
      await admin.firestore().collection("guests").doc(guestId).update(guest);
      res.status(200).send(`Guest with ID: ${guestId} updated`);
    } catch (error) {
      res.status(400).send(`Error updating guest: ${error}`);
    }
  });
});

// GET 1 endpoint to retrieve 1 guests
exports.getGuestById =
functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  corsHandler(req, res, async () => {
    try {
      const collectionRef = admin.firestore().collection("guests");
      const id = req.query.id as string;
      const guest = collectionRef.where("Id", "==", id);
      const data = await guest.get();
      if (data.empty) {
        res.status(404).send("Guest not found");
      } else {
        const resData = data.docs[0].data();
        res.status(200).send(resData);
      }
    } catch (error) {
      res.status(400).send(`Error getting guests: ${error}`);
    }
  });
});

// GET-all endpoint to retrieve all guests
// exports.getAllGuests =
// functions.https.onRequest(async (req, res) => {
//   res.set("Access-Control-Allow-Origin", "*");
//   corsHandler(req, res, async () => {
//     try {
//       const searchQuery = req.query.name ?
//         req.query.name as string : undefined;

//       const collectionRef = admin.firestore().collection("guests");
//       let query: admin.firestore.Query<admin.firestore.DocumentData> =
//       collectionRef;
//       if (searchQuery) {
//         query = collectionRef.where(
//           "name", ">=", searchQuery
//         ).where(
//           "name", "<", searchQuery + "\uf8ff"
//         );
//       }
//       const guests = await query.get();
//       const allGuests: GuestType[] = [];
//       guests.forEach((guest) => {
//         allGuests.push({id: guest.id, ...guest.data()} as GuestType);
//       });

//       res.status(200).send({
//         data: allGuests,
//       });
//     } catch (error) {
//       res.status(400).send(`Error getting guests: ${error}`);
//     }
//   });
// });

exports.getAllGuests = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  corsHandler(req, res, async () => {
    try {
      const searchQuery = req.query.name ?
        (req.query.name as string) :
        undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;

      const collectionRef = admin.firestore().collection("guests");
      let query: admin.firestore.Query<admin.firestore.DocumentData> =
        collectionRef;

      if (searchQuery) {
        query = query.where("name", ">=", searchQuery)
          .where("name", "<", searchQuery + "\uf8ff");
      }

      const startAfterDoc = await collectionRef
        .orderBy("name")
        .limit((page - 1) * limit)
        .get()
        .then((snapshot) => snapshot.docs[snapshot.docs.length - 1]);

      if (startAfterDoc) {
        query = query.startAfter(startAfterDoc);
      }

      query = query.limit(limit);

      const guests = await query.get();
      const allGuests: GuestType[] = [];
      let nextPage: number | null = null;
      let prevPage: number | null = null;

      guests.forEach((guest) => {
        allGuests.push({id: guest.id, ...guest.data()} as GuestType);
      });

      if (guests.docs.length > 0) {
        nextPage = page + 1;
        if (page > 1) {
          prevPage = page - 1;
        }
      }

      const paging = {
        page: page,
        nextPage: nextPage,
        prevPage: prevPage,
      };

      res.status(200).send({
        data: allGuests,
        paging: paging,
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
      const guestId = req.query.id as string;
      await admin.firestore().collection("guests").doc(guestId).delete();
      res.status(200).send(`Guest with ID: ${guestId} deleted`);
    } catch (error) {
      res.status(400).send(`Error updating guest: ${error}`);
    }
  });
});
