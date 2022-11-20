
const hasAnyRole = () => {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({ error: 'You are not logged in!' });
    } else if (req.auth.role === 'null') {     // edit: added to handle nulls that are default..
      return res.status(403).json({ error: 'You have not been assigned a role!' });
    } else if (req.auth.role && typeof req.auth.role === 'string') {
      return next();
    } else if (req.auth.role && req.auth.role[0]) {
      return next();
    }
  };
}

export { hasAnyRole } 