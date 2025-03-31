import dbClient from "./index.js";

export async function getAllUsers() {
  const result = await dbClient.query(
    "SELECT * FROM users JOIN roles ON users.role_id = roles.role_id"
  );
  return result.rows;
}

export async function updateUserRole(role_id, user_id) {
  const result = await dbClient.query(
    "UPDATE users SET role_id = $1 WHERE user_id = $2",
    [role_id, user_id]
  );
}
export async function deleteUser(user_id) {
  const result = await dbClient.query("DELETE FROM users WHERE user_id = $1", [
    user_id,
  ]);
}
