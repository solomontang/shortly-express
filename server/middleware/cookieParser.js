const parseCookies = (req, res, next) => {
  let cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split('; ').forEach( cookie => { 
      let singleCookie = cookie.split('=');
      cookies[singleCookie[0]] = singleCookie[1]; 
    });
  } 
  req.cookies = cookies;
  next();
};

module.exports = parseCookies;