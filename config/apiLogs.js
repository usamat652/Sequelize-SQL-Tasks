import LogModel from '../models/apiLog.js'; 

const logRequestDetails = (req, res, next) => {
  const logData = {
    level: req.method, 
    message: `${req.url}`,
    meta: req.body,
  };

  res.on('finish', () => {
    logData.statusCode = res.statusCode;

    // Log the request details using the LogModel and Sequelize
    LogModel.create(logData)
      .then(() => {
        console.log('Log entry saved successfully');
      })
      .catch((error) => {
        console.error('Error saving log entry to Sequelize:', error);
      });
  });

  next();
};

export default logRequestDetails;
