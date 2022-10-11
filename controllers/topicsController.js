const { fetchTopics } = require("../models/categoriesModels");

exports.getTopics = (request, response, next) => {
  fetchTopics().then((category) => {
    response.status(200).send({ category });
  });
};
