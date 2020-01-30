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

app.get('/api/v1/manufacturers', (request, response) => {
  database('manufacturers').select()
    .then(manufacturers => response.status(200).json(manufacturers))
    .catch(error => response.status(500).json({ error }))
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