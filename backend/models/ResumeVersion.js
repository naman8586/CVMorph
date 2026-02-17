const db = require('../config/db');

class ResumeVersion {
  static async create(data) {
    const { resume_base_id, user_id, role, job_description, adapted_content } = data;
    
    const result = await db.query(
      `INSERT INTO resume_versions (resume_base_id, user_id, role, job_description, adapted_content)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [resume_base_id, user_id, role, job_description, JSON.stringify(adapted_content)]
    );
    
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await db.query(
      `SELECT rv.*, rb.personal_info 
       FROM resume_versions rv
       LEFT JOIN resume_base rb ON rv.resume_base_id = rb.id
       WHERE rv.user_id = $1
       ORDER BY rv.created_at DESC`,
      [userId]
    );
    
    return result.rows;
  }

  static async findById(id, userId) {
    const result = await db.query(
      `SELECT rv.*, rb.personal_info 
       FROM resume_versions rv
       LEFT JOIN resume_base rb ON rv.resume_base_id = rb.id
       WHERE rv.id = $1 AND rv.user_id = $2`,
      [id, userId]
    );
    
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await db.query(
      'DELETE FROM resume_versions WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    
    return result.rows[0];
  }

  static async countByUserId(userId) {
    const result = await db.query(
      'SELECT COUNT(*) as count FROM resume_versions WHERE user_id = $1',
      [userId]
    );
    
    return parseInt(result.rows[0].count);
  }
}

module.exports = ResumeVersion;