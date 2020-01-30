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
    response.status(200).json({ manufacturers })

  } catch(error) {
    response.status(500).json({ error })
  }
});

app.get('/api/v1/cereals', (request, response) => {
  database('cereals').select()
    .then(cereals => response.status(200).json(cereals))
    .catch(error => response.status(500).json({ error }))
});

app.get('/api/v1/manufacturers/:id', (request, response) => {
  const { id } = request.params;

  database('manufacturers').where('id', id).select()
    .then(manufacturers => {
      manufacturers.length 
        ? response.status(200).json(manufacturers) 
        : response.status(404).json({
          error: `Could not find manufacturer with the id: ${id}`
        });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/cereals/:id', (request, response) => {
  const { id } = request.params;

  database('cereals').where('id', id).select()
    .then(cereals => {
      cereals.length 
        ? response.status(200).json(cereals) 
        : response.status(404).json({
          error: `Could not find cereal with the id: ${id}`
        });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/manufacturers', (request, response) => {
  const manufacturer = request.body;

  for (let requiredParameter of ['mfr', 'name']) {
    if(!manufacturer[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { mfr: <String>, name: <String> }. You're missing a "${requiredParameter}" property.` })
    }
  }
  database('manufacturers').insert(manufacturer, 'id')
    .then(manufacturer => {
      response.status(201).json({ id: manufacturer[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

app.post('/api/v1/cereals', (request, response) => {
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

  database('cereals').insert(cereal, 'id')
    .then(cereal => {
      response.status(201).json({ id: cereal[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    });
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