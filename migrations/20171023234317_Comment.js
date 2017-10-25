
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTableIfNotExists('comments', (tbl) => {
			tbl.increments('id').primary();
			tbl.string('body');
			tbl.integer('user_id').references('users.id');
			tbl.integer('post_id').references('posts.id');
			tbl.timestamps();
		})
	]);
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('comments');
};
