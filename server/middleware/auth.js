const models = require('../models');
const Promise = require('bluebird');



module.exports.createSession = (req, res, next) => {

  var setSession = (session) => {
    console.log('new session', session);
    res.cookies = {'shortlyid': {'value': session.hash}};
    req.session = session;
    next();
  };
  
  //if no cookie is on req
    //make session and attach to req and appropriate cookie to res
  // else
    //check if cookie on req matches DB hash
      //if true, attach session to req
      //else make new session and attach to req, and cookie to res.
  
  if (Object.keys(req.cookies).length === 0) {  //NO COOKIE
    console.log('No cookies found, creating session');
    models.Sessions.create(Date.now())
    .then( (status) => {
      return models.Sessions.get({'id': status.insertId})
      .then(setSession);
    })
    .catch( (err) => {
      console.log('Error creating session ', err);
    });
  } else { //WE HAVE A COOKIE
    console.log('req.cookies', req.cookies, '\nreq.session', req.session, '\nres.cookies', res.cookies);
    models.Sessions.get({'hash': req.cookies.shortlyid})
    .then( (retrievedSession) => {
      if (retrievedSession) {
        req.session = retrievedSession;
        next();
      } else {
        models.Sessions.create(Date.now())
        .then(setSession);
      }
    })
    .catch( (err) => {
      console.log('Error retrieving session', err);
    });
    //req.session = {'hash': req.cookies.shortlyid};
  }
};
