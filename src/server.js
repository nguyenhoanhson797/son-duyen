import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
  
  
const admin = require("firebase-admin");

const serviceAccount = require("./src/wedding-invitation-98d6a-firebase-adminsdk-3djbr-9f0f066b2d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wedding-invitation-98d6a-default-rtdb.asia-southeast1.firebasedatabase.app"
});

export const db = admin.firestore();

const express = require('express');
const appEndpoint = express();

// POST endpoint
appEndpoint.post('/guests', async (req, res) => {
  const guest = req.body;
  const docRef = await db.collection('guests').add(guest);
  const newGuest = await docRef.get();
  res.status(201).json(newGuest.data());
});

// PATCH endpoint
appEndpoint.patch('/guests/:id', async (req, res) => {
  const id = req.params.id;
  const guest = req.body;
  await db.collection('guests').doc(id).update(guest);
  const updatedGuest = await db.collection('guests').doc(id).get();
  res.json(updatedGuest.data());
});

// GET-all endpoint
appEndpoint.get('/guests', async (req, res) => {
  const snapshot = await db.collection('guests').get();
  const guests = snapshot.docs.map(doc => doc.data());
  res.json(guests);
});

// GET-one endpoint
appEndpoint.get('/guests/:id', async (req, res) => {
  const id = req.params.id;
  const guest = await db.collection('guests').doc(id).get();
  res.json(guest.data());
});

// DELETE endpoint
appEndpoint.delete('/guests/:id', async (req, res) => {
  const id = req.params.id;
  await db.collection('guests').doc(id).delete();
  res.status(204).send();
});

appEndpoint.listen(3000, () => {
  console.log('Server listening on port 3000');
});

