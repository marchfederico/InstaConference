/**
 * ParticipantController
 *
 * @description :: Server-side logic for managing participants
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  call:  function (req, res) {
    var id = req.param('id')
    console.log(id)
    Participant.findOne({id:id})
      .then(function(participant){
        console.log(JSON.stringify(participant,null,2))
        numberToDial = participant.userInfo.telephoneNumber
        Tropo.placeCall(numberToDial,participant.conference,id,function(err,sessionId){
          if (err)
          {
            res.send(500,err)
          }
          else
          {
            console.log("old tropo session:-"+participant.tropoSessionId)
            console.log("new - "+sessionId)
            participant.tropoSessionId = sessionId
            participant.save()
              .then(function(p){
                console.log("after save - "+p.tropoSessionId)
                res.send(200,p)
              })
              .catch(function(err){
                res.send(500,err)
              })

          }
        })


      })
      .catch(function(err){
        console.log('this error')
        res.send(500,err)
      })

  },
  mute:  function (req, res) {
    var id = req.param('id')
    Participant.findOne({id:id})
      .then(function(participant){

        Tropo.mute(participant,function(err,sessionId){
          if (err)
          {
            res.send(500,err)
          }
          else
          {

               console.log(sessionId)
                res.send(200)


          }
        })


      })
      .catch(function(err){
        console.log('this error')
        res.send(500,err)
      })

  },
  unmute:  function (req, res) {
    var id = req.param('id')
    Participant.findOne({id:id})
      .then(function(participant){

        Tropo.unmute(participant,function(err,sessionId){
          if (err)
          {
            res.send(500,err)
          }
          else
          {
            console.log(sessionId)
                res.send(200)

          }
        })


      })
      .catch(function(err){
        console.log('this error')
        res.send(500,err)
      })

  },

  hangup:  function (req, res) {
    var id = req.param('id')
    Participant.findOne({id:id})
      .then(function(participant){

        Tropo.hangup(participant,function(err,sessionId){
          if (err)
          {
            res.send(500,err)
          }
          else
          {
            console.log(sessionId)
            res.send(200)

          }
        })


      })
      .catch(function(err){
        console.log('this error')
        res.send(500,err)
      })

  },
  tropoUpdate: function (req, res) {
    var id;
    var callState;
    var muteState;

    id  = req.param('id');
    callState = req.body.callState;
    muteState = req.body.muteState;

    Participant.findOne({id:id})
      .then(function(participant){
        participant.callState = callState;
        participant.muteState = muteState;
        participant.save()
          .then(function(p){
            res.send(200,p)
          })
          .catch(function(err){
            res.send(500,err)
          })
      })
      .catch(function(err){
        res.send(500,err)
      })

  },

  subscribe: function(req,res){

    var id = req.param('id');

    if (id && req.isSocket){
      Participant.findOne({id:id})
        .then(function(p){
          Participant.subscribe(req.socket,p);
          console.log('subscribed to '+ p.id)
          res.send(200)
        })
        .catch(function(e){
          res.send(500)
        })




    } else if (req.isSocket){

      res.send(404)

    } else {

      res.send(404)

    }
  }
};

