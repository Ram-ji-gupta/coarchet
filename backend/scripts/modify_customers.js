(async ()=>{
  try{
    const mysql = require('mysql2/promise');
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3311,
      user: 'woolcraft_user',
      password: 'woolcraft_password',
      database: 'woolcraft'
    });

    const [before] = await conn.query('SELECT * FROM customers ORDER BY id');
    console.log('BEFORE:', JSON.stringify(before, null, 2));

    const [updResult] = await conn.query(
      'UPDATE customers SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?',
      ['Updated Test4', '1112223333', 'updated@example.com', 'Updated Address', 3]
    );
    console.log('UPDATE RESULT:', updResult.affectedRows || updResult.affected_rows || updResult.changedRows || updResult);

    const [delResult] = await conn.query('DELETE FROM customers WHERE id = ?', [2]);
    console.log('DELETE RESULT:', delResult.affectedRows || delResult.affected_rows || delResult);

    const [after] = await conn.query('SELECT * FROM customers ORDER BY id');
    console.log('AFTER:', JSON.stringify(after, null, 2));

    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
