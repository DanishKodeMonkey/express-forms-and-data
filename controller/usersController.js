const usersStorage = require('../storages/usersStorage');
const { body, validationResult } = require('express-validator');

// error messages for easy parsing, can be configured here
const alphaErr = 'must only contain letters.';
const lengthErr = 'must be between 1 and 10 characters.';

// validation block centered here.
const validateUser = [
    // During valitation will we take the body elements firstName and Lastname and validate them as follows:
    // body should be trimmed(clear whitespace), checked for alphabetic characters(isAlpha), checked for length requirements(isLength)
    // if any errors occours, attach message to error object(withMessage)
    body('firstName')
        .trim()
        .isAlpha()
        .withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 10 })
        .withMessage(`First name ${lengthErr}`),
    body('lastname')
        .trim()
        .isAlpha()
        .withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 10 })
        .withMessage(`Last name ${lengthErr}`),
];

exports.usersListGet = (req, res) => {
    res.render('index', {
        title: 'User list',

        /* use pseudo database method to fetch user by id (see userStorage) */
        users: usersStorage.getUsers(),
    });
};

exports.usersCreateGet = (req, res) => {
    res.render('createUser', {
        title: 'Create user',
    });
};

// Pass array of middleware validations to controller function.
exports.usersCreatePost = [
    /* Pass request through validateUser mmiddleware */
    validateUser,
    (req, res) => {
        // Pass request to validator, if failed they will be returned as errors.
        const errors = validationResult(req);
        // If errors is not empty, return response with status 400 and re-render createUser.
        // and pass errors for display to inform user.
        if (!errors.isEmpty()) {
            return res.status(400).render('createUser', {
                title: 'Create user',
                errors: errors.array(),
            });
        }
        // otherwise, proceed
        // deconstruct validated request body for elements of our user
        const { firstName, lastName } = req.body;
        // call userStorage adduser method, pass our data (see userStorage).
        usersStorage.addUser({ firstName, lastName });
        // Return to index.
        res.redirect('/');
    },
];

exports.usersUpdateGet = (req, res) => {
    /* use pseudo database method to fetch user by id (see userStorage) */
    const user = usersStorage.getUser(req.params.id);
    res.render('updateUser', {
        title: 'Update user',
        user: user,
    });
};

/* Similar to createUserPost, but we get the existing user object from storage to update. */
exports.usersUpdatePost = [
    validateUser,
    (req, res) => {
        /* Difference is here */
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

/* calls pseudo database delete user method, sweet and simple */
exports.userDeletePost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect('/');
};
