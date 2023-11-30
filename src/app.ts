import express, { Router } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';


import connect from './db/mongo';
import router from './routes';
import swaggerSpec from '../swaggerDef';

const app = express();
const port = 3010;

app.use('/documentation-api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(router);
app.use(bodyParser.json());

async function startApp() {
  await connect();

}

startApp();

app.listen(port, () => {
  return console.log(`Server is listening at http://localhost:${port}`);
});