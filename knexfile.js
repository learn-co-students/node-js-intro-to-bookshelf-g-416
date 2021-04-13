// Update with your config settings.

module.exports = {

  testing: {
    client: 'pg',
    connection: 'postgres://postgres:@localhost/learnco_blog_test',
    pool: {
      min: 2,
      max: 10
    }
    // migrations: {
    //   tableName: 'knex_migrations'
    // }
  },

  development: {
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'dashakondratieva',
      password : '',
      database: 'learnco_blog'
    },
    pool: {
      min: 2,
      max: 10
    },
    // migrations: {
    //   tableName: 'knex_migrations'
    // }
  },

};
