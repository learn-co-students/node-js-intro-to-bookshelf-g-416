"use strict";

const _       = require('lodash');
const expect  = require('unexpected');
const request = require('supertest');
const baseUrl = 'http://localhost:3000';
const pry = require('pryjs');

const blog = require('../blog_server');

let mockUser = {
  name: 'Sally Low',
  username: 'sally',
  email: 'sally@example.org',
  // password: 'password',
};

let mockPost = {
  title: 'Test Post',
  body: 'This is just a test post with no content.'
};

let mockComment = {
  body: 'This is just a test comment.'
};

const cleanup = () => {
  return Promise.all([
    blog.Comment.where('id', '!=', 0).destroy(),
    blog.Post.where('id', '!=', 0).destroy(),
    blog.User.where('id', '!=', 0).destroy()
  ]);
};

let loginData = {
  username: mockUser.username,
  password: mockUser.password
};

describe('Server', () => {

  after((done) => {
    return cleanup().then(() => {
      done();
    }).catch(done);
  });

  describe('/users endpoint', () => {

    afterEach((done) => {
      cleanup().then(() => {
        done();
      }).catch(done);
    });

    it('POST to /users with valid data returns new user id', (done) => {
      request(baseUrl)
        .post('/users')
        .send(mockUser)
        .expect(200)
        .end((err, resp) => {
          if (err) done(err);
          expect(resp.body, 'to have key', 'id');
          expect(resp.body.id, 'to be a', 'number');
          done();
        });
    });

    it('POST to /users with invalid data returns 400', (done) => {
      request(baseUrl)
        .post('/users')
        .send({})
        .expect(400, done);
    });

    it('GET to /users/:userId with id specified returns usr object', (done) => {
      blog.User.forge().save(mockUser).then((usr) => {
        request(baseUrl)
          .get('/users/' + usr.get('id'))
          .expect(200)
          .end((err, resp) => {
            if (err) done(err);
            expect(resp.body, 'to have keys', [
              'id',
              'name',
              'username',
              'email',
              'created_at',
              'updated_at',
            ]);
            expect(resp.body.id, 'to be a', 'number');
            expect(resp.body.id, 'to be', usr.get('id'));
            expect(resp.body.name, 'to be', mockUser.name);
            expect(resp.body.username, 'to be', mockUser.username);
            expect(resp.body.email, 'to be', mockUser.email);
            done();
          });
      });
    });

    it('GET to /user/:userId with non-existant user specified returns 404', (done) => {
       request(baseUrl)
        .get('/user/' + 7009)
        .expect(404, done);
    });

  });


  describe('/posts endpoint:', () => {

    afterEach((done) => {
      cleanup().then(() => {
        done();
      }).catch(done);
    });

    it('POST to /posts with post data returns new post id', (done) => {
      blog.User.forge().save(mockUser).then((usr) => {
        let data = _.extend({author: usr.get('id')}, mockPost);
        request(baseUrl)
          .post('/posts')
          .send(data)
          .expect(200)
          .end((err, resp) => {
            if (err) return done(err);
            expect(resp.body, 'to have key', 'id');
            expect(resp.body.id, 'to be a', 'number');
            done();
          });
      });
    });

    it('POST to /posts with invalid data returns 400', (done) => {
      request(baseUrl)
        .post('/posts')
        .send({})
        .expect(400, done);
    });

    it('GET to /posts/:postId with id specified returns post object', (done) => {
      let createUser = blog.User.forge().save(mockUser);
      let testUserId;
      blog.User
        .forge()
        .save(mockUser)
        .then((usr) => {
          testUserId = usr.get('id');
          return blog.Post
            .forge()
            .save(_.extend({author: testUserId}, mockPost));
        })
        .then((post) => {
          request(baseUrl)
            .get('/posts/' + post.get('id'))
            .expect(200)
            .end((err, resp) => {
              if (err) done(err);
              expect(resp.body, 'to have keys', [
                'id',
                'title',
                'body',
                'created_at',
                'updated_at',
              ]);
              expect(resp.body.id, 'to be a', 'number');
              expect(resp.body.id, 'to be', post.get('id'));
              expect(resp.body.title, 'to be', mockPost.title);
              expect(resp.body.body, 'to be', mockPost.body);
              expect(resp.body.author, 'to be a', 'object');
              expect(resp.body.author.id, 'to be', testUserId);
              expect(resp.body.author.name, 'to be', mockUser.name);
              done();
          });
        }).catch(done);
    });

    it('GET to /posts/:postId with non-existant user id specified returns 404', (done) => {
      request(baseUrl)
        .get('/posts/' + 10000095)
        .expect(404, done);
    });

  });

  describe('/posts endpt', () => {

    afterEach((done) => {
      return cleanup().then(() => {
        done();
      }).catch(done);
    });

    it('GET to /posts returns a list of all the posts', (done) => {
      blog.User.forge().save(mockUser).then((usr) => {
        return  blog.Post
          .forge()
          .save(_.extend({author: usr.get('id')}, mockPost));
      }).then((post) => {
        request(baseUrl)
          .get('/posts')
          .expect(200)
          .end((err, resp) => {
            if (err) return done(err);
            expect(resp.body, 'to be a', 'array');
            done();
          });
      }).catch(done);
    });

  });

  describe('/comments endpt', () => {

    afterEach((done) => {
      return cleanup().then(() => {
        done();
      }).catch(done);
    });

    it('POST to /comments with valid data returns new comment id', (done) => {
      let testUserId;
      blog.User.forge().save(mockUser).then((usr) => {
        testUserId = usr.get('id');
        return blog.Post
          .forge()
          .save(_.extend({author: testUserId}, mockPost));
      }).then((post) => {
        request(baseUrl)
          .post('/comments')
          .send(_.extend({
            author: testUserId,
            post: post.get('id')
          }, mockComment))
          .expect(200)
          .end((err, resp) => {
            if (err) done(err);
            expect(resp.body, 'to have key', 'id');
            expect(resp.body.id, 'to be a', 'number');
            done();
          });
      }).catch(done);
    });

    it('POST to /comments with empty data returns 400', (done) => {
      request(baseUrl)
        .post('/comments')
        .send({})
        .expect(400, done);
    });

    it('GET to /post/:id where post has comment includes comments in response', (done) => {
      let testUserId;
      let testPostId;
      blog.User.forge().save(mockUser).then((usr) => {
        testUserId = usr.get('id');
        return blog.Post
          .forge()
          .save(_.extend({author: testUserId}, mockPost));
      }).then((post) => {
        testPostId = post.get('id');
        return blog.Comment
          .forge()
          .save({
            author: testUserId,
            post: post.get('id')
          }, mockComment);
      }).then(() => {
        request(baseUrl)
          .get('/posts/' + testPostId)
          .expect(200)
          .end((err, resp) => {
            if (err) done(err);
            expect(resp.body, 'to have key', 'comments');
            expect(resp.body.comments, 'to be a', 'array');
            expect(resp.body.comments, 'to have length', 1);
            done();
          });
      });

    });

  });

});
