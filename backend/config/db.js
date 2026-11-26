const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool without a database first, to ensure we can create the DB if it doesn't exist
const initPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDatabase() {
  try {
    const dbName = process.env.DB_NAME || 'klcap_db';
    
    // Create DB if not exists
    await initPool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' is ready.`);
    
    // Switch to the newly created DB
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: dbName,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create Tables
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createExperimentsTable = `
      CREATE TABLE IF NOT EXISTS experiments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        dataset_name VARCHAR(255) NOT NULL,
        num_rows INT,
        num_cols INT,
        missing_ratio FLOAT,
        class_imbalance FLOAT,
        target_type VARCHAR(50),
        recommended_pipeline VARCHAR(255),
        confidence FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;
    
    await pool.query(createUsersTable);
    await pool.query(createExperimentsTable);
    console.log("Tables initialized successfully.");
    
    return pool;
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    throw error;
  }
}

// We export a promise that resolves to the connected pool
module.exports = initializeDatabase();
