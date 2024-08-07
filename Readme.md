# Express form and data handling basics

This is a basic Express.js application designed to demonstrate how to handle data using forms. It includes routes for creating, updating, and deleting user data, with data stored in a simple in-memory storage class.

This is not intended to be a thorough guide, but rather a breakdown and reference for an initial express setup.

# Dependencies

-   ["express"](http://expressjs.com/): a minimal and flexible Node.js web application framework
-   ["ejs"](https://ejs.co/): a simple templating language that lets you generate HTML markup with plain JavaScript.
-   ["express-validator"](https://express-validator.github.io/docs/): A set of express.js middlewares that wraps the extensive collection of validators and sanitizers offered by validator.js.

# Application Structure

-   **app.js**: Main application file that sets up the Express server and middleware.
-   **package.json**: Project configuration file including dependencies and scripts.
-   **views/**: Directory containing EJS templates for rendering HTML.
-   **storages/userStorage.js**: Class for simulating a database using an in-memory storage.
-   **routes/usersRouter.js**: Defines routes for handling user-related requests.
-   **controller/usersController.js**: Contains the logic for handling requests and interacting with the storage.

# Features

-   **Create User**: Form to create a new user with validation for the first name and last name.
-   **Update User**: Form to update an existing user with pre-filled data.
-   **Delete User**: Button to delete a user with a confirmation prompt.
-   **List Users**: Displays a list of users with options to update or delete each one.

# Detailed Breakdown

## app.js

```javascript
const express = require('express');
const usersRouter = require('./routes/usersRouter');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use('/', usersRouter);

const port = process.env.port || 3000;
app.listen(port, () => {
    console.log('Express data handling launched, listening on ', port);
});
```

-   Sets up the Express application.
-   Configures EJS as the view engine.
-   Uses express.urlencoded middleware to parse URL-encoded bodies.
-   Routes all requests to usersRouter.
-   Starts the server on port 3000 or the port specified in the environment variables.

# views/

-   createUser.ejs: Form for creating a new user.
-   index.ejs: Displays a list of users with options to update or delete each user.
-   updateUser.ejs: Form for updating an existing user.

## views/partials

-   A partial for rendering errors occured during validation

# storages/userStorage.js

    A class to simulate a database using an object for storage.
    Provides methods to add, retrieve, update, and delete users.

```javascript
class usersStorage {
    constructor() {
        this.storage = {};
        this.id = 0;
    }

    addUser({ firstName, lastName }) {
        const id = this.id;
        this.storage[id] = { id, firstName, lastName };
        this.id++;
    }

    getUsers() {
        return Object.values(this.storage);
    }

    getUser(id) {
        return this.storage[id];
    }

    updateUser(id, { firstName, lastName }) {
        this.storage[id] = { id, firstName, lastName };
    }

    deleteUser(id) {
        delete this.storage[id];
    }
}

module.exports = new usersStorage();
```

# routes/usersRouter.js

    Defines routes for listing, creating, updating, and deleting users.
    Each route maps to a specific controller function.

```javascript
const { Router } = require('express');
const usersController = require('../controller/usersController');
const usersRouter = Router();

usersRouter.get('/', usersController.usersListGet);
usersRouter.get('/create', usersController.usersCreateGet);
usersRouter.post('/create', usersController.usersCreatePost);
usersRouter.get('/:id/update', usersController.usersUpdateGet);
usersRouter.post('/:id/update', usersController.usersUpdatePost);
usersRouter.post('/:id/delete', usersController.userDeletePost);

module.exports = usersRouter;
```

# controller/usersController.js

    Contains the logic for each route defined in usersRouter.
    Uses express-validator for input validation.

```javascript
const usersStorage = require('../storages/usersStorage');
const { body, validationResult } = require('express-validator');

const alphaErr = 'must only contain letters.';
const lengthErr = 'must be between 1 and 10 characters.';

const validateUser = [
    body('firstName')
        .trim()
        .isAlpha()
        .withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 10 })
        .withMessage(`First name ${lengthErr}`),
    body('lastName')
        .trim()
        .isAlpha()
        .withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 10 })
        .withMessage(`Last name ${lengthErr}`),
];

exports.usersListGet = (req, res) => {
    res.render('index', {
        title: 'User list',
        users: usersStorage.getUsers(),
    });
};

exports.usersCreateGet = (req, res) => {
    res.render('createUser', {
        title: 'Create user',
    });
};

exports.usersCreatePost = [
    validateUser,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('createUser', {
                title: 'Create user',
                errors: errors.array(),
            });
        }
        const { firstName, lastName } = req.body;
        usersStorage.addUser({ firstName, lastName });
        res.redirect('/');
    },
];

exports.usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    res.render('updateUser', {
        title: 'Update user',
        user: user,
    });
};

exports.usersUpdatePost = [
    validateUser,
    (req, res) => {
        const user = usersStorage.getUser(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('updateUser', {
                title: 'Update user',
                user: user,
                errors: errors.array(),
            });
        }
        const { firstName, lastName } = req.body;
        usersStorage.updateUser(req.params.id, { firstName, lastName });
        res.redirect('/');
    },
];

exports.userDeletePost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect('/');
};
```

# Conclusion

This application serves as a reference for setting up basic form handling and data management in an Express.js application. It demonstrates how to structure routes, controllers, and views, and how to validate user input using express-validator.
