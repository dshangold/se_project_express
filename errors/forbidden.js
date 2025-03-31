class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = "Forbidden Error";
  }
}

module.exports = ForbiddenError;
