angular.module('DashboardModule').controller('DashboardController', ['$scope', '$http', 'toastr','$q', function($scope, $http, toastr,$q){

//($item, $model)

  $scope.availablePeople=[];
  $scope.selectedUsers=[];
  $scope.conferenceTitle=''
  $scope.peopleList ={list:[]}
  $scope.model={}
  $scope.person={}

  $scope.removeUser = function($item, $model)
  {

    console.log($model)
    console.log($item)
  }

  $scope.addUser = function($item, $model)
  {
    $scope.selectedUsers.push($item)
  }
  $scope.addPerson = function()
  {
    if ($scope.person.givenName !=null && $scope.person.sn !=null && $scope.person.telephoneNumber !=null ) {
      $scope.selectedUsers.push($scope.person)
      $scope.person = {}
    }
    else
    {
      toastr.error('Invalid input! \nPlease enter a valid First Name, Last Name, and Telephone Number', 'Error', {
        closeButton: true
      });
    }

  }
  $scope.funcAsync = function (query) {

    $http.get('/search?searchString='+query).then(
      function (response) {

          $scope.availablePeople = response.data;

      },
      function () {
        console.log('ERROR searching for: '+query);
      }
    );
  }

  $scope.removeItem = function removeItem(row) {
    var index = $scope.selectedUsers.indexOf(row);
    if (index !== -1) {
      $scope.selectedUsers.splice(index, 1);
    }
  }

   function addParticipant(info) {

      var d = $q.defer();
      $http.post('/participant', info).then(function(response){
        d.resolve(response.data);

      }, function(error){
        d.reject(error)
      });

      return d.promise;
  }

  function createConference(info) {
    var d = $q.defer();
    $http.post('/conference', info).then(function(response){
      d.resolve(response.data);

    }, function(error){
      d.reject(error)
    });

    return d.promise;
  }

  function updateConference(conference,participants) {
    var d = $q.defer();
    idList=[];
    for (i=0;i<participants.length;i++)
      idList.push(participants[i].id)
    var info ={}
    info.participantList = idList
    $http.post('/conference/'+conference.id, info).then(function(response){
      d.resolve(response.data);

    }, function(error){
      d.reject(error)
    });

    return d.promise;

  }

  function updateParticipant(conference,participant) {
    var d = $q.defer();
    var info={}
    info.conference= conference.id
    $http.put('/participant/'+participant.id, info).then(function(response){
      d.resolve(response.data);

    }, function(error){
      d.reject(error)
    });

    return d.promise;

  }
  $scope.addAllParticpants = function()
  {
    var promiseList=[]
    var conf={}
    conf.title = $scope.conferenceTitle
    conf.isStarted = false;
    promiseList.push(createConference(conf))
    for (i=0;i<$scope.selectedUsers.length;i++)
    {
      tempParticipant={}
      tempParticipant.userInfo = $scope.selectedUsers[i]
      tempParticipant.callState='Unknown';
      tempParticipant.muteState='Unknown';
      promiseList.push(addParticipant(tempParticipant))
    }


    $q.all(promiseList).then(function(data) {

      var updateList=[]
      var conference = data.shift()
      var participants = data

      updateList.push(updateConference(conference,participants))
      for (i=0;i<participants.length;i++)
      {
        updateList.push(updateParticipant(conference,participants[i]))
      }
      $q.all(updateList).then(function(data) {
        window.location = '/conference/start/'+data[0].id;
      })

    });

  }


}]);
