import Debug from 'debug';
const debugMain = Debug('app:middleware:auth');
import config from 'config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const authSecret = config.get('auth.secret');

function auth() {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const authCookie = req.cookies.authToken;

    if (authHeader) {
      const [authType, authToken] = authHeader.split(' ', 2);
      if (authType === 'Bearer' && authToken) {
        try {
          req.auth = jwt.verify(authToken, authSecret);
        } catch (err) {
          debugMain('invalid token:', err.message);
        }
      } else {
        debugMain('unsupported auth type:', authType);
      }
    } else if (authCookie) {
      try {
        req.auth = jwt.verify(authCookie, authSecret);
        const cookieOptions = {
          httpOnly: true,
          maxAge: parseInt(config.get('auth.cookieMaxAge')),
        };
        res.cookie('authToken', authCookie, cookieOptions);
      } catch (err) {
        debugMain('invalid token:', err.message);
      }
    }

    return next();
  };
}

export { auth };