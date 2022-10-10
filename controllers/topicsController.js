const { fetchTopics, fetchArticleId } = require("../models/categoriesModels");

exports.getTopics = (request, response, next) => {
  fetchTopics().then((category) => {
    response.status(200).send({ category });
  });
};

exports.getArticleId = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleId(article_id).then((article) => {
    response.status(200).send(article);
  });
};
