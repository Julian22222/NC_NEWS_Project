const db = require("../db/connection.js");

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });

  //     .then(({ rows }) => {
  //       //.then((data)=>{
  //       //return data.rows
  //       // })
  //       return rows;
  //     });
};
