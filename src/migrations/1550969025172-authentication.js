const db = require("../persistence/db");

module.exports.up = async function (next) {
  const client = await db.connect();

  await client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY,
    identifier text,
    first_name text,
    last_name text,
    organization text,
    address text,
    email text UNIQUE,
    password text,
    role text
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users (id) ON DELETE CASCADE
  );
  
  
  CREATE TABLE IF NOT EXISTS provider(
    id uuid PRIMARY KEY,
    name text,
    description text,
    provider_image text
  );

  CREATE TABLE IF NOT EXISTS shifts (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users (id) ON DELETE CASCADE,
    provider_id uuid REFERENCES provider (id) ON DELETE CASCADE,
    shift_time timestamp,
    description text
  );

  `);

  await client.query(`
  CREATE INDEX users_email on users (email);

  CREATE INDEX sessions_user on sessions (user_id);
  `);

  await client.release(true);
  next();
};

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
  DROP TABLE sessions;
  DROP TABLE users;
  `);

  await client.release(true);
  next();
};
