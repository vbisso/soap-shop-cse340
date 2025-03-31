import dbClient from "./index.js"; // Imports the database connection

export const getSoapById = async (soap_id) => {
  try {
    const result = await dbClient.query(
      `SELECT soaps.*, category.category_name 
      FROM soaps 
      JOIN category ON soaps.category_id = category.category_id 
      WHERE soaps.soap_id = $1;`,
      [soap_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching soaps:", error);
    return [];
  }
};
export const getSoaps = async () => {
  try {
    const result = await dbClient.query(
      "SELECT * FROM soaps JOIN category ON soaps.category_id = category.category_id;"
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching soaps:", error);
    return []; // Return empty array to prevent crashes
  }
};

export const addSoap = async (soap, image_path) => {
  try {
    const result = await dbClient.query(
      "INSERT INTO soaps (soap_name, soap_description, soap_price, image_path, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        soap.soap_name,
        soap.soap_description,
        soap.soap_price,
        image_path,
        soap.category_id,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding soap:", error);
    return null;
  }
};
export const updateSoap = async (soap_id, soap) => {
  try {
    const result = await dbClient.query(
      "UPDATE soaps SET soap_name = $1, soap_description = $2, soap_price = $3, image_path = $4, category_id = $5 WHERE soap_id = $6 RETURNING *",
      [
        soap.soap_name,
        soap.soap_description,
        soap.soap_price,
        soap.image_path,
        soap.category_id,
        soap_id,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating soap:", error);
    return null;
  }
};
export const deleteSoap = async (soap_id) => {
  try {
    const result = await dbClient.query(
      "DELETE FROM soaps WHERE soap_id = $1 RETURNING *",
      [soap_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting soap:", error);
    return null;
  }
};
