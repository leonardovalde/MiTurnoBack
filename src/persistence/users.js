const sql = require("sql-template-strings");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const db = require("./db");

module.exports = {
  async create(
    email,
    password,
    role,
    identifier,
    first_name,
    last_name,
    organization,
    address
  ) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const { rows } = await db.query(sql`
      INSERT INTO users (id, identifier, first_name, last_name, organization, address, email, password, role )
        VALUES (${uuidv4()}, ${identifier}, ${first_name}, ${last_name}, ${organization}, ${address}, ${email}, ${hashedPassword}, ${role})
        RETURNING id, identifier, first_name, last_name, organization, address, email, role;
      `);

      const [user] = rows;
      // db.end();
      return user;
    } catch (error) {
      if (error.constraint === "users_email_key") {
        return null;
      }

      throw error;
    }
  },
  async find(email) {
    const { rows } = await db.query(sql`
    SELECT * FROM users WHERE email=${email} LIMIT 1;
    `);
    // db.end();
    return rows[0];
  },

  async findById(id) {
    const { rows } = await db.query(sql`
    SELECT * FROM users WHERE id=${id} LIMIT 1;
    `);
    // db.end();
    return rows[0];
  },

  async findAll() {
    const { rows } = await db.query(sql`
    SELECT * FROM users;
    `);
    // db.end();
    return rows;
  },
  async addShift(userId, shiftTime, description, providerId) {
    try {
      const { rows } = await db.query(sql`
      INSERT INTO shifts (id, user_id, shift_time, description, provider_id)
        VALUES (${uuidv4()}, ${userId}, ${shiftTime}, ${description}, ${providerId})
        RETURNING id, shift_time, description, provider_id;
      `);
      // db.end();

      const [shift] = rows;
      return shift;
    } catch (error) {
      throw error;
    }
  },

  async createProvider(name, description, provider_image) {
    const { rows } = await db.query(sql`
    INSERT INTO provider (id, name, description, provider_image)
      VALUES (${uuidv4()}, ${name}, ${description}, ${provider_image})
      RETURNING id, name, description, provider_image;
    `);
    // db.end();
    const [provider] = rows;
    return provider;
  },

  async getProviders() {
    const { rows } = await db.query(sql`
    SELECT id, name, description, provider_image FROM provider;
    `);
    // db.end();
    return rows;
  },

  async deleteProvider(id) {
    const { rows } = await db.query(sql`
    DELETE FROM provider WHERE id=${id} RETURNING id, name, description, provider_image;
    `);
    // db.end();
    const [provider] = rows;
    return provider;
  },

  async getShifts(userId) {
    const { rows } = await db.query(sql`
    SELECT id, shift_time, description FROM shifts WHERE user_id=${userId};
    `);
    // db.end();
    return rows;
  },
  async getAllShifts() {
    const { rows } = await db.query(sql`
    SELECT id, shift_time, description FROM shifts;
    `);
    // db.end();
    return rows;
  },

  async getMyShifts(userId) {
    const { rows } = await db.query(sql`
    SELECT id, shift_time, description FROM shifts WHERE user_id=${userId};
    `);
    // db.end();
    return rows;
  },

  async deleteShift(id) {
    const { rows } = await db.query(sql`
    DELETE FROM shifts WHERE id=${id} RETURNING id, shift_time, description;
    `);
    // db.end();
    const [shift] = rows;
    return shift;
  },
};
