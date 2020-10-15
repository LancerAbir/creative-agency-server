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

//** PORT */
const port = 7000;

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
   const creativeAgencyCollection = client
      .db(`${process.env.DB_NAME}`)
      .collection(`${process.env.DB_COLLECTION}`);
   console.log("Database Has Successfully Connected");

   //** POST --> Insert Data & Save Database */
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

   app.get("/service", (req, res) => {
      creativeAgencyCollection.find({}).toArray((err, documents) => {
         res.send(documents);
      });
   });
});

//** App Listen */
app.listen(process.env.PORT || port);
