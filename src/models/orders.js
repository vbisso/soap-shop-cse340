import dbClient from "./index.js";

export const createOrder = async (order, user_id, total_price) => {
  try {
    const orderResult = await dbClient.query(
      "INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *",
      [user_id, total_price]
    );

    const order_id = orderResult.rows[0].order_id;

    //Insert items into order_items
    const orderItemsQueries = order.map(async (item) => {
      try {
        return await dbClient.query(
          "INSERT INTO order_items (order_id, soap_id, quantity, price) VALUES ($1, $2, $3, $4)",
          [order_id, item.soap_id, item.quantity || 1, item.soap_price]
        );
      } catch (error) {
        console.error(
          `Error inserting order item (soap_id: ${item.soap_id}):`,
          error
        );
        return null;
      }
    });

    // Wait for all the order item inserts to complete
    await Promise.all(orderItemsQueries);

    return order_id; // Return the order ID if successful
  } catch (error) {
    console.error("Error creating order:", error);
    return null; // Return null if an error occurs
  }
};

export const getOrders = async (user_id) => {
  try {
    const result = await dbClient.query(
      "SELECT * FROM orders WHERE user_id = $1",
      [user_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const getOrderItems = async (order_id) => {
  try {
    const result = await dbClient.query(
      `
      SELECT oi.*, s.soap_name, s.soap_description, s.soap_price, s.image_path, s.category_id
      FROM order_items oi
      JOIN soaps s ON oi.soap_id = s.soap_id
      WHERE oi.order_id = $1
      `,
      [order_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching order items:", error);
    return [];
  }
};
export const getOrderStats = async (query) => {
  try {
    let sqlQuery;

    if (query === "all") {
      sqlQuery = "SELECT COUNT(*) AS total_orders FROM orders";
    }
    //  else if (query === "completed") {
    //   sqlQuery = "SELECT COUNT(*) AS total_orders FROM orders WHERE status = 'completed'";
    // } else if (query === "cancelled") {
    //   sqlQuery = "SELECT COUNT(*) AS total_orders FROM orders WHERE status = 'cancelled'";
    // }
    else if (query === "revenue") {
      sqlQuery = "SELECT SUM(total_price) AS total_orders FROM orders";
    }

    const result = await dbClient.query(sqlQuery);
    //console.log(result.rows[0]);
    return result.rows[0].total_orders;
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return 0;
  }
};
