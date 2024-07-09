import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


pool.connect((err) => {
if(err){
  console.error(err)
}
console.info("connected to database ")
})
pool.query(`CREATE TABLE IF NOT EXIST my_table (
  ingredient_id,
  ingredient_name,
  quantity,
  unit     
  )`);

pool.on("error", (error) => {
  console.log("error connecting to the database", error);
   process.exit(-1);
});
export default pool;
