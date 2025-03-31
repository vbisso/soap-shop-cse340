import pg from "pg";
import fs from "fs";

const { Pool } = pg;

/**
 * Instead of connecting to your pool with all the individual settings you can
 * simplify the connection by using a connection string. Add this string to your
 * .env file and us it here;we called ours `DB_URL`:
 *
 * postgresql://username:password@host:port/database
 *
 * You will need to replace the following values with your own:
 * - username
 * - password
 * - host
 * - port
 * - database
 */
const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: false,
});

let dbClient;

if (process.env.NODE_ENV.toLowerCase().includes("dev")) {
  /**
   * Instead of giving the user the original pool object, we can create a
   * wrapper that allows us to control what actions the user can take on the
   * pool. In this case, we only want the user to be able to query the pool
   * and we want to automatically log all queries that are executed.
   */
  dbClient = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        //console.log("Queries executed:" + { text });
        return res;
      } catch (error) {
        //console.error("Error in query:", { text });
        throw error;
      }
    },
  };
} else {
  // We are in production, so we can just export the pool object directly.
  dbClient = pool;
}

// Setup function
export const setupDatabase = async () => {
  console.log("Setting up database...");
  try {
    // Read the schema file
    const sql = fs.readFileSync("./src/database/schema.sql", "utf-8");

    // Split the SQL statements by `;` and execute them separately
    const statements = sql.split(";\n");

    for (const statement of statements) {
      if (statement.trim()) {
        await dbClient.query(statement);
      }
    }

    console.log("Database setup complete!");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
};
// Test function that can be used to test the database
// export const testDatabase = async () => {
//   try {
//     const res = await dbClient.query(`
//             SELECT table_name
//             FROM information_schema.tables
//             WHERE table_schema = 'public'
//         `);
//     if (res.rows.length === 0) {
//       console.log("No tables found in the database.");
//     } else {
//       console.log(
//         "Tables in the database:",
//         res.rows.map((row) => row.table_name)
//       );
//     }
//   } catch (error) {
//     console.error("Error fetching tables:", error);
//   }
// };

export default dbClient;
