
var request = require('request')

TROPOAPIKEY = sails.config.instaconference.TROPO_API_KEY;

module.exports = {

  placeCall: function(phoneNumber,conferenceId,participantId, callback) {
    var param={}
    param.action ='create'
    param.token = TROPOAPIKEY
    param.numberToDial=phoneNumber
    param.conferenceId = conferenceId
    param.participantId = participantId
    console.log("placing call - "+conferenceId)
    request.get("https://api.tropo.com/1.0/sessions",{qs:param},function(error,response,body){

      if (!error && response.statusCode == 200) {
        var sessionIdMatch = /^<session><success>true<\/success>.*<id>(.*)<\/id>.*/
        console.log(body)
        m = body.match(sessionIdMatch)

        if (m[1]) {
          sessionId = m[1]
          callback(null,sessionId)
        }
        else
        {

          callback({error:'Invalid session Id'},null)
        }

      }
      else
      {
       if (error) {
         callback(error, null)
       }
       else {
         callback({error: response.statusCode}, null)
       }

      }

    })

  },
  mute: function(participant, callback) {
      var param = {}
      param.action = 'signal'
      param.value = 'mute'
      console.dir(param)
      console.log("mute tropo session id:"+participant.tropoSessionId)
      request.get("https://api.tropo.com/1.0/sessions/"+participant.tropoSessionId+"/signals", {qs: param}, function (error, response, body) {

        if (!error && response.statusCode == 200) {
          console.log(body)
            callback(null, 'OK')
            return

        }
        else {
          if (error) {
            callback(error, null)
          }
          else {
            console.log(response.statusCode)
            callback({error: response.statusCode}, null)
          }

        }

      })
    },
  unmute: function(participant, callback) {
    var param = {}
    param.action = 'signal'
    param.value = 'unmute'
    console.dir(param)
    console.log("unmute tropo session id:"+participant.tropoSessionId)
    request.get("https://api.tropo.com/1.0/sessions/"+participant.tropoSessionId+"/signals", {qs: param}, function (error, response, body) {

      if (!error && response.statusCode == 200) {
        console.log(body)
        callback(null, 'OK')
        return

      }
      else {
        if (error) {
          callback(error, null)
        }
        else {
          console.log(response.statusCode)
          callback({error: response.statusCode}, null)
        }

      }

    })
  },
  hangup: function(participant, callback) {
    var param = {}
    param.action = 'signal'
    param.value = 'hangup'
    console.dir(param)
    console.log("hangup tropo session id:"+participant.tropoSessionId)
    request.get("https://api.tropo.com/1.0/sessions/"+participant.tropoSessionId+"/signals", {qs: param}, function (error, response, body) {

      if (!error && response.statusCode == 200) {
        console.log(body)
        callback(null, 'OK')
        return

      }
      else {
        if (error) {
          callback(error, null)
        }
        else {
          console.log(response.statusCode)
          callback({error: response.statusCode}, null)
        }

      }

    })
  }
};
