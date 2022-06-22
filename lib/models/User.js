const pool = require('../utils/pool');

module.exports = class User {
  id;
  first;
  last;
  email;
  #passwordHash;

  constructor(row) {
    this.id = row.id;
    this.first = row.first;
    this.last = row.last;
    this.email = row.email;
    this.#passwordHash = row.password_hash;
  }

  static async insert({ first, last, email, passwordHash }) {
    const { rows } = await pool.query(
      `INSERT INTO users (first, last, email, password_hash)
    VALUES ($1, $2, $3, $4) RETURNING *`,
      [first, last, email, passwordHash]
    );
    return new User(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM users');
    return rows.map((data) => new User(data));
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE email=$1`,

      [email]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
