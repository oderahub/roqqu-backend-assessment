import express from 'express';

const app = express();

const Port = 3008;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
