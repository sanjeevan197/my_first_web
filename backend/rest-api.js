const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234!@#$QWERqwer',
  database: 'nadi_pariksha',
  port: 3306
};

// Initialize database
async function initDB() {
  try {
    const setupConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234!@#$QWERqwer',
      port: 3306
    });
    
    await setupConnection.query('CREATE DATABASE IF NOT EXISTS nadi_pariksha');
    await setupConnection.end();
    
    const connection = await mysql.createConnection(dbConfig);
    
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
    
    console.log('✅ Database initialized');
    await connection.end();
  } catch (error) {
    console.error('❌ Database error:', error);
  }
}

// RESTful API Routes

// GET /api/users - Get all users
app.get('/api/users', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.query('SELECT * FROM users ORDER BY created_at DESC');
    await connection.end();
    
    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// GET /api/users/:id - Get single user
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    await connection.end();
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// POST /api/users - Create new user
app.post('/api/users', async (req, res) => {
  try {
    const { id, email, display_name, phone, age, address } = req.body;
    
    if (!id || !email) {
      return res.status(400).json({
        success: false,
        error: 'ID and email are required'
      });
    }
    
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.query(
      'INSERT INTO users (id, email, display_name, phone, age, address) VALUES (?, ?, ?, ?, ?, ?)',
      [id, email, display_name || null, phone || null, age || null, address || null]
    );
    
    const [newUser] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    await connection.end();
    
    res.status(201).json({
      success: true,
      data: newUser[0],
      message: 'User created successfully'
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({
        success: false,
        error: 'User already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to create user'
      });
    }
  }
});

// PUT /api/users/:id - Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { display_name, phone, age, address } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.query(
      'UPDATE users SET display_name = ?, phone = ?, age = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [display_name || null, phone || null, age || null, address || null, id]
    );
    
    if (result.affectedRows === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const [updatedUser] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    await connection.end();
    
    res.status(200).json({
      success: true,
      data: updatedUser[0],
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// DELETE /api/users/:id - Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.query('DELETE FROM users WHERE id = ?', [id]);
    await connection.end();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

// PATCH /api/users/:id - Partial update
app.patch('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }
    
    const connection = await mysql.createConnection(dbConfig);
    
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    
    const [result] = await connection.query(
      `UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );
    
    if (result.affectedRows === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const [updatedUser] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    await connection.end();
    
    res.status(200).json({
      success: true,
      data: updatedUser[0],
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('SELECT 1');
    await connection.end();
    
    res.status(200).json({
      success: true,
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
initDB().then(() => {
  app.listen(3001, () => {
    console.log('🚀 RESTful API Server running on http://localhost:3001');
    console.log('📋 Available endpoints:');
    console.log('  GET    /api/users     - Get all users');
    console.log('  GET    /api/users/:id - Get single user');
    console.log('  POST   /api/users     - Create user');
    console.log('  PUT    /api/users/:id - Update user');
    console.log('  PATCH  /api/users/:id - Partial update');
    console.log('  DELETE /api/users/:id - Delete user');
    console.log('  GET    /api/health    - Health check');
  });
});