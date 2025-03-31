import dbClient from "./index.js";

export const registerUser = async (name, email, password) => {
  try {
    const result = await dbClient.query(
      `INSERT INTO users (name, email, password, role_id) 
           VALUES ($1, $2,$3, (SELECT role_id FROM roles WHERE role_name = 'user')) 
           RETURNING *`,
      [name, email, password]
    );
    return await result.rows[0];
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
};

export const verifyUser = async (email, password) => {
  try {
    const result = await dbClient.query(
      `SELECT * FROM users WHERE email = $1 AND password = $2`,
      [email, password]
    );
    return await result.rows[0];
  } catch (error) {
    console.error("Error logging in user:", error);
    return null;
  }
};
export const getUserRole = async (userId) => {
  try {
    const result = await dbClient.query(
      `SELECT roles.role_name 
       FROM users
       JOIN roles ON users.role_id = roles.role_id
       WHERE users.user_id = $1;`,
      [userId]
    );

    return result.rows.length ? result.rows[0].role_name : null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};
