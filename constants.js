const environment =
  typeof process.env.ENVIRONMENT === "undefined"
    ? "dev"
    : process.env.ENVIRONMENT.toLowerCase();
exports.environment = () => environment;