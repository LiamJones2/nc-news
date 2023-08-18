const apiRouter = require('express').Router();
const {returnEndpoints} = require('../controllers/app.controller.js')

apiRouter.get('/', returnEndpoints);

module.exports = apiRouter;