const db = require('../data/db-config.js');

function createUser(user) {
  return db('users').insert(user);
}

function login(user) {
  return db('users').where('username', user.username);
}

function getUsers(user) {
  return db('users');
}

module.exports = {
  createUser,
  login,
  getUsers
}
