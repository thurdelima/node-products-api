import express from 'express';
const app = express();
import connect from './db/mongo';
const port = 3010;


app.get('/', (req, res) => {
  res.send('Hello World!');
});


async function startApp() {
  await connect();

  // The rest of your application logic goes here
}

startApp();

app.listen(port, () => {
  return console.log(`Server is listening at http://localhost:${port}`);
});