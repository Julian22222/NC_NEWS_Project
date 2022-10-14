const express = require("express");
const app = express();
app.use(express.json());
const { getTopics } = require("./controllers/topicsController");
const {
  getArticleId,
  patchArticleId,
  getAllArticles,
} = require("./controllers/articleController");
const { getUsers } = require("./controllers/usersController");
const {
  getComments,
  postComments,
} = require("./controllers/commentsController");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleId);

app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchArticleId);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComments);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request, invalid article id" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
