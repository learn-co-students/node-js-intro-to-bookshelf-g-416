"use strict";

const _      = require('lodash');
const expect = require('unexpected');

const blog = require('../blog_server');

let mockUser = {
  name: 'Sally Low',
  username: 'sally',
  email: 'sally@example.org'
};

let mockPost = {
  title: 'My Test Post',
  body: 'This is just a test post with no real content.',
};

let mockComment = {
  body: 'This is a test comment.',
};

describe('Models', () => {

  it('User models exist', () => {
    expect(blog.User, 'to be defined');
  });

  it('User model can save a user', (done) => {
    blog.User
      .forge(mockUser)
      .save()
      .then((usr) => {
        expect(usr.attributes, 'to have keys', [
          'name',
          'email',
          'username',
        ]);
        expect(usr.get('name'), 'to be', mockUser.name);
        expect(usr.get('email'), 'to be', mockUser.email);
        expect(usr.get('username'), 'to be', mockUser.username);
        mockUser.id = usr.get('id');
        done();
      });
  });

  it('Posts model exists', () => {
    expect(blog.Post, 'to be defined');
  });

  it('Posts model can save a post', (done) => {
    mockPost.author = mockUser.id;
    blog.Post
      .forge(mockPost)
      .save()
      .catch((err) => { done(err); })
      .then((post) => {
        expect(post.attributes, 'to have keys', [
          'title',
          'body',
          'id',
          'author',
        ]);
        mockPost.id = post.get('id');
        done();
      });
  });

  it('Comments model exists', () => {
    expect(blog.Comment, 'to be defined');
  });

  it('Comments model can save a comment on a post', (done) => {
    mockComment.post = mockPost.id;
    mockComment.author = mockUser.id;
    blog.Comment
      .forge(mockComment)
      .save()
      .catch((err) => {
        done(err);
      })
      .then((comment) => {
        expect(comment.attributes, 'to have keys', [
          'id',
          'author',
          'post',
          'body',
          'created_at',
          'updated_at',
        ]);
        done();
      });
  });

});
