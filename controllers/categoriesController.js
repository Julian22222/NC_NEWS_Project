const { fetchTopics, fetchReview } = require("../models/categoriesModels");

exports.getTopics = (request, response, next) => {
  fetchTopics().then((category) => {
    response.status(200).send({ category });
  });
};

exports.getReview = (request, response, next) => {
  const { review_id } = request.params;
  fetchReview(review_id).then((data) => {
    response.status(200).send(data);
  });
};
