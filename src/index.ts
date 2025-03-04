import express from 'express';
import { initializeDatabase } from './config/database';

const app = express();

const Port = 3008;

app.get('/', (req, res) => {
  res.send('Hello World');
});

initializeDatabase()
  .then(() => {
    app.listen(Port, () => {
      console.log(`Server running on port ${Port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize the database:', error);
  });
