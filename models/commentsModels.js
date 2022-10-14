const db = require("../db/connection.js");

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

exports.addComment = (newComment, article_id) => {
  //   const { username, body } = newComment;
  //   console.log(newComment, article_id);
  // console.log--> { username: 'Jess Jelly', body: 'YO' } 1
  console.log(newComment.username, newComment.body, article_id);

  if (!author && !body) {
    return Promise.reject({
      status: 400,
      msg: "Invalid input entered",
    });
  }

  return db
    .query(
      `INSERT INTO comments (author,body,article_id) VALUES($1, $2, $3) 
      RETURNING*;`,
      [newComment.username, newComment.body, article_id]
    )
    .then(({ rows }) => {
      console.log(rows);
      return rows;
    });
};
