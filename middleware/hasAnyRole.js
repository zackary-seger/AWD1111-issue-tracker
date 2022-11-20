
const hasAnyRole = () => {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({ error: 'You are not logged in!' });
    } else if (req.auth.role && typeof req.auth.role === 'string') {
      return next();
    } else if (req.auth.role != null && req.auth.role[0]) {     // edit: changed to != null
      return next();
    } else {
      return res.status(403).json({ error: 'You have not been assigned a role!' });
    }
  };
}

export { hasAnyRole } 