/**
 * Test query API endpoint
 */

require('dotenv').config();
const http = require('http');

async function testQuery() {
  try {
    console.log('Testing query API...\n');

    const data = JSON.stringify({
      query: 'What is the salary?'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/query',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', body);
        
        if (res.statusCode === 200) {
          const response = JSON.parse(body);
          console.log('\nSuccess!');
          console.log('Answer:', response.answer);
          console.log('Confidence:', response.confidence);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Error:', error.message);
    });

    req.write(data);
    req.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testQuery();
