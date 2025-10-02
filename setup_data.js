// Simple script to setup sample data for the course recommendation website
const http = require('http');

async function setupData() {
  try {
    console.log('🚀 Setting up sample data for course recommendation website...');
    
    // Add sample courses
    console.log('📚 Adding sample courses...');
    
    const postData = JSON.stringify({});
    
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/add-sample-data',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(data);
          console.log('✅ Sample courses added:', result.message);
        } else {
          console.log('⚠️ Sample data response:', res.statusCode, data);
        }
        
        console.log('\n🎯 Setup complete! You can now:');
        console.log('1. Register a new account');
        console.log('2. Set your interests in your profile');
        console.log('3. Browse courses and enroll');
        console.log('4. Check recommendations based on your interests');
      });
    });

    req.on('error', (error) => {
      console.error('❌ Setup failed:', error.message);
      console.log('\n🔧 Make sure:');
      console.log('1. Backend server is running (npm start in backend folder)');
      console.log('2. MongoDB is connected (or ignore MongoDB warnings)');
    });

    req.write(postData);
    req.end();
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupData();
