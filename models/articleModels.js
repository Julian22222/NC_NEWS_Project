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
        //Eror handling 404
        return Promise.reject({ status: 404, msg: "Id not found" }); //Eroro handling 404
      }
      // console.log(rows);
      return rows[0];
    });
};
