
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', (tbl) => {
      tbl.increments('id').primary();
      tbl.string('name');
      tbl.string('email');
      tbl.string('username');
      tbl.timestamps();
    }),
    knex.schema.createTableIfNotExists('posts', (tbl) => {
      tbl.increments().primary();
      tbl.string('title');
      tbl.string('body');
      tbl.integer('author').references('users.id');
      tbl.timestamps();
    }),
    knex.schema.createTableIfNotExists('comments', (tbl) => {
      tbl.increments().primary();
      tbl.string('body');
      tbl.integer('user_id').references('users.id');
      tbl.integer('post_id').references('posts.id');
      tbl.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('users')
    .dropTable('comments')
    .dropTable('posts');
};
