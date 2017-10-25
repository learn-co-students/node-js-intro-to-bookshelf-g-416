
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTableIfNotExists('posts', (tbl) => {
			tbl.increments('id').primary();
			tbl.string('title');
			tbl.string('body');
			tbl.integer('author').references('users.id');
			tbl.timestamps();
		})
	]);
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('posts');
};
