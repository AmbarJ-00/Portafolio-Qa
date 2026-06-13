import mysql from 'mysql2/promise';

const host = '127.0.0.1';
const ports = [3306, 3307, 3308, 3309, 3310, 3311, 3312, 3313, 3314, 3315];
const credentials = [
  { user: 'root', password: '' },
  { user: 'root', password: 'root' },
  { user: 'root', password: 'password' },
  { user: 'root', password: 'admin' },
  { user: 'root', password: 'AdminQA#2026' }
];

async function test() {
  for (const port of ports) {
    for (const cred of credentials) {
      try {
        console.log(`Testing: host=${host}, port=${port}, user=${cred.user}, password=${cred.password}`);
        const conn = await mysql.createConnection({
          host,
          user: cred.user,
          password: cred.password,
          port,
          connectTimeout: 500
        });
        console.log(`\n🎉 SUCCESS: host=${host}, port=${port}, user=${cred.user}, password=${cred.password}\n`);
        await conn.end();
        return;
      } catch (err) {
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
          console.log(`\n🔑 FOUND ACTIVE MySQL PORT: host=${host}, port=${port} (Access Denied error: ${err.message})\n`);
          return;
        }
        console.log(`  Port ${port} failed: ${err.message} (code: ${err.code})`);
      }
    }
  }
}

test();
