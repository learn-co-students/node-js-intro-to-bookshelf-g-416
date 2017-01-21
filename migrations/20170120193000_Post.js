
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('posts', (table) => {
      table.increments().primary();
      table.string('title');
      table.string('body');
      table.integer('author').references('users.id');
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('posts')
  ])
};
