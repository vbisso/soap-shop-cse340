import dbClient from "./index.js"; // Imports the database connection

export async function submitReview(soap_id, user_id, rating, review) {
  const result = await dbClient.query(
    "INSERT INTO reviews (soap_id, user_id, rating, review) VALUES ($1, $2, $3, $4) RETURNING *",
    [soap_id, user_id, rating, review]
  );
  return result.rows[0];
}
export async function getReviews(soap_id) {
  const result = await dbClient.query(
    "SELECT * FROM reviews WHERE soap_id = $1",
    [soap_id]
  );
  return result.rows;
}
export const getAverageRatingsBySoapId = async (soap_id) => {
  try {
    const result = await dbClient.query(
      "SELECT COALESCE(AVG(rating), 0) AS average_rating FROM reviews WHERE soap_id = $1",
      [soap_id]
    );
    return result.rows[0].average_rating;
  } catch (error) {
    console.error("Error fetching average rating:", error);
    return 0;
  }
};
export const getAverageRatingsForSoaps = async (soap_Ids) => {
  try {
    const result = await dbClient.query(
      `SELECT soap_id, COALESCE(AVG(rating), 0) AS average_rating 
       FROM reviews 
       WHERE soap_id = ANY($1) 
       GROUP BY soap_id;`,
      [soap_Ids]
    );

    // Convert result to a dictionary for easy lookup
    return result.rows.reduce((acc, row) => {
      acc[row.soap_id] = parseFloat(row.average_rating); // Ensure numeric value
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching average ratings:", error);
    return {};
  }
};
