const express = require("express");

const app = express();
app.use(express.json());

const { initializeApp, getApps, cert } = require("firebase-admin/app");

const { getFirestore } = require("firebase-admin/firestore");

const credentials = require("./credentials.json");

function connectToFirestore() {
  if (!getApps().length) {
    initializeApp({
      credential: cert(credentials),
    });
  }
  return getFirestore();
}

const dsdb = connectToFirestore();

const custRef = dsdb.collection("customer");
const prodRef = dsdb.collection("product");
const ordRef = dsdb.collection("order");

app.listen(3000, () => {
  console.log("API Listening in on port 3000");
});

app.get("/", (request, response) => {
  response.send("Copy that. Message received over and out");
});

//adds new doc to collection
app.post("/customers", (request, response) => {
  const dsdb = connectToFirestore();
  dsdb
    .collection("customer")
    .add(request.body)
    .then(() => response.send("Customer added"))
    .catch(console.error);
});

//gets whole customer collection
app.get("/customers", (request, response) => {
  const dsdb = connectToFirestore();
  dsdb
    .collection("customer")
    .get()
    .then((snapshot) => {
      const customerList = snapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      response.send(customerList);
    })
    .catch(console.error);
});

app.get("/customers/:customerId", (request, response) => {
  console.log("my param request", request.params);
  const { customerId } = request.params;
  const dsdb = connectToFirestore();
  custRef
    .doc(customerId)
    .get()
    .then((doc) => {
      let singleCustomer = doc.data();
      console.log(doc.id, " => ", doc.data());
      response.send(singleCustomer);
    })
    .catch((err) => console.error(err));
});
