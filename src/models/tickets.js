import dbClient from "./index.js";

export const submitTicket = async (user_id, order_id, subject, message) => {
  try {
    const result = await dbClient.query(
      "INSERT INTO tickets (status_id, user_id, order_id, subject, message) VALUES (1, $1, $2, $3, $4) RETURNING *",
      [user_id, order_id, subject, message]
    );
    return await result.rows[0];
  } catch (error) {
    console.error("Error submitting ticket:", error);
    return null;
  }
};

export const updateTicketStatus = async (ticket_id, status_id) => {
  try {
    const result = await dbClient.query(
      "UPDATE tickets SET status_id = $1 WHERE ticket_id = $2 RETURNING *",
      [status_id, ticket_id]
    );
    return await result.rows[0];
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return null;
  }
};

export const getTickets = async (user_id) => {
  try {
    const result = await dbClient.query(
      `
      SELECT t.ticket_id, u.name, t.subject, t.message, t.created_at, ts.status, t.created_at
      FROM tickets t

      LEFT JOIN ticket_status ts ON t.status_id = ts.status_id
	    LEFT JOIN users u ON t.user_id = u.user_id

      WHERE t.user_id = $1
      ORDER BY t.created_at DESC

      `,
      [user_id]
    );

    return result.rows;
  } catch (error) {
    console.error("Error fetching tickets and replies:", error);
    return [];
  }
};

export const getAllTickets = async () => {
  try {
    const result = await dbClient.query(
      "SELECT * FROM tickets JOIN users ON tickets.user_id = users.user_id JOIN ticket_status ON tickets.status_id = ticket_status.status_id"
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};
export const getTicketsStats = async (query) => {
  try {
    let sqlQuery;

    if (query === "all") {
      sqlQuery = "SELECT COUNT(*) AS count FROM tickets";
    } else if (query === "open") {
      sqlQuery = "SELECT COUNT(*) AS count FROM tickets WHERE status_id = '1'";
    } else if (query === "closed") {
      sqlQuery = "SELECT COUNT(*) AS count FROM tickets WHERE status_id = '2'";
    }

    const result = await dbClient.query(sqlQuery);
    //console.log(result.rows[0]);
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};
