module.exports = function(username, password) {
    return function(req, res, next) {
        var basicAuth = require('basic-auth');

        //Get the basic auth info
        var user = basicAuth(req);

        //Check that there is a user, username, and password and that they match
        if (!user || !user.name || !user.pass || user.name !== username ||
            user.pass !== password) {
            //If not, unauthorize them
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            res.status(401).end();
        } else {
            return next();
        }
    };
}
