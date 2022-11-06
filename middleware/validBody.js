
const validBody = ( schema ) => {
  return (req, res, next) => {
    console.log('req.body: ' + req.body)
    const validateResult = schema.validate(req.body, { abortEarly: false });
    if (validateResult.error){
      return res.status(400).json({  error: `${validateResult.error}` });
    } else {
      req.body = validateResult.value;
      return next();
    }
  };
};

export {validBody};