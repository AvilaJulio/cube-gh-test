module.exports = {

  checkSqlAuth: async (req, username) => {
    if (username === process.env.CUBEJS_SQL_USER) {
      return {
        password: process.env.CUBEJS_SQL_PASSWORD,
        securityContext: {
          isSuperUser: true
        }
      };
    } else if (username === 'test_rls') {
      return {
        password: process.env.CUBEJS_SQL_PASSWORD,
        securityContext: {}
      };
    }
  },
};