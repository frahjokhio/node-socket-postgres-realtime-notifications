import pgPromise from 'pg-promise';

const pgp = pgPromise();
const db = pgp({
  host: 'localhost',
  port: 5432, // postgreSQL database port
  database: 'real-time-notifications', // this can be any name
  user: 'postgres', // postgreSQL username of database
  password: 'password' // postgreSQL password of database
});

export default db;
