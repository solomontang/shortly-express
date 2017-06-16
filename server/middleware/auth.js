const models = require('../models');
const Promise = require('bluebird');


module.exports.createSession = (req, res, next) => {
  let agent = req.get('User-Agent');

  Promise.resolve(req.cookies.shortlyid)
    .then(hash => {
      if (!hash) {
        throw hash;
      }
      return models.Sessions.get({ hash });
    })
    .tap(session => {
      if (!session) {
        throw session;
      }
      // verify token; if invalid, throw to create new session
      if (!models.Sessions.compare(agent, session.hash, session.salt)) {
        return models.Sessions.delete({ hash: session.hash }).throw(agent);
      }
    })
    // initializes a new session
    .catch(() => {
      return models.Sessions.create(agent)
        .then(results => {
          return models.Sessions.get({ id: results.insertId });
        })
        .tap(session => {
          res.cookie('shortlyid', session.hash);
        });
    })
    .then(session => {
      req.session = session;
      next();
    });
};


module.exports.destroySession = (req, res, next) => {
  models.Sessions.delete({'hash': req.cookies.shortlyid})
  .then( status => {
    delete req.cookies.shortlyid;
    next();
  })
  .error ( err => {
    console.log('Error deleting session from db', err);
  });
};


module.exports.verify = (req, res, next) => {
  let agent = req.get('User-Agent');
  //use user-agent in the hash
  models.Sessions.get({'hash': req.cookies.shortlyid})
  .then( (session) => {
    if (!session) {
      res.redirect('/login');
    } else {
      next();
    }
  })
  .error ( (err) => {
    console.log('Error in user verification: ', err);
  });
};







