module.exports = (bookshelf) => {
  const Post = bookshelf.Model.extend({
    tableName: 'posts',
    hasTimestamps: true,
    author: function() {
      return this.belongsTo(User, 'author');
    },
    comments: function() {
      return this.hasMany(Comment);
    },
  });

  return Post;
}
