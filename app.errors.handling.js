function hadlingPsqlErrors(err, req, res, next) {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request, invalid article id" });
  } else {
    next(err);
  }
}

function hadlingErrors(err, req, res, next) {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
}

module.exports = { hadlingPsqlErrors, hadlingErrors };
