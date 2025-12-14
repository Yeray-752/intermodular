import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERL,
  port: process.env.DBport,
  password: process.env.DB_PASSWORDL,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
console.log(process.env.DB_PASSWORDL);

export default pool;
