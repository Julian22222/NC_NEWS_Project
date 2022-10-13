const db = require("../db/connection.js");

exports.fetchArticleId = (article_id) => {
  if (!article_id) {
    return Promise.reject({
      status: 400,
      message: "Bad request, invalid article id",
    });
  }

  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id=comments.article_id
    WHERE articles.article_id =$1
    GROUP BY articles.article_id; `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Id not found" });
      }
      return rows[0];
    });
};

exports.updatedVote = (article_id, inc_votes) => {
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

exports.listOfArticles = (topic) => {
  let query = `SELECT articles.*, COUNT(comments.article_id) ::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id=comments.article_id `;

  const topicNames = ["cats", "mitch", "paper"];
  if (topic && !topicNames.includes(topic)) {
    return Promise.reject({ status: 400, msg: "Invalid topic value" });
  }

  const topicArr = [];

  if (topic) {
    query += `WHERE topic= $1 `;
    topicArr.push(topic);
  }

  query += `GROUP BY articles.article_id
  ORDER BY created_at DESC;`;
  return db.query(query, topicArr).then(({ rows }) => {
    console.log(rows);
    return rows;
  });
};

exports.commentsById = (article_id) => {
  if (!article_id) {
    return Promise.reject({
      status: 400,
      message: "Bad request, invalid article id",
    });
  }
  return db
    .query(
      `SELECT comments.* 
    FROM comments
    LEFT JOIN articles ON comments.article_id = articles.article_id
    WHERE comments.article_id = $1
    ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Id not found" });
      }
      return rows;
    });
};
