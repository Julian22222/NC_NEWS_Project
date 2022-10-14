const {
  commentsById,
  addComment,
  removeComment,
} = require("../models/commentsModels");

exports.getComments = (request, response, next) => {
  const { article_id } = request.params;
  commentsById(article_id)
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch(next);
};

exports.postComments = (request, response, next) => {
  const { article_id } = request.params;
  return addComment(request.body, article_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  removeComment(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch(next);
};
