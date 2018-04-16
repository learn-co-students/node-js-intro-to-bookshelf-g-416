// Update with your config settings.

module.exports = {

  testing: {
    client: 'pg',
    // connection: {
    //   host : '127.0.0.1',
    //   port: 5432,
    //   user : 'postgres',
    //   password : '',
    //   database: 'learnco_blog_test'
    // },
    connection: 'postgres://postgres:@localhost/learnco_blog_test',
    pool: {
      min:2,
      max: 10
    }
  },

  development: {
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '',
      database: 'learnco_blog'
    },
    pool: {
      min: 2,
      max: 10
    }
  },

};
