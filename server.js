const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3001);
app.use(express.json());
app.listen(app.get('port'), () => {
  console.log(`App is running on http://localhost:${app.get('port')}.`)
});

app.get('/api/v1/manufacturers', async (request, response) => {
  try {
    const manufacturers = await database('manufacturers').select();
    response.status(200).json({ manufacturers });
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.get('/api/v1/cereals', async (request, response) => {
  try {
    const cereals = await database('cereals').select();
    response.status(200).json({ cereals });
  } catch (error) {
    response.stuatus(500).json({ error });
  }
});

app.get('/api/v1/manufacturers/:id', async (request, response) => {
  const { id } = request.params;

  try {
    const manufacturer = await database('manufacturers').where('id', id).select();
    manufacturer.length 
      ? response.status(200).json(manufacturer[0]) 
      : response.status(404).json({
        error: `Could not find manufacturer with the id: ${id}`
      });
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.get('/api/v1/cereals/:id', async (request, response) => {
  const { id } = request.params;

  try {
    const cereal = await database('cereals').where('id', id).select();
    cereal.length
      ? response.status(200).json(cereal[0])
      : response.status(404).json({
        error: `Could not find cereal with the id: ${id}`
      });
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.post('/api/v1/manufacturers', async (request, response) => {
  const manufacturer = request.body;

  for (let requiredParameter of ['mfr', 'name']) {
    if(!manufacturer[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { mfr: <String>, name: <String> }. You're missing a "${requiredParameter}" property.` })
    }
  }
  try {
    const id = await database('manufacturers').insert(manufacturer, 'id');
    response.status(201).json({ id: id[0] });
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.post('/api/v1/cereals', async (request, response) => {
  const cereal = request.body;

  for (let requiredParameter of ['name', 'mfr', 'type', 'calories', 'protein', 'fat', 'sodium', 'fiber', 'carbo', 'sugars', 'potass', 'vitamins', 'shelf', 'weight', 'cups', 'rating']) {
    if(!cereal[requiredParameter] && cereal[requiredParameter] !== 0) {
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
    }
  }

  try {
    const id = await database('cereals').insert(cereal, 'id');
    response.status(201).json({ id: id[0] });
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.delete('/api/v1/cereals/:id', async (request, response) => {
  const { id } = request.params;

  await database('cereals').where('id', id).del()
    try {
      response.status(204).json();
    } catch (error) {
      response.status(500).json({ error });
    }
});