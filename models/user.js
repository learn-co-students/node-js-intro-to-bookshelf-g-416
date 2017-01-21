module.exports = (bookshelf) => {
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

  return User;
}
