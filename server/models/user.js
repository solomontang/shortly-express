const utils = require('../lib/hashUtils');
const Model = require('./model');

class Users extends Model {
  constructor() {
    super('users');
  }

  compare(attempted, password, salt) {
    return utils.compareHash(attempted, password, salt);
  }

  create({ username, password }) {
    let timestamp = Date.now();
    let salt = utils.createSalt(timestamp);

    let newUser = {
      username,
      salt,
      password: utils.createHash(password, salt)
    };
    
    return super.create.call(this, newUser);
  }
  
  authenticate(user, callback) {

    super.get({username: user.username})
    
    .then ( (result) => {
      if (result) {
        callback(null, this.compare(user.password, result.password, result.salt));
      } else {
        callback(null, false);
      }
    })
    .catch ( (err) => {
      callback(err, null);
    });
  }
}

module.exports = new Users();
