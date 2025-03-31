import dbClient from "./index.js";

export const submitMessage = async (name, email, message) => {
  try {
    const result = await dbClient.query(
      `INSERT INTO messages (name, email, message,status_id) 
                     VALUES ($1, $2, $3,(SELECT status_id FROM messages_status WHERE status = 'unread')) 
                     RETURNING *`,
      [name, email, message]
    );
    return await result.rows[0];
  } catch (error) {
    console.error("Error submitting message:", error);
    return null;
  }
};

export const getMessages = async () => {
  try {
    const result = await dbClient.query(`
      SELECT m.*, ms.status 
      FROM messages m
      JOIN messages_status ms ON m.status_id = ms.status_id
      ORDER BY m.date DESC
    `);

    return result.rows;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export const getMessagesStats = async (query) => {
  try {
    let sqlQuery;

    if (query === "all") {
      sqlQuery = "SELECT COUNT(*) AS count FROM messages";
    } else if (query === "unread") {
      sqlQuery = `SELECT COUNT(*) AS count FROM messages 
                  WHERE status_id = (SELECT status_id FROM messages_status WHERE status = 'unread')`;
    } else if (query === "completed") {
      sqlQuery = `SELECT COUNT(*) AS count FROM messages 
                  WHERE status_id = (SELECT status_id FROM messages_status WHERE status = 'completed')`;
    }

    const result = await dbClient.query(sqlQuery);
    //console.log(result.rows[0]);
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};
export const updateMessageStatus = async (message_id, new_status) => {
  try {
    const statusResult = await dbClient.query(
      "SELECT status_id FROM messages_status WHERE status = $1",
      [new_status]
    );

    if (statusResult.rows.length === 0) {
      throw new Error("Invalid status");
    }

    const status_id = statusResult.rows[0].status_id;

    await dbClient.query(
      "UPDATE messages SET status_id = $1 WHERE message_id = $2",
      [status_id, message_id]
    );

    return true;
  } catch (error) {
    console.error("Error updating message status:", error);
    return false;
  }
};

export const deleteMessage = async (message_id) => {
  try {
    await dbClient.query("DELETE FROM messages WHERE message_id = $1", [
      message_id,
    ]);
    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    return false;
  }
};
