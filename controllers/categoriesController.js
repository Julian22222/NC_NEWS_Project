const { fetchCategories } = require("../models/categoriesModels");

exports.getCategories = (request, response, next) => {
  fetchCategories().then((category) => {
    response.status(200).send({ category });
  });
};
