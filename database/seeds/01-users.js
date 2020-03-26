exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          "username": "test1",
          "password": "test1"          
        }, {
          "username": "test2",
          "password": "test2",
        }, {
          "username": "test3",
          "password": "test3",
        }
      ]);
    });
};