const db = require("../db/connection.js");

exports.fetchTopics = () => {
  return db
    .query("SELECT * FROM topics")

    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchReview = (review_id) => {
  return db
    .query(
      `SELECT * FROM articles WHERE article_id =$1, [review_id]
   `
    )
    .then((data) => {
      console.log(data);
      return data;
    });
};

// .query(
//     `SELECT * FROM restaurants
//           JOIN areas
//           ON restaurants.area_id = areas.area_id
//           WHERE areas.area_id = $1;`,
//     [area_id]
//   )
//   .then(({ rows: restaurants }) => {
//     console.log(restaurants);
//     return restaurants;
//   });
// };
