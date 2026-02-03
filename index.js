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

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  const result = await db.query('SELECT country_code FROM visited_countries');

  const countries = [];
  result.rows.forEach((country) => countries.push(country.country_code));
  
  console.log(result.rows);
  res.render('index.ejs', { countries: countries, total: countries.length });
  db.end();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
