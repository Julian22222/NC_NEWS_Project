const express = require("express");
const app = express();
app.use(express.json());
const { getTopics, getReview } = require("./controllers/topicsController");

app.get("/api/topics", getTopics);

app.get("/api/reviews/:review_id", getReview);

// app.use((err, req, res, next) => {
//   if (err.status && err.message) {
//     res.status(err.status).send({ msg: err.message });
//   } else {
//     next(err);
//   }
// });

// app.use();

module.exports = app;
