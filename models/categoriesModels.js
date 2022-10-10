const db = require("../db/connection.js");

exports.fetchCategories = () => {
  return db
    .query("SELECT * FROM topics")

    .then(({ rows }) => {
      return rows;
    });
};
