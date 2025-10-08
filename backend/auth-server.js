const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const { verifyFirebaseToken } = require('./firebase-admin');

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
    
    // Enhanced users table with Firebase sync
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        firebase_uid VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        display_name VARCHAR(255),
        phone VARCHAR(20),
        age INT,
        address TEXT,
        email_verified BOOLEAN DEFAULT FALSE,
        provider VARCHAR(50) DEFAULT 'email',
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        firebase_synced BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_firebase_uid (firebase_uid),
        INDEX idx_email (email)
      )
    `);
    
    console.log('✅ Database initialized with Firebase sync');
    await connection.end();
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// Middleware to verify Firebase token and sync user
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }
    
    // Verify Firebase token
    const firebaseUser = await verifyFirebaseToken(token);
    
    // Sync with local database
    const connection = await mysql.createConnection(dbConfig);
    
    // Check if user exists in local DB
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE firebase_uid = ?',
      [firebaseUser.uid]
    );
    
    let localUser;
    
    if (existingUsers.length === 0) {
      // Create new user in local DB
      await connection.query(`
        INSERT INTO users (
          id, firebase_uid, email, display_name, 
          email_verified, provider, last_login, firebase_synced
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), TRUE)
      `, [
        firebaseUser.uid,
        firebaseUser.uid,
        firebaseUser.email,
        firebaseUser.name || '',
        firebaseUser.email_verified || false,
        'firebase'
      ]);
      
      console.log('🆕 New user synced from Firebase:', firebaseUser.email);
      
      // Get the created user
      const [newUsers] = await connection.query(
        'SELECT * FROM users WHERE firebase_uid = ?',
        [firebaseUser.uid]
      );
      localUser = newUsers[0];
    } else {
      // Update existing user
      localUser = existingUsers[0];
      
      await connection.query(`
        UPDATE users SET 
          email = ?, display_name = ?, email_verified = ?, 
          last_login = NOW(), firebase_synced = TRUE
        WHERE firebase_uid = ?
      `, [
        firebaseUser.email,
        firebaseUser.name || localUser.display_name,
        firebaseUser.email_verified,
        firebaseUser.uid
      ]);
      
      console.log('🔄 User synced with Firebase:', firebaseUser.email);
    }
    
    await connection.end();
    
    // Add user info to request
    req.user = {
      ...firebaseUser,
      localData: localUser
    };
    
    next();
  } catch (error) {
    console.error('❌ Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed', details: error.message });
  }
};

// Sync user endpoint (called after Firebase auth)
app.post('/api/auth/sync', async (req, res) => {
  try {
    const { uid, email, displayName, emailVerified, provider } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Upsert user data
    await connection.query(`
      INSERT INTO users (
        id, firebase_uid, email, display_name, 
        email_verified, provider, last_login, firebase_synced
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), TRUE)
      ON DUPLICATE KEY UPDATE
        email = VALUES(email),
        display_name = VALUES(display_name),
        email_verified = VALUES(email_verified),
        provider = VALUES(provider),
        last_login = NOW(),
        firebase_synced = TRUE
    `, [uid, uid, email, displayName || '', emailVerified || false, provider || 'firebase']);
    
    // Get synced user data
    const [users] = await connection.query(
      'SELECT * FROM users WHERE firebase_uid = ?',
      [uid]
    );
    
    await connection.end();
    
    console.log('✅ User synced successfully:', email);
    res.json({ 
      success: true, 
      message: 'User synced with local database',
      user: users[0]
    });
    
  } catch (error) {
    console.error('❌ Sync error:', error);
    res.status(500).json({ error: 'Failed to sync user', details: error.message });
  }
});

// Get user profile (with authentication)
app.get('/api/users/:uid/profile', authenticateUser, async (req, res) => {
  try {
    const { uid } = req.params;
    
    // Ensure user can only access their own profile
    if (req.user.uid !== uid) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.query(
      'SELECT * FROM users WHERE firebase_uid = ?',
      [uid]
    );
    await connection.end();
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, profile: users[0] });
  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile (with authentication)
app.put('/api/users/:uid/profile', authenticateUser, async (req, res) => {
  try {
    const { uid } = req.params;
    const { displayName, phone, age, address } = req.body;
    
    // Ensure user can only update their own profile
    if (req.user.uid !== uid) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Validation
    if (!displayName?.trim()) {
      return res.status(400).json({ error: 'Display name is required' });
    }
    
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.query(`
      UPDATE users SET 
        display_name = ?, phone = ?, age = ?, address = ?, 
        updated_at = CURRENT_TIMESTAMP, firebase_synced = TRUE
      WHERE firebase_uid = ?
    `, [displayName.trim(), phone || null, age || null, address || null, uid]);
    
    if (result.affectedRows === 0) {
      await connection.end();
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get updated user data
    const [users] = await connection.query(
      'SELECT * FROM users WHERE firebase_uid = ?',
      [uid]
    );
    
    await connection.end();
    
    console.log('✅ Profile updated for user:', uid);
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: users[0]
    });
    
  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get all users (admin only)
app.get('/api/users/all', authenticateUser, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.query(`
      SELECT 
        id, firebase_uid, email, display_name, phone, age, 
        email_verified, provider, last_login, firebase_synced,
        created_at, updated_at
      FROM users 
      ORDER BY last_login DESC
    `);
    await connection.end();
    
    console.log(`📋 Retrieved ${users.length} synced users`);
    res.json(users);
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('SELECT 1');
    await connection.end();
    
    res.json({ 
      status: 'healthy',
      database: 'connected',
      firebase: 'configured',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy',
      error: error.message 
    });
  }
});

// Initialize and start server
initDB().then(() => {
  app.listen(3001, () => {
    console.log('🚀 Perfect Authentication Server running on http://localhost:3001');
    console.log('🔐 Firebase + MySQL sync enabled');
    console.log('✅ Ready for secure authentication');
  });
});