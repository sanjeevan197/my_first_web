const db = require('./db');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    const [rows] = await db.execute('SELECT 1 as test');
    console.log('✅ Database connection successful');
    
    // Check if database exists
    const [databases] = await db.execute('SHOW DATABASES LIKE "nadi_pariksha"');
    if (databases.length === 0) {
      console.log('❌ Database "nadi_pariksha" not found');
      console.log('Please create the database first:');
      console.log('CREATE DATABASE nadi_pariksha;');
      return;
    }
    console.log('✅ Database "nadi_pariksha" exists');
    
    // Check tables
    const [tables] = await db.execute('SHOW TABLES');
    console.log('📋 Available tables:', tables.map(t => Object.values(t)[0]));
    
    if (tables.length === 0) {
      console.log('❌ No tables found. Please run the table creation queries.');
      return;
    }
    
    // Test insert
    const testUser = {
      id: 'test_user_' + Date.now(),
      email: 'test@example.com',
      display_name: 'Test User'
    };
    
    await db.execute(
      'INSERT INTO users (id, email, display_name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE display_name = VALUES(display_name)',
      [testUser.id, testUser.email, testUser.display_name]
    );
    
    console.log('✅ Test user inserted successfully');
    
    // Verify insert
    const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [testUser.id]);
    console.log('✅ Test user retrieved:', users[0]);
    
    // Clean up
    await db.execute('DELETE FROM users WHERE id = ?', [testUser.id]);
    console.log('✅ Test user cleaned up');
    
    console.log('🎉 Database is working correctly!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your .env file credentials');
    console.log('3. Create the database: CREATE DATABASE nadi_pariksha;');
    console.log('4. Run the table creation queries');
  } finally {
    process.exit();
  }
}

testConnection();