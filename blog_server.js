"use strict";

const _            = require('lodash');
const express      = require('express');
const bodyParser   = require('body-parser');
const config  = require('./knexfile.js');

// Initialize Express.
const app = express();
app.use(bodyParser.json());

// Configure & Initialize Bookshelf & Knex.
console.log('Running in environment: ' + process.env.NODE_ENV);
const knex = require('knex')(config[process.env.NODE_ENV]);
const bookshelf = require('bookshelf')(knex);

// This is a good place to start!

// models

const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  posts: function() {
    return this.hasMany(Posts, 'author');
  },
  comments: function() {
    return this.hasMany(Comments);
  },
});

exports.User = User;

const Posts = bookshelf.Model.extend({
  tableName: 'posts',
  hasTimestamps: true,
  author: function() {
    return this.belongsTo(User, 'author');
  },
  comments: function() {
    return this.hasMany(Comments);
  },
});

exports.Posts = Posts;

const Comments = bookshelf.Model.extend({
  tableName: 'comments',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  },
  post: function() {
    return this.belongsTo(Posts);
  },
});

exports.Comments = Comments;

// Exports for Server hoisting.
const listen = (port) => {
  return new Promise((resolve, reject) => {
    app.listen(port, () => {
      resolve();
    });
  });
};

const serverErrorResponse = (error, res) => {
  console.log(error);
  res.status(500).send(error);
};

// endpoints

app.post('/user', (req, res) => {
  if (_.isEmpty(req.body)) return res.status(400).send();

  User
    .forge(req.body)
    .save()
    .then(user => res.status(200).send({id: user.id}))
    .catch( error => serverErrorResponse(error, res));

});

app.get('/user/:id', (req, res) => {
  User
    .forge({id: req.params.id})
    .fetch()
    .then(user => res.status(_.isEmpty(user) ? 404 : 200).send(user))
    .catch(error => serverErrorResponse(error, res));
})

app.post('/post', (req, res) => {
  if (_.isEmpty(req.body)) return res.status(400).send();

  Posts
    .forge(req.body)
    .save()
    .then(post => res.status(200).send({id: post.id}))
    .catch(error => serverErrorResponse(error, res));

});

app.get('/post/:id', (req, res) => {
  Posts
    .forge({id: req.params.id})
    .fetch({withRelated: ['author', 'comments']})
    .then(post => res.status(_.isEmpty(post) ? 404 : 200).send(post))
    .catch(error => serverErrorResponse(error, res));
});

app.get('/posts', (req, res) => {
  Posts
    .fetchAll()
    .then(posts => res.status(_.isEmpty(posts) ? 404 : 200).send(posts))
    .catch(error => serverErrorResponse(error, res));
});

app.post('/comment', (req, res) => {
  if (_.isEmpty(req.body)) return res.status(400).send();

  Comments
    .forge(req.body)
    .save()
    .then(comment => res.status(200).send({id: comment.id}))
    .catch(error => serverErrorResponse(error, res));

});

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

