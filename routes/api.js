var express = require('express');
var router = express.Router();
var Poll = require('../poll');

router.get('/polls', function (req, res) {
  Poll.find({username: req.user.username}, function (err, polls) {
    if (err) {
      res.json({
        status: 'fail',
        err: err
      });
    } else {
      res.json({status: 'success', polls: polls});
    }
  });
});

router.get('/poll/:id', function (req, res) {
  console.log('finding by id', {
    id: req.params.id
  });

  Poll.findById(req.params.id, function (err, poll) {
    if (err) {
      res.json({
        status: 'fail',
        err: err
      });
    } else {
      res.json({
        status: 'success',
        poll: poll
      });
    }
  });
});

router.delete('/poll/:id', function (req, res) {
  console.log('delete by id', {
    reqParam: req.params
  });

  Poll.findByIdAndRemove(req.params.id, function (err, poll) {
    if (err) {
      res.json({
        status: 'fail',
        err: err
      });
    } else {
      res.json({
        status: 'success'
      });
    }
  });
});


router.get('/config', function (req, res) {
  res.json({
    baseUrl: process.env.BASE_URL
  });
});


router.post('/addVote', function (req, res, next) {

  Poll.findById(req.body.id, function (err, poll) {
    if (err) {
      res.json({
        status: 'fail',
        err: err
      });
    } else {
      
      var i = poll.options.indexOf(req.body.option);
      if(i > -1){
        poll.votes[i]++;
      }
      console.log('new votes',poll.votes);
      poll.markModified('votes');
      poll.save(function(err){
        console.log('save error', err);
        res.json({
          status: 'success',
          poll: poll
        });
      });
    }
  });


});

router.post('/createPoll', function (req, res, next) {
  console.log('createPoll', req.body);
  var votes = req.body.options.map(function(c){
    //TODO: Remove random
    //return 0;
    return Math.floor(Math.random() * 20);
  });
  var poll = new Poll({
    username: req.user.username,
    created_at: new Date(),
    question: req.body.question,
    options: req.body.options,
    votes: votes
  });
  poll.save(function (err) {
    if (err) {
      res.json({
        status: 'fail',
        err: err
      });
    } else {
      console.log(poll);
      res.json({
        status: 'success',
        poll: poll
      });
    }
  });
});

module.exports = router;