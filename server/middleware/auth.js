const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  
  console.log('create session ', req.cookies);
  //check for user-agent
  //if mismatch
    //delete record
  //else 
    //do rest of this
  if (!Object.keys(req.cookies).length ) {
    models.Sessions.create(Date.now())
    .then( (status) => {
      return models.Sessions.get({'id': status.insertId})
      .then( (session) => {
        // req.param('session', {'hash': session.hash})
        req.session = {'hash': session.hash};
        res.cookies = {'shortlyid': {'value': session.hash}};
        next();
      });
    })
    .catch( (err) => {
      console.log('Error creating session ', err);
    });
  } else {
    //we havea  cookie but check it if it matches sessions on the db
      //if doesn't match 
    req.session = {'hash': req.cookies.shortlyid};
    next();
  }
};

/************************************************************/
// Add additional authentication middleware functions below 
/************************************************************/

//Make a session without user,
//when the user login/signup, update the session table
//so that the current session is associated with the userId?

/*
  if (Object.keys(req.cookies).length) {
   
  } else {  //no cookies then create session
    if (!req.body.username) {
  
    } else {
    
    }
   
    models.Users.get({username: username})
    .then ( (user) => {

      console.log('retrieved user ', user);
      return models.Session.create(user.id)

      .then ( (session) => {
        console.log('created session ', session);
        req.session = {'hash': session.hash};
      });
    })
    .catch( (err) => {
      console.log('Error creating either a session or getting a user', req.body.username, err);
    });
    
  }
  next();

*/