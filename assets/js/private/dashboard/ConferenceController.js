angular.module('ConferenceModule').controller('ConferenceController', ['$scope', '$http', 'toastr','$q','$sails','$window', function($scope, $http, toastr,$q,$sails,$window){


  $scope.conference={};
  $scope.conferenceId =$window.SAILS_LOCALS.conferenceId
  $scope.muteOnButtonClass = "glyphicon glyphicon-volume-off"
  $scope.muteOffButtonClass = "glyphicon glyphicon-volume-up"
  $scope.redButtonClass ="btn btn-sm btn-danger"
  $scope.greenButtonClass ="btn btn-sm btn-success"

  $scope.muteButton={}
  $scope.colorMuteButton={}
  $scope.colorConnectedButton={}
  $scope.colorStartButton=$scope.greenButtonClass
  $scope.startButton="Start Conference"
  $sails.on("connect",function(msg){

    console.log('connected')
    getConferenceInfo($scope.conferenceId).then(function(conference){
      for (i=0;i<conference.participantList.length;i++)
      {
        updateParticipantButtons(conference.participantList[i])
        console.log('subscribing to conference')
        subscribeToParticipant(conference.participantList[i].id)
      }
      $scope.conference = conference;

    })

  })

  $sails.on("participant", function (message) {
    console.log("got a socket.io message")
    console.log(message)

    if (message.verb === "updated") {
      updateParticipantInfo(message)

    }
  });

  function updateParticipantButtons(participant) {

      if (participant.callState == 'Connected') {
        $scope.colorConnectedButton[participant.id] = $scope.greenButtonClass
      }
      else {
        $scope.colorConnectedButton[participant.id] = $scope.redButtonClass
      }

    if (participant.muteState !='Muted') {
      $scope.muteButton[participant.id] = $scope.muteOffButtonClass
      $scope.colorMuteButton[participant.id] = $scope.greenButtonClass
    }
    else
    {
      $scope.muteButton[participant.id] = $scope.muteOnButtonClass
      $scope.colorMuteButton[participant.id] = $scope.redButtonClass
    }


  }

  function updateParticipantInfo(info)
  {
    for(i=0;i<$scope.conference.participantList.length;i++)
    {
      if ($scope.conference.participantList[i].id == info.id)
      {
        var updateItems = info.data
        for (var property in updateItems) {
          if (updateItems.hasOwnProperty(property)) {
            $scope.conference.participantList[i][property] = updateItems[property]
          }
        }
        updateParticipantButtons($scope.conference.participantList[i])
        break
      }

    }
  }




  function getConferenceInfo(id) {
    var d = $q.defer();
    $http.get('/conference/' + $scope.conferenceId).then(function (response) {
      d.resolve(response.data);
    }, function (error) {
      d.reject(error);
    });
    return d.promise;
  }


  function callParticipant(participant)
  {
    var d = $q.defer();

    console.log(participant.id)
    $http.get('/participant/call/' + participant.id).then(function (response) {
      console.log(response.data)
      d.resolve(response.data);
    }, function (error) {
      console.dir(error)
      d.reject(error);
    });
    return d.promise;

  }

  function subscribeToParticipant(id) {
    var d = $q.defer();

    $sails.get("/participant/"+id)
      .then(function(response){
        d.resolve(response.data);

      }, function(error){
        d.reject(error);
      });

    return d.promise;
  }

  function muteParticipant(participant)
  {
    var d = $q.defer();
    $http.get('/participant/mute/' + participant.id).then(function (response) {
      console.log(response.data)
      d.resolve(response.data);
    }, function (error) {
      console.dir(error)
      d.reject(error);
    });
    return d.promise;

  }

  function unmuteParticipant(participant)
  {
    var d = $q.defer();
    $http.get('/participant/unmute/' + participant.id).then(function (response) {
      console.log(response.data)
      d.resolve(response.data);
    }, function (error) {
      console.dir(error)
      d.reject(error);
    });
    return d.promise;

  }

  function hangupParticipant(participant)
  {
    console.log("hangupParticipant")

    var d = $q.defer();
    $http.get('/participant/hangup/' + participant.id).then(function (response) {
      console.log(response.data)
      d.resolve(response.data);
    }, function (error) {
      console.dir(error)
      d.reject(error);
    });
    return d.promise;

  }
  function updateConference()
  {
    var d = $q.defer();
    $http.put('/conference/' + $scope.conference.id,$scope.conference).then(function (response) {
      console.log("updated -")
      console.log(response.data)
      console.log("updated -")
      d.resolve(response.data);
    }, function (error) {
      console.dir(error)
      d.reject(error);
    });
    return d.promise;
  }

  $scope.startConference = function()
  {

    if ($scope.startButton == "End Conference")
        $scope.endConference()
    else {
      $scope.startButton = "End Conference"
      $scope.colorStartButton = $scope.redButtonClass
      promiseList = [];
      for (i = 0; i < $scope.conference.participantList.length; i++) {
        promiseList.push(callParticipant($scope.conference.participantList[i]))
      }

      $q.all(promiseList).then(function (data) {
        console.dir(data)
        console.log('conference started')

      });
    }


  }

  $scope.endConference = function()
  {

    $scope.startButton = "Start Conference"
    $scope.colorStartButton = $scope.greenButtonClass
    promiseList=[];
    for (i = 0; i < $scope.conference.participantList.length; i++) {
      promiseList.push(hangupParticipant($scope.conference.participantList[i]))
    }

    $q.all(promiseList).then(function(data) {
      console.dir(data)
      console.log('conference ended')

    });


  }

  $scope.callOrHangup = function(participantId) {

    for (i=0; i<$scope.conference.participantList.length; i++)
    {
      if(participantId ==$scope.conference.participantList[i].id )
      {
        if ($scope.conference.participantList[i].callState == 'Connected')
        {
          hangupParticipant($scope.conference.participantList[i]).then(function(msg){
            console.log(msg)
          })
        }
        else if ($scope.conference.participantList[i].callState == 'Disconnected')
        {
          callParticipant($scope.conference.participantList[i]).then(function(msg){
            console.log(msg)
          })
        }
      }
        break;
      }
  }
  $scope.hangup = function(participantId) {
    console.log("hangupParticipant:"+participantId)
    for (i=0; i<$scope.conference.participantList.length; i++)
    {
      if(participantId ==$scope.conference.participantList[i].id )
      {
        if ($scope.conference.participantList[i].callState == 'Connected')
        {
          hangupParticipant($scope.conference.participantList[i]).then(function(msg){
            console.log(msg)
          })
        }
        break;
      }

    }
  }

  $scope.toggleMute = function(participantId) {
    for (i=0; i<$scope.conference.participantList.length; i++)
    {
      if(participantId ==$scope.conference.participantList[i].id )
      {
        if ($scope.conference.participantList[i].muteState == 'Muted')
        {
          unmuteParticipant($scope.conference.participantList[i]).then(function(msg){
            console.log(msg)
          })
        }
        else
        {
          muteParticipant($scope.conference.participantList[i]).then(function(msg){
            console.log(msg)
          })
        }
      break;
      }

    }
  }


}]);

/*
angular.module('ConferenceModule').directive('contenteditable', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      // view -> model
      elm.bind('blur', function() {
        scope.$apply(function() {
          ctrl.$setViewValue(elm.html());
        });
      });

      // model -> view
      ctrl.render = function(value) {
        elm.html(value);
      };

      elm.bind('keydown', function(event) {
        console.log("keydown " + event.which);
        var esc = event.which == 27,
          el = event.target;

        if (esc) {
          console.log("esc");
          ctrl.$setViewValue(elm.html());
          el.blur();
          event.preventDefault();
        }

      });

    }
  };
});
*/
