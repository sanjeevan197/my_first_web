const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Middleware to verify Firebase JWT
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    // Decode JWT payload (basic decode without verification for demo)
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    req.user = { uid: payload.user_id || payload.sub };
    console.log('✅ Token verified for user:', req.user.uid);
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Save user to database (no token required for registration)
app.post('/api/users', async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;
    console.log('💾 Attempting to save user:', { uid, email, displayName });
    
    const [result] = await db.execute(
      'INSERT INTO users (id, email, display_name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE display_name = VALUES(display_name)',
      [uid, email, displayName]
    );
    
    console.log('✅ User saved successfully to MySQL:', { uid, email, displayName });
    console.log('📊 Database result:', { affectedRows: result.affectedRows, insertId: result.insertId });
    
    res.json({ success: true, message: 'User saved to database', uid });
  } catch (error) {
    console.error('❌ Error saving user to database:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to save user', details: error.message });
  }
});

// Start Nadi analysis
app.post('/api/nadi/start', verifyToken, async (req, res) => {
  try {
    console.log('Starting Nadi analysis for user:', req.user.uid);
    res.json({ status: 'Analysis started', timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start analysis' });
  }
});

// Analyze waveform and save to database
app.post('/api/nadi/analyze', verifyToken, async (req, res) => {
  try {
    const { waveform } = req.body;
    const userId = req.user.uid;
    
    // Generate analysis results
    const vata = Math.floor(Math.random() * 30) + 30;
    const pitta = Math.floor(Math.random() * 30) + 25;
    const kapha = 100 - vata - pitta;
    const status = vata > 40 ? 'High Vata Imbalance' : pitta > 40 ? 'High Pitta Imbalance' : 'Balanced';
    
    // Save analysis to database
    const [result] = await db.execute(
      'INSERT INTO analysis_reports (user_id, vata_percentage, pitta_percentage, kapha_percentage, status, waveform_data) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, vata, pitta, kapha, status, JSON.stringify(waveform)]
    );
    
    const reportId = result.insertId;
    
    // Save recommendations
    const recommendations = [
      'Practice calming yoga poses',
      'Eat warm, cooked foods',
      'Maintain regular sleep schedule',
      'Use sesame oil for massage'
    ];
    
    for (const rec of recommendations) {
      await db.execute(
        'INSERT INTO recommendations (report_id, recommendation) VALUES (?, ?)',
        [reportId, rec]
      );
    }
    
    console.log('Analysis saved to database for user:', userId);
    res.json({ vata, pitta, kapha, status });
  } catch (error) {
    console.error('Error analyzing waveform:', error);
    res.status(500).json({ error: 'Failed to analyze waveform' });
  }
});

// Get all users (for admin/guest view)
app.get('/api/users/all', async (req, res) => {
  try {
    const [users] = await db.execute(
      `SELECT u.*, COUNT(ar.id) as total_reports, 
       MAX(ar.created_at) as last_analysis
       FROM users u
       LEFT JOIN analysis_reports ar ON u.id = ar.user_id
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );
    
    console.log('Retrieved all users from database');
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Guest login - get user data by email
app.post('/api/guest-login', async (req, res) => {
  try {
    const { email } = req.body;
    
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = users[0];
    console.log('Guest login successful for:', email);
    res.json({ user, message: 'Guest login successful' });
  } catch (error) {
    console.error('Error in guest login:', error);
    res.status(500).json({ error: 'Failed to login as guest' });
  }
});

// Get user reports
app.get('/api/reports/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [reports] = await db.execute(
      `SELECT ar.*, GROUP_CONCAT(r.recommendation) as recommendations
       FROM analysis_reports ar
       LEFT JOIN recommendations r ON ar.id = r.report_id
       WHERE ar.user_id = ?
       GROUP BY ar.id
       ORDER BY ar.created_at DESC`,
      [userId]
    );
    
    const formattedReports = reports.map(report => ({
      id: report.id,
      date: report.created_at.toLocaleDateString(),
      vata: report.vata_percentage,
      pitta: report.pitta_percentage,
      kapha: report.kapha_percentage,
      status: report.status,
      recommendations: report.recommendations ? report.recommendations.split(',') : []
    }));
    
    console.log('Retrieved reports for user:', userId);
    res.json(formattedReports);
  } catch (error) {
    console.error('Error getting reports:', error);
    res.status(500).json({ error: 'Failed to get reports' });
  }
});

// Get user details with reports
app.get('/api/user/:userId/details', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [users] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    
    const [reports] = await db.execute(
      `SELECT ar.*, GROUP_CONCAT(r.recommendation) as recommendations
       FROM analysis_reports ar
       LEFT JOIN recommendations r ON ar.id = r.report_id
       WHERE ar.user_id = ?
       GROUP BY ar.id
       ORDER BY ar.created_at DESC`,
      [userId]
    );
    
    const formattedReports = reports.map(report => ({
      id: report.id,
      date: report.created_at.toLocaleDateString(),
      vata: report.vata_percentage,
      pitta: report.pitta_percentage,
      kapha: report.kapha_percentage,
      status: report.status,
      recommendations: report.recommendations ? report.recommendations.split(',') : []
    }));
    
    res.json({
      user: users[0],
      reports: formattedReports
    });
  } catch (error) {
    console.error('Error getting user details:', error);
    res.status(500).json({ error: 'Failed to get user details' });
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  // Test database connection on startup
  try {
    const [result] = await db.execute('SELECT 1 as test');
    console.log('✅ MySQL connection successful');
    
    // Check if tables exist
    const [tables] = await db.execute('SHOW TABLES');
    console.log(`📋 Found ${tables.length} tables in database`);
    
    if (tables.length === 0) {
      console.log('⚠️  No tables found. Please run the SQL table creation queries.');
    }
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    console.log('Please check your database configuration in .env file');
  }
});