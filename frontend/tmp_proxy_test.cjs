const http = require('http');

const data = JSON.stringify({ email: 'admin@provesta.com', password: 'password' });

const options = {
  hostname: '127.0.0.1',
  port: 5173,
  path: '/api/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('body:', body);
  });
});

req.on('error', (err) => {
  console.error('error:', err);
});

req.write(data);
req.end();
