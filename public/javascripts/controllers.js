(function () {
  var app = angular.module("votingContollers", []);

  app.controller('ModalDemoCtrl', function ($scope, $uibModal, $log) {

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.animationsEnabled = true;

    $scope.open = function (size) {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };

  });

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $uibModal service used above.

  app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });


  app.controller('PollCtrl', function ($http, ConfigFactory) {

    var that = this;

    this.polls = [];

    this.getPolls = function () {
      $http.get('/api/polls').success(function (data) {
        that.polls = data.polls;
        //TODO: Handle errors
      });
    };
    this.getPolls();

    this.polls = [
      {
        question: 'What color you like?',
        options: [
          'Red',
          'Blue',
          'Green'
        ]
      }
    ];

    this.initPoll = function () {
      this.newPoll = {
        question: '',
        options: []
      };
    }

    this.newPoll = {
      question: 'What color you like?',
      options: [
          'Red',
          'Blue',
          'Green'
        ]
    };

    this.newOption = '';

    this.newPollUrl = '';
    this.msg = '';

    this.addOption = function (option) {
      this.newPoll.options.push(this.newOption);
      this.newOption = '';
    }

    this.newPollCreated = function (poll) {
      this.msg = '';
      console.log('newPollCreated', poll);
      this.newPollUrl = 'poll/' + poll._id;
      this.initPoll();
      //$scope.$apply();
    }

    this.removeOption = function (index) {
      //      console.log('removing', index);
      this.newPoll.options.splice(index, 1);
    }

    this.createPoll = function () {
      this.newPollUrl = '';
      if (this.newPoll.question == '') {
        this.msg = 'Please enter question.';
        return;
      } else if (this.newPoll.options.length < 2) {
        this.msg = 'Add atleast 2 options.';
        return;
      }
      this.msg = 'Saving...';
      console.log('Creating poll', this.newPoll);
      $http.post('/api/createPoll', this.newPoll).success(function (data) {
        console.log(data);
        if (data.status == 'success') {
          that.newPollCreated(data.poll);
          that.getPolls();
        }
      });
    }

    this.deletePoll = function (poll) {
      console.log('deleting poll', poll);
      $http.delete('/api/poll/' + poll._id).success(function (data) {
        console.log(data);
        if (data.status == 'success') {
          that.getPolls();
        }
      });
    }


  });

  app.controller('PollChartCtrl', function ($http, $scope, $location) {
    
    $scope.id = $location.absUrl().split('/').pop();
    console.log();
    
    $scope.question = ''
    $scope.labels = [];
    $scope.data = [];
    
    var setRawData = function(){
      $scope.rawData = $scope.labels.map(function(l, i){
        return {option: l, vote: $scope.data[i]};
      });
    }
    
    $scope.rawData = [];
    
    var getData = function(){
      $http.get('/api/poll/' + $scope.id).success(function (data) {
        console.log(data);
        if (data.status == 'success') {
          $scope.labels = data.poll.options;
          $scope.data = data.poll.votes;
          $scope.question = data.poll.question;
          setRawData();
        }
      });
    };
    
    getData();
    
    $scope.addVote = function(e){
      console.log('addvote', e);
      
      $http.post('/api/addVote', {id: $scope.id, option: e[0].label}).success(function (data) {
        console.log(data);
        if (data.status == 'success') {
          getData();
        }
      });
      
    }
    
    
    
  });

})();