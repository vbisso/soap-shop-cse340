import dbClient from "./index.js"; // Imports the database connection

//Gets all categories
export const getCategories = async () => {
  try {
    const result = await dbClient.query("SELECT * FROM category;");
    return result.rows;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return []; // Return empty array to prevent crashes
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const query = `
    SELECT soaps.*, category.category_name 
    FROM soaps
    JOIN category ON soaps.category_id = category.category_id
    WHERE soaps.category_id = $1;
  `;

    const result = await dbClient.query(query, [categoryId]);

    return result.rows;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return []; // Return empty array to prevent crashes
  }
};
