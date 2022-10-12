const db = require("../db/connection.js");

exports.fetchArticleId = (article_id) => {
  if (!article_id) {
    return Promise.reject({
      status: 400,
      message: "Bad request, invalid article id",
    });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id =$1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Id not found" });
      }
      return rows[0];
    });
};

exports.updatedVote = (article_id, inc_votes) => {
  console.log(inc_votes, "HEREEEEE");
  console.log(article_id, "ARTICALLL");
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Missing required fields",
    });
  }

  if (inc_votes && typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Invalid article input",
    });
  } else {
    return db
      .query(
        "UPDATE articles SET votes =votes+$1 WHERE article_id=$2 RETURNING *; ",
        [inc_votes, article_id]
      )
      .then(({ rows }) => {
        if (rows[0] === undefined) {
          return Promise.reject({ status: 404, msg: "Id not found" });
        }
        return rows;
      });
  }
};
