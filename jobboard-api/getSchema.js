const mysql = require('mysql2/promise')

const sourceDB = {
  host: 'yamanote.proxy.rlwy.net',
  port: 57781,
  user: 'root',
  password: 'JfHlVhpFUpjhmjohHRiplejpwMnrXXdI',
  database: 'railway',
}

const tables = ['companies', 'users', 'jobs', 'applications']

async function getSchema() {
  const source = await mysql.createConnection(sourceDB)

  for (const table of tables) {
    const [rows] = await source.query(`SHOW CREATE TABLE ${table}`)
    console.log(`\n--- ${table} ---`)
    console.log(rows[0]['Create Table'])
  }

  await source.end()
}

getSchema()