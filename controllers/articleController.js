const { fetchArticleId } = require("../models/articleModels");

exports.getArticleId = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleId(article_id)
    .then((article) => {
      console.log(article);
      response.status(200).send(article);
    })
    .catch((error) => {
      next(error);
    });
};
