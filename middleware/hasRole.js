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
      
      debugMain(allowedRoles);

      for (const allowedRole of allowedRoles) {       // All I have to say about this idea is lol 😅 It may seem crazy,
        for (const singleRole of allowedRole) {       // but it literally never has to make a search through more than 
          for (const role of user.role) {             // 20 array elements, so it will be fast no matter what this way. 
            if (singleRole == role) {
              return next();
            }
          }
        }
      }

      // user is not in any of the allowed groups
      return res.status(403).json({ error: 'You do not have an allowed role!' });

    }
  };
}

export {hasRole}