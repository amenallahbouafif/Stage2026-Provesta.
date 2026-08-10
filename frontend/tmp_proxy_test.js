import fetch from 'node-fetch';

async function test() {
  const url = 'http://127.0.0.1:5173/api/login';
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@provesta.com', password: 'password' }),
    redirect: 'manual',
  });
  console.log('status', resp.status);
  console.log('headers', Object.fromEntries(resp.headers.entries()));
  const text = await resp.text();
  console.log('body', text.slice(0, 200));
}

test().catch(err => { console.error(err); process.exit(1); });