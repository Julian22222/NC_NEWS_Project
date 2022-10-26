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

exports.listOfArticles = (sort_by = "created_at", order = "desc", topic) => {
  const articleSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];
  // console.log(articleSortBy.includes(sort_by));
  const validOrder = ["asc", "desc"];
  const topicNames = ["cats", "mitch", "paper", undefined];
  // db.query("SELECT slug FROM topics").then((data) => {
  // console.log(data);
  // use select all
  // });

  if (!topicNames.includes(topic)) {
    return Promise.reject({ status: 400, msg: "Invalid topic value" });
  }

  if (!articleSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by value" });
  }

  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order value" });
  }

  let startquery = `SELECT articles.*, COUNT(comments.article_id) ::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id=comments.article_id `;

  let midQuery = ` `;

  if (topic !== undefined) {
    midQuery = `WHERE topic= '${topic}' `;
  }

  let endquery = `GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order};`;

  let fullQuery = startquery + midQuery + endquery;

  return db.query(fullQuery).then(({ rows }) => {
    return rows;
  });
};
