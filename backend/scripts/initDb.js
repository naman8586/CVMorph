const { pool } = require('../config/db');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Initializing CVMorph database...\n');

    // Create Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Create ResumeBase table
    await client.query(`
      CREATE TABLE IF NOT EXISTS resume_base (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        personal_info JSONB NOT NULL DEFAULT '{}'::jsonb,
        education JSONB NOT NULL DEFAULT '[]'::jsonb,
        experience JSONB NOT NULL DEFAULT '[]'::jsonb,
        projects JSONB NOT NULL DEFAULT '[]'::jsonb,
        skills JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      );
    `);
    console.log('✅ ResumeBase table created');

    // Create ResumeVersions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS resume_versions (
        id SERIAL PRIMARY KEY,
        resume_base_id INTEGER NOT NULL REFERENCES resume_base(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(100) NOT NULL,
        job_description TEXT,
        adapted_content JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ ResumeVersions table created');

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_resume_base_user_id ON resume_base(user_id);
      CREATE INDEX IF NOT EXISTS idx_resume_versions_user_id ON resume_versions(user_id);
      CREATE INDEX IF NOT EXISTS idx_resume_versions_base_id ON resume_versions(resume_base_id);
      CREATE INDEX IF NOT EXISTS idx_resume_versions_role ON resume_versions(role);
    `);
    console.log('✅ Indexes created');

    console.log('\n🎉 Database initialized successfully!');
    console.log('📝 Tables created:');
    console.log('   - users');
    console.log('   - resume_base');
    console.log('   - resume_versions');
    console.log('\n👉 You can now start the server with: npm run dev\n');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Run initialization
createTables().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});