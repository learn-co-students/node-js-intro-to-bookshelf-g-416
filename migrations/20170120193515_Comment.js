exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('comments', (table) => {
      table.increments().primary();
      table.string('body');
      table.integer('author').references('users.id');
      table.integer('post').references('posts.id');
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('comments')
  ])
};
