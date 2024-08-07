const { Router } = require('express');
const usersController = require('../controller/usersController');
const usersRouter = Router();

/* list */
usersRouter.get('/', usersController.usersListGet);

/* create */
usersRouter.get('/create', usersController.usersCreateGet);
usersRouter.post('/create', usersController.usersCreatePost);

/* update */
usersRouter.get('/update', usersController.usersUpdateGet);
usersRouter.post('/update', usersController.usersUpdatePost);

module.exports = usersRouter;
