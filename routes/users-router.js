const usersRouter = require('express').Router();
const {getAllUsers, getUser} = require('../controllers/users.controller.js')

usersRouter.get('/', getAllUsers);

usersRouter.get('/:username', getUser);

module.exports = usersRouter;