const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

// POST /api/zoos
server.post('/api/zoos', async (req, res) => {
  try {
    if (!req.body[0] === 'name') {
      return res
        .status(400)
        .json({ message: 'Please provide only a `name` property.' });
    }
    db('zoos')
      .returning(['id', 'name'])
      .insert(req.body)
      .then(newZooAdded => res.status(201).json(newZooAdded));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'There was an error completing the request:',
      error: error
    });
  }
});

// GET /api/zoos
server.get('/api/zoos', async (req, res) => {
  try {
    db.select()
      .table('zoos')
      .then(zoos => res.status(200).json(zoos));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'There was an error completing the request:',
      error: error
    });
  }
});

// GET /api/zoos/:id
server.get('/api/zoos/:id', async (req, res) => {
  try {
    db('zoos')
      .where('id', req.params.id)
      .select('*')
      .then(zoo => res.status(200).json(zoo));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'There was an error completing the request:',
      error: error
    });
  }
});

// DELETE /api/zoos/:id
server.delete('/api/zoos/:id', async (req, res) => {
  try {
    db('zoos')
      .where('id', req.params.id)
      .del()
      .then(deletedZoo => {
        if (!deletedZoo) {
          res
            .status(404)
            .json({ message: `Zoo with ID of ${req.params.id} not found.` });
        } else {
          res.status(204).end();
        }
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'There was an error completing the request:',
      error: error
    });
  }
});

// PUT /api/zoos/:id
server.put('/api/zoos/:id', (req, res) => {
  if (!req.body[0] === 'name') {
    return req
      .status(400)
      .json({ message: 'Please provide only a `name` property.' });
  }
  db('zoos')
    .where('id', req.params.id)
    .update(req.body, ['id', 'name'])
    .then(updatedZoo => res.status(201).json(updatedZoo))
    .catch(error => {
      console.error(error);
      res.status(500).json({
        message: 'There was an error completing the request:',
        error: error
      });
    });
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
