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
