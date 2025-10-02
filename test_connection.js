// Simple test script to check if backend is working
const fetch = require('node-fetch');

async function testBackend() {
  try {
    console.log('🔍 Testing backend connection...');
    
    // Test basic connection
    const response = await fetch('http://localhost:5001/api/test');
    const data = await response.json();
    
    console.log('✅ Backend is running!');
    console.log('📊 Response:', data);
    
    // Test registration endpoint
    console.log('\n🔍 Testing registration endpoint...');
    const testUser = {
      username: 'testuser123',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const regResponse = await fetch('http://localhost:5001/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    if (regResponse.ok) {
      console.log('✅ Registration endpoint is working!');
    } else {
      const error = await regResponse.text();
      console.log('⚠️ Registration response:', regResponse.status, error);
    }
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure backend server is running: cd backend && npm start');
    console.log('2. Check if port 5001 is available');
    console.log('3. Verify MongoDB is running');
  }
}

testBackend();
