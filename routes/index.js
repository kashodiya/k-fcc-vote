var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/welcome', function(req, res, next) {
  res.render('welcome', { user: req.user });
});

router.get('/poll/:id', function(req, res, next) {
  res.render('poll');
});

router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
