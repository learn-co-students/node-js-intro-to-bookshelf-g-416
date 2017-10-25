exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTableIfNotExists('users', (tbl) => {
			tbl.increments('id').primary();
			tbl.string('name');
			tbl.string('username');
			tbl.string('email');
			tbl.timestamps();
		})
	]);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
