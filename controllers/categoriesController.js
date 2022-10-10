const { fetchCategories, fetchReview } = require("../models/categoriesModels");

exports.getCategories = (request, response, next) => {
  fetchCategories().then((category) => {
    response.status(200).send({ category });
  });
};

exports.getReview = (request, response, next) => {
  const { review_id } = request.params;
  fetchReview(review_id).then((data) => {
    response.status(200).send(data);
  });
};
