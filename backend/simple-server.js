const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Direct MySQL connection
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234!@#$QWERqwer',
  database: 'nadi_pariksha',
  port: 3306
};

// Test database connection
async function testDB() {
  try {
    // First connect without database to create it
    const setupConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234!@#$QWERqwer',
      port: 3306
    });
    
    await setupConnection.query('CREATE DATABASE IF NOT EXISTS nadi_pariksha');
    await setupConnection.end();
    
    // Now connect to the database
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ MySQL Connected to nadi_pariksha');
    
    // Create users table with profile fields
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        display_name VARCHAR(255),
        phone VARCHAR(20),
        age INT,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Tables ready');
    await connection.end();
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

// Save user endpoint
app.post('/api/users', async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;
    console.log('📝 Saving user:', { uid, email, displayName });
    
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.query(
      'INSERT INTO users (id, email, display_name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE display_name = VALUES(display_name)',
      [uid, email, displayName || '']
    );
    
    console.log('✅ User saved to database');
    await connection.end();
    
    res.json({ success: true, message: 'User saved' });
  } catch (error) {
    console.error('❌ Save error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all users
app.get('/api/users/all', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.query('SELECT * FROM users ORDER BY created_at DESC');
    await connection.end();
    
    console.log(`📋 Retrieved ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('❌ Get users error:', error.message);
    res.json([]);
  }
});

// Get user profile
app.get('/api/users/:uid/profile', async (req, res) => {
  try {
    const { uid } = req.params;
    
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.query('SELECT * FROM users WHERE id = ?', [uid]);
    await connection.end();
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('✅ Profile retrieved for user:', uid);
    res.json({ success: true, profile: users[0] });
  } catch (error) {
    console.error('❌ Error getting profile:', error.message);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
app.put('/api/users/:uid/profile', async (req, res) => {
  try {
    const { uid } = req.params;
    const { displayName, phone, age, address } = req.body;
    
    // Validation
    if (!uid) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!displayName || displayName.trim().length === 0) {
      return res.status(400).json({ error: 'Display name is required' });
    }
    
    if (phone && phone.length > 20) {
      return res.status(400).json({ error: 'Phone number too long' });
    }
    
    if (age && (age < 1 || age > 120)) {
      return res.status(400).json({ error: 'Age must be between 1 and 120' });
    }
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Check if user exists
    const [existingUsers] = await connection.query('SELECT id FROM users WHERE id = ?', [uid]);
    
    if (existingUsers.length === 0) {
      await connection.end();
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user
    const [result] = await connection.query(
      'UPDATE users SET display_name = ?, phone = ?, age = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [displayName.trim(), phone || null, age || null, address || null, uid]
    );
    
    await connection.end();
    
    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'No changes were made to the profile' });
    }
    
    console.log('✅ Profile updated for user:', uid);
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: { displayName, phone, age, address }
    });
    
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Database connection failed' });
    }
    
    res.status(500).json({ 
      error: 'Failed to update profile', 
      details: error.message 
    });
  }
});

// Delete user profile
app.delete('/api/users/:uid/profile', async (req, res) => {
  try {
    const { uid } = req.params;
    
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query('DELETE FROM users WHERE id = ?', [uid]);
    await connection.end();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('✅ Profile deleted for user:', uid);
    res.json({ success: true, message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting profile:', error.message);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

// Start server
app.listen(3001, async () => {
  console.log('🚀 Server running on http://localhost:3001');
  await testDB();
});