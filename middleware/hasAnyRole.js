import config from 'config';
import Debug from 'debug';
import jwt from 'jsonwebtoken';
import * as dbModule from '../database.js'
const debugMain = Debug('app:routes:user');

const hasAnyRole = () => {
  return async (req, res, next) => {

    const secret = config.get('auth.secret');
    const token = req.cookies.authToken;

    let payload;

    if (token) {
      payload = jwt.verify(token, secret)
    }

    let user = await dbModule.readUserByEmail(payload.email);

    if (!user) {
      return res.status(401).json({ error: 'You are not logged in!' });
    } else if (user.role == null) {     // edit: added to handle nulls that are default..
      return res.status(403).json({ error: 'You have not been assigned a role!' });
    } else if (user.role && typeof user.role === 'string') {
      return next();
    } else if (user.role != null && user.role[0]) {
      return next();
    } else {
      return res.status(403).json({ error: 'You have not been assigned a role!' });
    }
  };
}

export { hasAnyRole } 