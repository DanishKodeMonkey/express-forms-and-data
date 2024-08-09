const { Router } = require('express');
const usersController = require('../controller/usersController');
const usersRouter = Router();

/* list */
usersRouter.get('/', usersController.usersListGet);

/* create */
usersRouter.get('/create', usersController.usersCreateGet);
usersRouter.post('/create', usersController.usersCreatePost);

/* update */
usersRouter.get('/:id/update', usersController.usersUpdateGet);
usersRouter.post('/:id/update', usersController.usersUpdatePost);

/* delete */
usersRouter.post('/:id/delete');
module.exports = usersRouter;

usersRouter.get('/search', usersController.userSearchGet);
