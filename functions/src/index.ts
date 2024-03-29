import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
import * as dayjs from "dayjs";

type Dayjs = dayjs.Dayjs

interface GuestType {
  id: string
  name: string
  phone: number
  email: string
  note: string
  wishes: string
  createdAt: Dayjs
}

type WishesType = Pick<GuestType, "id" | "name" | "wishes">

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
      const result =
        await admin.firestore().collection("guests").add(guest);
      const id = result.id;
      await
      admin
        .firestore()
        .collection("guests")
        .doc(id)
        .update({id: id, createdAt: dayjs().toISOString()});
      // const collectionRef = admin.firestore().collection("guests");
      // const resResult = result.get();
      const data = await result.get();
      res.status(200).send(data.data());
    } catch (error) {
      res.status(400).send(undefined);
    }
  });
});

// PATCH endpoint to update an existing guest
exports.updateGuest =
functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  corsHandler(req, res, async () => {
    try {
      const collectionRef = admin.firestore().collection("guests");
      const guestId = req.query.id as string;
      const guest = req.body;
      await collectionRef.doc(guestId).update(guest);
      const data = await collectionRef.doc(guestId).get();
      res.status(200).send(data.data());
    } catch (error) {
      res.status(400).send(undefined);
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
      const data = await collectionRef.doc(id).get();
      if (!data.exists) {
        res.status(404).send("Guest not found");
      } else {
        const resData = data.data();
        res.status(200).send(resData);
      }
    } catch (error) {
      res.status(400).send(`Error getting guests: ${error}`);
    }
  });
});

// GET-all endpoint to retrieve all wishes
exports.getAllWishes =
functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  corsHandler(req, res, async () => {
    try {
      const collectionRef = admin.firestore().collection("guests");
      let query: admin.firestore.Query<admin.firestore.DocumentData> =
      collectionRef;
      query = query.where("wishes", "!=", null);
      const guests = await query.get();
      const allGuests: WishesType[] = [];
      guests.forEach((guest) => {
        allGuests.push({
          id: guest.id,
          name: guest.data().name,
          wishes: guest.data().wishes,
        });
      });

      res.status(200).send({
        data: allGuests,
      });
    } catch (error) {
      res.status(400).send(undefined);
    }
  });
});

exports.getAllGuests =
functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  corsHandler(req, res, async () => {
    try {
      const searchQuery = req.query.name ?
        (req.query.name as string) :
        undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const collectionRef = admin.firestore().collection("guests");
      let query: admin.firestore.Query<admin.firestore.DocumentData> =
        collectionRef.orderBy("name");

      let nextCursor = null;
      let prevCursor = null;

      const nextPage = req.query.nextPage;
      const prevPage = req.query.prevPage;

      // TODO Check if there is a paging cursor
      if (nextPage) {
        const startAfterDoc =
          await collectionRef.doc(nextPage.toString()).get();
        query = query.limit(limit).startAt(startAfterDoc);
      } else if (prevPage) {
        const endOfDoc =
          await collectionRef.doc(prevPage.toString()).get();
        query = query.limitToLast(limit).endAt(endOfDoc);
      } else {
        query = query.limit(limit);
      }

      if (searchQuery) {
        query = query.where("name", ">=", searchQuery)
          .where("name", "<", searchQuery + "\uf8ff");
      }

      const guests = await query.get();
      const allGuests: GuestType[] = guests.docs.map((guest) => {
        return {id: guest.id, ...guest.data()} as GuestType;
      });

      try {
        // TODO Define new cursor
        if (allGuests.length >= 1) {
          // Id of last item in list
          const lastItem = guests.docs[guests.docs.length - 1];
          // Id of first item in list
          const firstItem = guests.docs[0];

          if (allGuests.length === limit) {
            const collectionRef1 = admin.firestore().collection("guests");
            // Find the next doc
            const nextToLastDocSnap =
              await
              collectionRef1
                .orderBy("name")
                .startAfter(lastItem)
                .limit(1)
                .get();
            const nextToLastDocId = nextToLastDocSnap.docs[0]?.id;
            // If next doc exsist
            if (nextToLastDocId) {
              nextCursor = nextToLastDocId;
            }
          }
          const collectionRef2 = admin.firestore().collection("guests");
          // Find the prev doc
          const prevFromFirstDocSnap =
            await
            collectionRef2
              .orderBy("name")
              .endBefore(firstItem)
              .limitToLast(1)
              .get();
          const prevFromFirstDocId = prevFromFirstDocSnap.docs[0]?.id;
          // If prev doc exsist
          if (prevFromFirstDocId) {
            prevCursor = prevFromFirstDocId;
          }
        }
      } catch (error) {
        console.error(error);
      }

      const paging = {
        nextPage: nextCursor,
        prevPage: prevCursor,
      };

      res.status(200).send({
        data: allGuests,
        paging: paging,
      });
    } catch (error) {
      res.status(400).send(undefined);
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
