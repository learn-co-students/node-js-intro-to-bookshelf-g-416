const blog = require('./blog_server');
const config  = require('./knexfile.js');
const knex = require('knex')(config['testing']);
knex.migrate.latest();
blog.up();