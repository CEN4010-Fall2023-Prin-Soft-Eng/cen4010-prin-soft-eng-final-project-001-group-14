// Group 14
// CEN 4010-001 - Dr. David Jaramillo
// documentation.js
// 11/02/23

const mongoose = require('mongoose')
const express = require('express')
const app = express()

const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require('glob');
const { type } = require('os');
const http = require('node:http');
const OAuth = require('oauth');
const axios = require('axios');

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Find-A-Dog API',
      version: '0.0.1'
    }
  },
  apis: ['find_a_dog.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('./public'));

let petFinderToken = "";
let petFinderTokenExpTime = -1;
let petFinderURL = "https://api.petfinder.com/v2";

async function GetPetFinderToken() {
  if (petFinderTokenExpTime == -1 || petFinderTokenExpTime >= Date.now()) {
    let data = await axios.post(`${petFinderURL}/oauth2/token`, {
      grant_type: "client_credentials",
      client_id: "gsGbJlyFiOUnXaOrOjcAphygIas5Mkk3UqbieAjOQhsOmOdBS5",
      client_secret: "uxXY2ZxIk7oWwQZ17auA5jC49i2vyVIMD7BlNbMV"
    });

    // Set the experation time to now + (experation duration in seconds - 10 seconds).
    petFinderTokenExpTime = Date.now() + ((data.data.expires_in - 10) * 1000); // Convert to milliseconds.
    petFinderToken = data.data.access_token;
  }

  return petFinderToken;
}

function ExtractRequiredDataArray(responseData) {
  let extractedData = [];
  responseData.animals.forEach(animal => {
    extractedData.push(ExtractRequiredData(animal));
  });

  return extractedData;
}

function ExtractRequiredData(animal) {
  let extractedData = {
    id: animal.id,
    name: animal.name,
    age: animal.age,
    sex: animal.gender,
    description: animal.description,
    webpage: animal.url,
    breed: {
      mixed: animal.breeds.mixed,
      primary: animal.breeds.primary,
      secondary: animal.breeds.secondary
    },
    contact: {
      phone: animal.contact.phone,
      email: animal.contact.email
    },
    location: {
      zipcode: animal.contact.address.postcode,
      city: animal.contact.address.city,
      state: animal.contact.address.state,
      country: animal.contact.address.country
    },
    milesAway: animal.distance
  };

  if (animal.photos.length > 0)
    extractedData.photoURL = animal.photos[0].full;
  else
    extractedData.photoURL = null;
  
  return extractedData;
}

/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Creates a new account object to use with the application.
 *     description: Use this endpoint to create a new account.
 *     parameters:
 *       - name: email
 *         description: The user's email.
 *         in: formData
 *         required: true
 *         schema:
 *         type: string
 *       - name: password
 *         description: The user's password.
 *         in: formData
 *         required: true
 *         schema:
 *           type: string
 *       - name: first_name
 *         description: The user's first name.
 *         in: formData
 *         required: true
 *         schema:
 *           type: string
 *       - name: last_name
 *         description: The user's last name.
 *         in: formData
 *         required: true
 *         schema:
 *           type: string
 *       - name: age
 *         description: The user's age.
 *         in: formData
 *         required: true
 *         schema:
 *           type: string
 *       - name: zip_code
 *         description: The user's zip code.
 *         in: formData
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Error. Unable to create account.
 *       201:
 *         description: Success. Created account.
 */
app.post('/accounts', function (req, res) {});

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Signs a user into their account and returns their account ID.
 *     description: Use this endpoint to sign a user into their account.
 *     parameters:
 *       - name: email
 *         description: The user's email.
 *         in: formData
 *         required: true
 *         schema:
 *           type: string
 *       - name: password
 *         description: The user's password.
 *         in: formData
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: 
 *         description: Success. User signed in and ID sucessfully retrieved.
 *       404:
 *         description: Error. Could not find user account.
 */
app.get('/accounts', function (req, res) {});

/**
 * @swagger
 * /accounts/{account_ID}:
 *   get:
 *     summary: Returns the information associated with an account by its ID.
 *     description: Use this endpoint to look up an account's info by its ID.
 *     parameters:
 *       - name: account_ID
 *         description: The ID associated with the account.
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: 
 *         description: Success. User account information retrieved.
 *       404:
 *         description: Error. Could not find user account.
 */
app.get('/accounts/:account_ID', function (req, res) {});

/**
 * @swagger
 * /accounts/{account_ID}:
 *   put:
 *     summary: Adds a dog to the favorites array in an account.
 *     description: Use this endpoint to add a favorite to a user's account.
 *     parameters:
 *       - name: account_ID
 *         description: The ID associated with the account.
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: dog_ID
 *         description: The ID of the dog to add to favorites.
 *         in: formData
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: 
 *         description: Success. Dog added to account's favorites.
 *       404:
 *         description: Error. Could not add dog to account's favorites.
 */
app.put('/accounts/:account_ID', function (req, res) {})

/**
 * @swagger
 * /dogs:
 *   get:
 *     summary: Enumerates a list of dogs that meets the user's criteria in the nearby area using the external API.
 *     description: Use this endpoint to get a list of dogs.
 *     parameters:
 *       - name: zip_code
 *         description: The user's zip code.
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: set
 *         description: Current set of dogs to enumerate.
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: radius
 *         description: The radius the user wishes to search in.
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: breed
 *         description: The user's breed preference.
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: sex
 *         description: The user's dog sex preference.
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: age
 *         description: The user's dog age preference.
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: size
 *         description: The user's dog size preference.
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: color
 *         description: The user's dog color preference.
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200: 
 *         description: Success. A list of dogs (near) fitting the criteria have been enumerated.
 *       404:
 *         description: Error. Could not enumerate list of nearby dogs.
 */
app.get('/dogs', function (req, res) {
  GetPetFinderToken().then(token => {
    if (!req.query.hasOwnProperty("radius"))
      throw new Error("A required query entry, radius, is missing");
    if (!req.query.hasOwnProperty("zip_code"))
      throw new Error("A required query entry, zip_code, is missing");
    if (!req.query.hasOwnProperty("set"))
      throw new Error("A required query entry, set, is missing");

    let petFinderRequest = `${petFinderURL}/animals?type=dog&distance=${req.query.radius}&location=${req.query.zip_code}&page=${req.query.set}`;
    if (req.query.hasOwnProperty("breed"))
      petFinderRequest += `&breed=${req.query.breed}`;
    if (req.query.hasOwnProperty("sex"))
      petFinderRequest += `&gender=${req.query.sex}`;
    if (req.query.hasOwnProperty("age"))
      petFinderRequest += `&age=${req.query.age}`;
    if (req.query.hasOwnProperty("size"))
      petFinderRequest += `&size=${req.query.size}`;
    if (req.query.hasOwnProperty("color"))
      petFinderRequest += `&color=${req.query.color}`;

    axios.get(petFinderRequest, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      let output = ExtractRequiredDataArray(response.data);
      res.status(200).send(output);
    })
    .catch(error => {
      res.status(404).send(error.message);
      console.error(error);
    });
  })
  .catch(error => {
    res.status(404).send(error.message);
    console.error(error);
  });
});

/**
 * @swagger
 * /dogs/{dog_ID}:
 *   get:
 *     summary: Searches a dog based on its associated ID.
 *     description: Use this endpoint to look up a dog by its ID.
 *     parameters:
 *       - name: dog_ID
 *         description: The ID associated with a dog.
 *         in: path
 *         required: true
 *         schema:
 *           type: string            
 *     responses:
 *       200: 
 *         description: Success. The dog has been retrieved.
 *       404:
 *         description: Error. Could not find the dog associated with this ID.
 */
app.get('/dogs/:dog_ID', function (req, res) {
  if (!req.params.hasOwnProperty("dog_ID"))
    throw new Error("dog_ID param entry missing.");
  
  GetPetFinderToken().then(token => {
    axios.get(`${petFinderURL}/animals/${req.params.dog_ID}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      res.status(200).send(ExtractRequiredData(response.data.animal));
    })
    .catch(error => {
      res.status(404).send(error.message);
      console.error(error);
    })
  })
  .catch(error => {
    res.status(404).send(error.message);
    console.error(error);
  });
});

// // MongoDB Connection
const uri = "mongodb+srv://dogDbUser:E7fkiBoK1tpbzoX7@findadog.q0uwgbr.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri)
    .then(() => {
      console.log("MongoDB connected");

      // starting express server in block of mongoose.connect to ensure proper connection
      const port = process.env.PORT || 5678;
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log('Webapp: http://localhost:' + port + '/');
        console.log('API Docs: http://localhost:' + port + '/api-docs');
      });
    })
    .catch(err => console.log(err));

// commented out and moved into mongoose.connect block as db needs to be functional before server starts
// var port = process.env.PORT || 5678;
// app.listen(port); //start the server
// console.log('Server is running...');
// console.log('Webapp:   http://localhost:5678/');
// console.log('API Docs: http://localhost:5678/api-docs');