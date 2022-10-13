const {
  fetchArticleId,
  updatedVote,
  listOfArticles,
  commentsById,
} = require("../models/articleModels");

exports.getArticleId = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleId(article_id)
    .then((article) => {
      response.status(200).send(article);
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  updatedVote(article_id, inc_votes)
    .then((rows) => {
      response.status(201).send(rows[0]);
    })
    .catch(next);
};

exports.getAllArticles = (request, response, next) => {
  listOfArticles(request.query.topic)
    .then((rows) => {
      response.status(200).send(rows);
    })
    .catch(next);
};

exports.getComments = (request, response, next) => {
  const { article_id } = request.params;
  commentsById(article_id)
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch(next);
};
