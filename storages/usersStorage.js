// Class simulates interaction with a database, in this case a locally stored class with methods to call.

class usersStorage {
    /* construct userStorage instance with storage object, and id iterator starting at 0 */
    constructor() {
        this.storage = {};
        this.id = 0;
    }

    /* addUser method accepting 2 parameters */
    addUser({ firstName, lastName, email, age, bio }) {
        /* pass current iteration of id to function id */
        const id = this.id;
        /* pass data, and function id to storage object */
        this.storage[id] = { id, firstName, lastName, email, age, bio };
        /* itterate object */
        this.id++;
    }

    getUsers() {
        /* return all contents of storage object */
        return Object.values(this.storage);
    }

    getUser(id) {
        /* return object from storage matching id */
        return this.storage[id];
    }

    updateUser(id, { firstName, lastName, email, age, bio }) {
        /* replace storage object with matching id with new data */
        this.storage[id] = { id, firstName, lastName, email, age, bio };
    }

    deleteUser(id) {
        /* delete storage item matching id */
        delete this.storage[id];
    }
}

// Export an instance of the class, as we dont want more than one instance of the class to exist at a time.
module.exports = new usersStorage();
