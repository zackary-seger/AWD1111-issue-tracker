import config from 'config';
import Debug from 'debug';
import jwt from 'jsonwebtoken';
import * as dbModule from '../database.js'
const debugMain = Debug('app:routes:user');

function hasRole(...allowedRoles) {
  return async (req, res, next) => {

    const secret = config.get('auth.secret');
    const token = req.cookies.authToken;

    const payload = jwt.verify(token, secret);
    let user = await dbModule.readUserByEmail(payload.email);

    if (!user) {
      return res.status(401).json({ error: 'You are not logged in!' });
    } else if (!user.role) {
      return res.status(403).json({ error: 'You have not been assigned a role!' });
    } else if (user.role === null) {
      return res.status(403).json({ error: 'You have not been assigned a role!' });
    } else {
      for (const allowedRole of allowedRoles) {
        for (const role of user.role) {
          if (role == allowedRole) {
            debugMain({role: role});
            debugMain({allowedRole: allowedRole});
            return next();
          }
        }
      }
      // user is not in any of the allowed groups
      return res.status(403).json({ error: 'You do not have an allowed role!' });
    }
  };
}

export {hasRole}