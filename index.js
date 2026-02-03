import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.configDotenv();

const db = new pg.Client({
  user: 'postgres',
  password: process.env.PG_DB_PASSWORD,
  host: 'localhost',
  port: 5432,
  database: 'world',
});

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  //Write your code here.
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
