const express = require("express");
const app = express();
app.use(express.json());
const { getCategories } = require("./controllers/categoriesController");

app.get("/api/categories", getCategories);

// app.use((err, req, res, next) => {
//   if (err.status && err.message) {
//     res.status(err.status).send({ msg: err.message });
//   } else {
//     next(err);
//   }
// });

// app.use();

module.exports = app;
