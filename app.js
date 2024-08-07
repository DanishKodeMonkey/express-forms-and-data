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
