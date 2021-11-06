const {requireAuth, checkUser} = require('../middleware/authMiddleware');

module.exports = function(app) {
    app.get('*', checkUser);

    app.get('', (req, res) => {
        res.render('home');
    });

    app.get('/professionals', requireAuth, (req, res) => {
        res.render('professionals');
    });
};