var express = require('express');
var router = express.Router();

var util = require('../util');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});

router.get('/welcome', util.ensureAuthenticated, function(req, res, next) {
  res.render('welcome', { user: req.user });
});


router.get('/pollList', function(req, res, next) {
  res.render('pollList', { user: req.user });
});

router.get('/poll/:id', function(req, res, next) {
  res.render('poll', { user: req.user });
});

router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
