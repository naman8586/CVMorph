const db = require('../config/db');

class ResumeBase {
  static async create(userId, data) {
    const { personal_info, education, experience, projects, skills } = data;
    
    const result = await db.query(
      `INSERT INTO resume_base (user_id, personal_info, education, experience, projects, skills)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userId,
        JSON.stringify(personal_info || {}),
        JSON.stringify(education || []),
        JSON.stringify(experience || []),
        JSON.stringify(projects || []),
        JSON.stringify(skills || {})
      ]
    );
    
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await db.query(
      'SELECT * FROM resume_base WHERE user_id = $1',
      [userId]
    );
    
    return result.rows[0];
  }

  static async update(id, userId, data) {
    const { personal_info, education, experience, projects, skills } = data;
    
    const result = await db.query(
      `UPDATE resume_base 
       SET personal_info = $1, education = $2, experience = $3, 
           projects = $4, skills = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [
        JSON.stringify(personal_info),
        JSON.stringify(education),
        JSON.stringify(experience),
        JSON.stringify(projects),
        JSON.stringify(skills),
        id,
        userId
      ]
    );
    
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM resume_base WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }
}

module.exports = ResumeBase;