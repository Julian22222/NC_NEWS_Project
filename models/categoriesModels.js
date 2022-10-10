const db = require("../db/connection.js");

exports.fetchTopics = () => {
  return db
    .query("SELECT * FROM topics")

    .then(({ rows }) => {
      //.then((data)=>{
      //return data.rows
      // })
      return rows;
    });
};

exports.fetchArticleId = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id =$1;`, [article_id])
    .then(({ rows }) => {
      // console.log(rows);
      return rows[0];
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
