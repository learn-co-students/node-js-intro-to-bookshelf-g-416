module.exports = (bookshelf) => {
  const Comment = bookshelf.Model.extend({
    tableName: 'comments',
    hasTimestamps: true,
    author: function() {
      return this.belongsTo(User, 'author');
    },
    comments: function() {
      return this.belongsTo(Post);
    },
  });

  return Comment;
}
