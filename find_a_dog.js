// Group 14
// CEN 4010-001 - Dr. David Jaramillo
// documentation.js
// 11/02/23

const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require("glob");
const { type } = require('os');

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

/**
 * @swagger
 * /accounts:
 *      register:
 *          summary: Creates a new account object to use with the application.
 *          description: Use this endpoint to create a new account.
 *          parameters:
 *              -name: email
 *               description: The user's email.
 *               in: formData
 *               required: true
 *               schema:
 *                  type: string
 *              -name: password
 *               description: The user's password.
 *               in: formData
 *               required: true
 *               schema:
 *                  type: string
 *              -name: first_name
 *               description: The user's first name.
 *               in: formData
 *               required: true
 *               schema:
 *                  type: string
 *              -name: last_name
 *               description: The user's last name.
 *               in: formData
 *               required: true
 *               schema:
 *                  type: string
 *              -name: age
 *               description: The user's age.
 *               in: formData
 *               required: true
 *               schema:
 *                  type: string
 *              -name: zip_code
 *               description: The user's zip code.
 *               in: formData
 *               required: true
 *               schema:
 *                  type: string
 *      responses:
 *          200:
 *              description: Error. Unable to create account.
 *          201:
 *              description: Success. Created account.
 */
app.post('/accounts', function (req, res) {});

/**
 * @swagger
 * /accounts:
 *      sign_in:
 *          summary: Signs a user into their account and returns their account ID.
 *          description: Use this endpoint to sign a user into their account.
 *          parameters:
 *              -name: email
 *               description: The user's email.
 *               in: formData
 *               required: true
 *               schema:
 *                  type: string
 *              -name: password
 *               description: The user's password.
 *               in: formData
 *               required: true
 *               schema:
 *                  type: string
 *      responses:
 *          200: 
 *              description: Success. User signed in and ID sucessfully retrieved.
 *          404:
 *              description: Error. Could not find user account.
 */
app.get('/accounts', function (req, res) {});

/**
 * @swagger
 * /accounts/account_ID:
 *      get_account_info:
 *          summary: Returns the information associated with an account by its ID.
 *          description: Use this endpoint to look up an account's info by its ID.
 *          parameters:
 *              -name: account_ID
 *               description: The ID associated with the account.
 *               in: path
 *               required: true
 *               schema:
 *                  type: string
 */
app.get('/accounts/:account_ID', function (req, res) {});

/**
 * @swagger
 * /accounts/account_ID:
 *      add_favorite_dog:
 *          summary: Adds a dog to the favorites array in an account.
 *          description: Use this endpoint to add a favorite to a user's account.
 *          parameters:
 *              -name: account_ID
 *               description: The ID associated with the account.
 *               in: path
 *               required: true
 *               schema:
 *                  type: string
 *              -name: dog_ID
 *               description: The ID of the dog to add to favorites.
 *               in: formData
 *               required: true
 *               schema:
 *                  type: string
 */
app.put('/accounts/:account_ID', function (req, res) {})

/**
 * @swagger
 * /dogs:
 *      enumerate:
 *          summary: Enumerates a list of dogs that meets the user's criteria in the nearby area using the external API.
 *          description: Use this endpoint to get a list of dogs.
 *          parameters:
 *              -name: radius
 *               description: The radius the user wishes to search in.
 *               in: formData
 *               required: true
 *               schema:
 *                  type: string
 *              -name: breed
 *               description: The user's breed preference.
 *               in: formData
 *               required: false
 *               schema:
 *                  type: string
 *              -name: sex
 *               description: The user's dog sex preference.
 *               in: formData
 *               required: false
 *               schema:
 *                  type: string
 *              -name: min_age
 *               description: The user's dog minimum age preference.
 *               in: formData
 *               required: false
 *               schema:
 *                  type: string
 *              -name: max_age
 *               description: The user's dog maximum age preference.
 *               in: formData
 *               required: false
 *               schema:
 *                  type: string
 *              -name: size
 *               description: The user's dog size preference.
 *               in: formData
 *               required: false
 *               schema:
 *                  type: string
 *              -name: color
 *               description: The user's dog color preference.
 *               in: formData
 *               required: false
 *               schema:
 *                  type: string
 *          responses:
 *          200: 
 *              description: Success. A list of dogs (near) fitting the criteria have been enumerated.
 *          404:
 *              description: Error. Could not enumerate list of nearby dogs.
 */
app.get('/dogs', function (req, res) {});

/**
 * @swagger
 * /dogs/dog_ID:
 *      search_dog:
 *          summary: Searches a dog based on its associated ID.
 *          description: Use this endpoint to look up a dog by its ID.
 *          parameters:
 *              -name: dog_ID
 *               description: The ID associated with a dog.
 *               in: path
 *               required: true
 *               schema:
 *                  type: string            
 *      responses:
 *          200: 
 *              description: Success. The dog has been retrieved.
 *          404:
 *              description: Error. Could not find the dog associated with this ID. 
 */
app.get('/dogs/:dog_ID', function (req, res) {});