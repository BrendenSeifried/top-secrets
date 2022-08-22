const pool = require('../utils/pool');

class Redact {
  id;
  title;
  description;
  created_at;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.description = row.description;
    this.created_at = row.created_at;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM secret_data');
    return rows.map((item) => new Redact(item));
  }

  static async create({ title, description }) {
    const { rows } = await pool.query(
      `INSERT INTO secret_data (title, description) VALUES ($1, $2) RETURNING *`,
      [title, description]
    );
    return new Redact(rows[0]);
  }
}

module.exports = Redact;
