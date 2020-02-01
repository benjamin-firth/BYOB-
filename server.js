const express = require('express');
// Imports the express library for node.js.
const app = express();
// This is the instance of the express app wI'm using.
const environment = process.env.NODE_ENV || 'development';
// defines the environment for the server to run in. If one isn't defined, it defaults to 'development'.
const configuration = require('./knexfile')[environment];
// This gerts the knex configuration file based on the environment.
const database = require('knex')(configuration);
// This connects the database.

app.set('port', process.env.PORT || 3001);
// This sets the port that the server can run on.
app.use(express.json());
// This allows express to use JSON data.
app.listen(app.get('port'), () => {
  // Tells express to listen for activity on port 3001
  console.log(`App is running on http://localhost:${app.get('port')}.`)
  // Console.logs the port that the server is running on.
});

app.get('/api/v1/manufacturers', async (request, response) => {
  // This is the async GET route for all manufacturers.
  try {
    // THis is the try block.  
    // The code attempts this first, and if fails bumps to the catch block.
    const manufacturers = await database('manufacturers').select();
    // This assigns the value of the databases returned manufacturers table to a variable.
    response.status(200).json({ manufacturers });
    // This sends an OK 200 status code, and the JSON manufacturers object.
  } catch (error) {
    // if the try block doesn't work this code is run, passing in the error object.
    response.status(500).json({ error });
    // This sends a 500 server error with the JSON error object.
  }
});

app.get('/api/v1/cereals', async (request, response) => {
  // This is the async GET route for all cereals.
  try {
    // THis is the try block.  
    // The code attempts this first, and if fails bumps to the catch block.
    const cereals = await database('cereals').select();
    // This assigns the value of the databases returned cereals table to a variable.
    response.status(200).json({ cereals });
    // This sends an OK 200 status code, and the JSON cereals object.
  } catch (error) {
    // if the try block doesn't work this code is run, passing in the error object.
    response.stuatus(500).json({ error });
    // This sends a 500 server error with the JSON error object.
  }
});

app.get('/api/v1/manufacturers/:id', async (request, response) => {
  // This is the async GET route for a specific manufacturer.
  const { id } = request.params;
  // This destructures the id key off the params property.
  try {
    // THis is the try block.  
    // The code attempts this first, and if fails bumps to the catch block.
    const manufacturer = await database('manufacturers').where('id', id).select();
    // This assigns the value of the databases returned manufacturer at a specific id to a variable.
    manufacturer.length 
    // This is checking to see if the manufacturer array has anything in it.
      ? response.status(200).json(manufacturer[0]) 
      // This sends an OK 200 status code, and the JSON manufacturer object for the specific id.
      : response.status(404).json({
        // This sends an client side 404 error code if the mfr array didn't have anything in it.
        error: `Could not find manufacturer with the id: ${id}`
      });
  } catch (error) {
    // if the try block doesn't work this code is run, passing in the error object.
    response.status(500).json({ error });
    // This sends a 500 server error with the JSON error object.
  }
});

app.get('/api/v1/cereals/:id', async (request, response) => {
  // This is the async GET route for a specific cereal.
  const { id } = request.params;
  // This destructures the id key off the params property.
  try {
    // THis is the try block.  
    // The code attempts this first, and if fails bumps to the catch block.
    const cereal = await database('cereals').where('id', id).select();
    // This assigns the value of the databases returned cereal at a specific id to a variable.
    cereal.length
    // This is checking to see if the cereal array has anything in it.
      ? response.status(200).json(cereal[0])
      // This sends an OK 200 status code, and the JSON cereal object with the specific id.
      : response.status(404).json({
        // This sends an client side 404 error code if the cereal array didn't have anything in it.
        error: `Could not find cereal with the id: ${id}`
      });
  } catch (error) {
    // if the try block doesn't work this code is run, passing in the error object.
    response.status(500).json({ error });
    // This sends a 500 server error with the JSON error object.
  }
});

app.post('/api/v1/manufacturers', async (request, response) => {
  // This is the async POST route for a manufacturer.
  const manufacturer = request.body;
  // This is the requset body to post, assigned to a variable.
  for (let requiredParameter of ['mfr', 'name']) {
    // This loops through the array of required params, and each time through the value is assigned to requiredParameter.
    if(!manufacturer[requiredParameter]) {
      // THis checks if the body object is missing any required parameters.
      return response
        .status(422)
        .send({ error: `Expected format: { mfr: <String>, name: <String> }. You're missing a "${requiredParameter}" property.` })
        // This sends a 422 unprocessable entity error.
    }
  }
  try {
    // THis is the try block.  
    // The code attempts this first, and if fails bumps to the catch block.
    const id = await database('manufacturers').insert(manufacturer, 'id');
    // THis waits for the database to insert the new manufacturer object into the database and returns the object in an array.
    response.status(201).json({ id: id[0] });
    // This sends an OK 201 response and the JSON id object.
  } catch (error) {
    // if the try block doesn't work this code is run, passing in the error object.
    response.status(500).json({ error });
    // This sends a 500 server error with the JSON error object.
  }
});

app.post('/api/v1/cereals', async (request, response) => {
  // This is the async POST route for a cereal.
  const cereal = request.body;
  // This is the requset body to post, assigned to a variable.
  for (let requiredParameter of ['name', 'mfr', 'type', 'calories', 'protein', 'fat', 'sodium', 'fiber', 'carbo', 'sugars', 'potass', 'vitamins', 'shelf', 'weight', 'cups', 'rating']) {
    // This loops through the array of required params, and each time through the value is assigned to requiredParameter.
    if(!cereal[requiredParameter] && cereal[requiredParameter] !== 0) {
      // THis checks if the body object is missing any required parameters and checks if any of them equal zero because that reads falsy, and no food could have a zero quantity.
      return response
        .status(422)
        .send({ error: `Expected format: { 
            name: <String>,
            type: <String>, 
            calories: <Integer>,
            protein: <Integer>,
            fat: <Integer>,
            sodium: <Integer>,
            fiber: <Integer>,
            carbo: <Integer>,
            sugars: <Integer>,
            potass: <Integer>,
            vitamins: <Integer>,
            shelf: <Integer>,
            weight: <Integer>,
            cups: <Decimal>,
            rating: <Decimal>,
            mfr_id: <Integer>,
           }. You're missing a "${requiredParameter}" property.` })
           // This sends a 422 unprocessable entity error.
    }
  }

  try {
    // THis is the try block.  
    // The code attempts this first, and if fails bumps to the catch block.
    const id = await database('cereals').insert(cereal, 'id');
    // THis waits for the database to insert the new cereal object into the database and returns the object in an array.
    response.status(201).json({ id: id[0] });
    // This sends an OK 201 response and the JSON id object.
  } catch (error) {
    // if the try block doesn't work this code is run, passing in the error object.
    response.status(500).json({ error });
    // This sends a 500 server error with the JSON error object.
  }
});

app.delete('/api/v1/cereals/:id', async (request, response) => {
  // This is the async DELETE route for a specific cereal.
  const { id } = request.params;
  // This destructures the id key off the params property.
  await database('cereals').where('id', id).del()
  // This waits for the database to return the cereal object at a specific id and then deletes it.
    try {
      // THis is the try block.  
      // The code attempts this first, and if fails bumps to the catch block.
      response.status(204).json();
      // This sends an OK 204 status code, after deleting the cereal object with the specific id.
    } catch (error) {
      // if the try block doesn't work this code is run, passing in the error object.
      response.status(500).json({ error });
      // This sends a 500 server error with the JSON error object.
    }
});