"use strict";

const _            = require('lodash');
const express      = require('express');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const config  = require('./knexfile.js');

// Initialize Express.
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Content-Type", "application/json");
  next();
})

const currentEnv = process.env.NODE_ENV
// Configure & Initialize Bookshelf & Knex.
console.log('Running in environment: ' + process.env.NODE_ENV);
const knex = require('knex')(config[process.env.NODE_ENV]);
const bookshelf = require('bookshelf')(knex);

// This is a good place to start!

const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  posts: function() {
    return this.hasMany(Post, 'author');
  },
  comments: function() {
    return this.hasMany(Comment);
  },
});

const Post = bookshelf.Model.extend({
  tableName: 'posts',
  hasTimestamps: true,
  author: function() {
    return this.belongsTo(User, 'author');
  },
  comments: function() {
    return this.hasMany(Comment, 'post');
  },
});

const Comment = bookshelf.Model.extend({
  tableName: 'comments',
  hasTimestamps: true,
  author: function() {
    return this.belongsTo(User, 'author');
  },
  comments: function() {
    return this.belongsTo(Post, 'post');
  },
});

const models = {
  User,
  Post,
  Comment
}

exports.User = User;
exports.Post = Post;
exports.Comment = Comment;

const index = require('./routes/index')(models);

app.use('/', index);

// Exports for Server hoisting.
const port = 3000;
const listen = (port) => {
  return new Promise((resolve, reject) => {
    app.listen(port, () => {
      console.log('listening on port', port)
      resolve();
    });
  });
};
if (currentEnv === "development") {
  listen(port);
};

exports.up = (justBackend) => {
  return knex.migrate.latest([process.env.NODE_ENV])
    .then(() => {
      return knex.migrate.currentVersion();
    })
    .then((val) => {
      console.log('Done running latest migration:', val);
      return listen(3000);
    })
    .then(() => {
      console.log('Listening on port 3000...');
    });
};
