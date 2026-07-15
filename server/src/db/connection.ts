import mysql from 'mysql2/promise';
import { Pool as PgPool } from 'pg';

export type DatabaseType = 'mysql' | 'postgres';

const dbUrl = process.env.DATABASE_URL || '';
export const dbType: DatabaseType = (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) ? 'postgres' : 'mysql';

let mysqlPool: mysql.Pool | null = null;
let postgresPool: PgPool | null = null;

if (dbType === 'postgres') {
  console.log('Database Mode: PostgreSQL (Neon Serverless Mode Detected)');
  postgresPool = new PgPool({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
  });

  postgresPool.connect()
    .then(client => {
      console.log('Successfully connected to the PostgreSQL database.');
      client.release();
    })
    .catch(error => {
      console.error('CRITICAL ERROR: Unable to connect to the PostgreSQL database.');
      console.error('Details:', error.message);
    });
} else {
  console.log('Database Mode: MySQL Mode Detected');
  mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'leadsarv_db',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000
  });

  mysqlPool.getConnection()
    .then(connection => {
      console.log('Successfully connected to the MySQL database.');
      connection.release();
    })
    .catch(error => {
      console.error('CRITICAL ERROR: Unable to connect to the MySQL database.');
      console.error('Details:', error.message);
    });
}

// Unified query helper
export async function query(sql: string, params: any[] = []): Promise<any> {
  if (dbType === 'postgres' && postgresPool) {
    // Convert MySQL style placeholders (?) to PostgreSQL styled ($1, $2)
    let pgSql = sql;
    let paramCounter = 1;
    while (pgSql.includes('?')) {
      pgSql = pgSql.replace('?', `$${paramCounter++}`);
    }
    const res = await postgresPool.query(pgSql, params);
    return res.rows;
  } else if (mysqlPool) {
    const [rows] = await mysqlPool.query(sql, params);
    return rows;
  }
  throw new Error('No database pool initialized');
}

export { mysqlPool, postgresPool };
export default mysqlPool; // Maintain backward compatibility if needed
