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

const checkVisitedCountries = async function () {
  const result = await db.query('SELECT country_code FROM visited_countries');

  const visitedCountries = [];
  result.rows.forEach((country) => visitedCountries.push(country.country_code));

  return visitedCountries;
};

const getCountryCode = async function (countryName) {
  const query = `SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'`;
  const countryCode = (
    await db.query(query, [countryName.toLowerCase()])
  ).rows.at(0).country_code;

  return countryCode;
};

const addNewCountry = async function (countryCode) {
  const query = `INSERT INTO visited_countries(country_code) VALUES($1)`;
  await db.query(query, [countryCode]);
};

app.get('/', async (req, res) => {
  const visitedCountries = await checkVisitedCountries();

  res.render('index.ejs', {
    countries: visitedCountries,
    total: visitedCountries.length,
  });
});

app.post('/add', async (req, res) => {
  const newCountry = req.body.country;
  try {
    const countryCode = await getCountryCode(newCountry);
    try {
      await addNewCountry(countryCode);
      res.redirect('/');
    } catch (err) {
      console.log(err);
      const visitedCountries = await checkVisitedCountries();
      res.render('index.ejs', {
        countries: visitedCountries,
        total: visitedCountries.length,
        error: 'Country has already been added, try again.',
      });
    }
  } catch (err) {
    console.log(err);
    const visitedCountries = await checkVisitedCountries();
    res.render('index.ejs', {
      countries: visitedCountries,
      total: visitedCountries.length,
      error: 'Country name does not exist, try again.',
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
