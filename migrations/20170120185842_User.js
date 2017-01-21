
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.increments();
      table.string('name');
      table.string('username');
      table.string('email');
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('users')
  ]);
};
