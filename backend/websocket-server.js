const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234!@#$QWERqwer',
  database: 'nadi_pariksha',
  port: 3306
};

// Store connected users
const connectedUsers = new Map();

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('🔗 User connected:', socket.id);

  socket.on('user-login', (userData) => {
    connectedUsers.set(socket.id, userData);
    console.log('👤 User logged in:', userData.email);
    
    // Broadcast user count to all clients
    io.emit('user-count', connectedUsers.size);
  });

  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
    console.log('❌ User disconnected:', socket.id);
    io.emit('user-count', connectedUsers.size);
  });
});

// Real-time profile update
app.put('/api/users/:uid/profile', async (req, res) => {
  try {
    const { uid } = req.params;
    const { displayName, phone, age, address } = req.body;
    
    if (!displayName?.trim()) {
      return res.status(400).json({ error: 'Display name is required' });
    }
    
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.query(
      'UPDATE users SET display_name = ?, phone = ?, age = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [displayName.trim(), phone || null, age || null, address || null, uid]
    );
    
    if (result.affectedRows > 0) {
      // Get updated user data
      const [users] = await connection.query('SELECT * FROM users WHERE id = ?', [uid]);
      const updatedUser = users[0];
      
      // Broadcast real-time update to all connected clients
      io.emit('profile-updated', {
        uid,
        profile: updatedUser,
        timestamp: new Date().toISOString()
      });
      
      console.log('📡 Real-time profile update broadcasted for:', uid);
    }
    
    await connection.end();
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      realtime: true
    });
    
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Real-time user creation
app.post('/api/users', async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.query(
      'INSERT INTO users (id, email, display_name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE display_name = VALUES(display_name)',
      [uid, email, displayName || '']
    );
    
    // Get user data
    const [users] = await connection.query('SELECT * FROM users WHERE id = ?', [uid]);
    const newUser = users[0];
    
    // Broadcast new user to all clients
    io.emit('user-created', {
      user: newUser,
      timestamp: new Date().toISOString()
    });
    
    await connection.end();
    
    console.log('📡 New user broadcasted:', email);
    res.json({ success: true, message: 'User saved', realtime: true });
    
  } catch (error) {
    console.error('❌ User creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Real-time analysis update
app.post('/api/analysis/save', async (req, res) => {
  try {
    const { uid, vata, pitta, kapha, status } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Create analysis_reports table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS analysis_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        vata_percentage INT NOT NULL,
        pitta_percentage INT NOT NULL,
        kapha_percentage INT NOT NULL,
        status VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const [result] = await connection.query(
      'INSERT INTO analysis_reports (user_id, vata_percentage, pitta_percentage, kapha_percentage, status) VALUES (?, ?, ?, ?, ?)',
      [uid, vata, pitta, kapha, status]
    );
    
    const analysisData = {
      id: result.insertId,
      user_id: uid,
      vata_percentage: vata,
      pitta_percentage: pitta,
      kapha_percentage: kapha,
      status,
      created_at: new Date()
    };
    
    // Broadcast analysis update
    io.emit('analysis-completed', {
      analysis: analysisData,
      timestamp: new Date().toISOString()
    });
    
    await connection.end();
    
    console.log('📡 Analysis result broadcasted for:', uid);
    res.json({ success: true, analysis: analysisData, realtime: true });
    
  } catch (error) {
    console.error('❌ Analysis save error:', error);
    res.status(500).json({ error: 'Failed to save analysis' });
  }
});

// Get all users with real-time data
app.get('/api/users/all', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.query(`
      SELECT u.*, COUNT(ar.id) as total_reports, MAX(ar.created_at) as last_analysis
      FROM users u
      LEFT JOIN analysis_reports ar ON u.id = ar.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    await connection.end();
    
    res.json(users);
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.json([]);
  }
});

server.listen(3001, () => {
  console.log('🚀 Real-time server running on http://localhost:3001');
  console.log('📡 WebSocket server ready for real-time updates');
});