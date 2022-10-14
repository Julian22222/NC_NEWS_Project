const { commentsById, addComment } = require("../models/commentsModels");

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
  //   console.log(request.body);
  return addComment(request.body, article_id)
    .then((comment) => {
      //   console.log(comment);
      response.status(201).send({ comment });
    })
    .catch(next);
};
