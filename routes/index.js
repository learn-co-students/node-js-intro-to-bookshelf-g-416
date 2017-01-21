const _ = require('lodash');
const express = require('express');
const router = express.Router();
const pry = require('pryjs');

module.exports = (models) => {

  const { User, Post, Comment } = models;

  /*
    POST '/user'
  */
  router
    .route('/users')
    .post((req, res) => {
      if (_.isEmpty(req.body)) {
        return res.status(400).json({ message: "You must pass in information about this user" });
      }

      User
        .forge(req.body)
        .save()
        .then(user => res.send({ id: user.id }))
        .catch(err => res.status(500).json({ message: err }));
    });

  /*
    GET '/user/:userId'
  */
  router
    .route('/users/:userId')
    .get((req, res) => {
      User
        .forge({ id: req.params.userId })
        .fetch()
        .then((user) => {
          if (_.isEmpty(user)) {
            return res.sendStatus(404);
          }
          res.json(user)
        })
        .catch(err => res.status(500).json({ message: err }))
    });

  /*
    POST '/post'
  */
  router
    .route('/posts')
    .post((req, res) => {
      if (_.isEmpty(req.body)) {
        return res.status(400).json({ message: "You must pass in information about this post" });
      }

      Post
        .forge(req.body)
        .save()
        .then((post) => {
          if (_.isEmpty(post)) {
            return res.sendStatus(404);
          }

          res.json({ id: post.id })
        })
        .catch(err => res.status(500).json({ message: err }));
    });

  /*
    GET '/post/:postId'
  */
  router
    .route('/posts/:postId')
    .get((req, res) => {
      Post
        .forge({ id: req.params.postId })
        .fetch({ withRelated: ['author', 'comments'] })
        .then((post) => {
          if (_.isEmpty(post)) {
            return res.sendStatus(404);
          }
          res.json(post)
        })
        .catch(err => res.status(500).json({ message: err }))
    })

  /*
    GET '/posts'
  */
  router
    .route('/posts')
    .get((req, res) => {
      Post
        .collection()
        .fetch()
        .then(posts => res.json(posts))
        .catch(err => res.status(500).json({ message: err }));
    });

    /*
      POST '/comments'
    */
  router
    .route('/comments')
    .post((req, res) => {
      if (_.isEmpty(req.body)) {
        return res.status(400).json({ message: "You must pass in information about this comment" });
      }

      Comment
        .forge(req.body)
        .save()
        .then((comment) => {
          if (_.isEmpty(comment)) {
            return res.sendStatus(404);
          }

          res.json({ id: comment.id })
        })
        .catch(err => res.status(500).json({ message: err }));
    });

  return router
}
