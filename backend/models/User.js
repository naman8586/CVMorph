const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, name }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email.toLowerCase(), hashedPassword, name]
    );
    
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;