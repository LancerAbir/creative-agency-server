const express = require("express");

//** ENV file */
require("dotenv").config();

//** Third Party Middleware */
const bodyParser = require("body-parser");
const cors = require("cors");

//** Import File Upload */
const fileUpload = require("express-fileupload");

//** Import JWT Private Key Path  */
// var admin = require("firebase-admin");

//** MongoDB Import */
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0evig.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

//** Mother App */
const app = express();

//** Middle Ware */
const middleware = [
   express.static("agencyImg"),
   express.urlencoded({ extended: true }),
   express.json(),
   bodyParser.json(),
   cors(),
   fileUpload(),
];
app.use(middleware);

//** JWT Private Key Path  */
// var serviceAccount = require("./volunteer-mern-project-firebase-adminsdk-gbnhh-ebba0ce8c5.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://volunteer-mern-project.firebaseio.com"
// });

//** PORT */
const port = 7000;

//** Root Route */
app.get("/", (req, res) => {
   res.send("Hello World!");
});

//** MongoDB Set Up */
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});
client.connect((err) => {
   //** MongoDB Collections list */
   const creativeAgencyCollection = client
      .db(`${process.env.DB_NAME}`)
      .collection(`${process.env.DB_COLLECTION}`);
   const creativeAgencySingleCollection = client
      .db(`${process.env.DB_NAME}`)
      .collection(`${process.env.DB_COLLECTION2}`);
   const creativeAgencyFeedbackCollection = client
      .db(`${process.env.DB_NAME}`)
      .collection(`${process.env.DB_COLLECTION3}`);
   const creativeAgencyAddAdminCollection = client
      .db(`${process.env.DB_NAME}`)
      .collection(`${process.env.DB_COLLECTION4}`);
   console.log("Database Has Successfully Connected");

   //** POST --> Insert Service Data & Save in Database */
   app.post("/addService", (req, res) => {
      const file = req.files.files;
      const title = req.body.title;
      const description = req.body.description;
      const newImg = file.data;
      const encImg = newImg.toString("base64");
      console.log(file, title, description);

      var image = {
         contentType: file.mimetype,
         size: file.size,
         img: Buffer.from(encImg, "base64"),
      };
      creativeAgencyCollection
         .insertOne({ title, description, image })
         .then((result) => {
            res.send(result.insertedCount > 0);
         });
   });

   //** GET --> Show All Service Data */
   app.get("/service", (req, res) => {
      creativeAgencyCollection.find({}).toArray((err, documents) => {
         res.send(documents);
      });
   });

   //** POST --> Insert Single Service Data & Save in Database */
   app.post("/singleService", (req, res) => {
      const newSingle = req.body;
      creativeAgencySingleCollection.insertOne(newSingle).then((result) => {
         console.log(result.insertedCount);
         res.send(result.insertedCount > 0);
      });
   });

   //** GET --> Show All Single Service Data */
   app.get("/sService", (req, res) => {
      console.log(req.query.email);
      creativeAgencySingleCollection
         .find({ email: req.query.email })
         .toArray((err, documents) => {
            res.send(documents);
         });
   });

   //** GET --> Show All Single Service Data */
   app.get("/showService", (req, res) => {
      creativeAgencySingleCollection.find({}).toArray((err, documents) => {
         res.send(documents);
      });
   });

   //** POST --> Insert Single Service Data & Save in Database */
   app.post("/review", (req, res) => {
      const newReview = req.body;
      creativeAgencyFeedbackCollection.insertOne(newReview).then((result) => {
         console.log(result.insertedCount);
         res.send(result.insertedCount > 0);
      });
   });

   //** GET --> Show All Single Service Data */
   app.get("/showFeedback", (req, res) => {
      creativeAgencyFeedbackCollection.find({}).toArray((err, documents) => {
         res.send(documents);
      });
   });

   //** POST --> Insert Single Service Data & Save in Database */
   app.post("/addAdmin", (req, res) => {
      const newAdmin = req.body;
      creativeAgencyAddAdminCollection.insertOne(newAdmin).then((result) => {
         console.log(result.insertedCount);
         res.send(result.insertedCount > 0);
      });
   });

   //** GET --> Show All Single Service Data */
   app.get("/admin", (req, res) => {
      creativeAgencyAddAdminCollection.find({}).toArray((err, documents) => {
         res.send(documents);
      });
   });
});

//** App Listen */
app.listen(process.env.PORT || port);
