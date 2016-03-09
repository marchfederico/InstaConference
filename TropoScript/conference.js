importPackage(java.net);
importPackage(java.io);
importPackage(java.util);

var CONFERENCE_APP_URL = "http://conference.yourdomain.com"

function post(urlString, body) {
  var url = new URL(urlString);
  log("Opening connection.");
  var connection = url.openConnection();
  connection.setRequestMethod("POST");
  connection.setDoOutput(true);
  connection.setRequestProperty('Content-Type', 'application/json');

  log("Sending output.");
  var output = new DataOutputStream(connection.getOutputStream());
  output.writeBytes(body);
  output.flush();
  output.close();

  var responseCode = connection.getResponseCode();
  log("Response is: " + responseCode);

  var scanner = new Scanner(connection.getInputStream(), "UTF-8").useDelimiter("\\A");
  var result = scanner.next();
  scanner.close();
  return [responseCode, result];
}
function put(urlString, body) {
  var url = new URL(urlString);
  log("Opening connection.");
  var connection = url.openConnection();
  connection.setRequestMethod("PUT");
  connection.setDoOutput(true);
  connection.setRequestProperty('Content-Type', 'application/json');

  log("Sending output.");
  var output = new DataOutputStream(connection.getOutputStream());
  output.writeBytes(body);
  output.flush();
  output.close();

  var responseCode = connection.getResponseCode();
  log("Response is: " + responseCode);

  var scanner = new Scanner(connection.getInputStream(), "UTF-8").useDelimiter("\\A");
  var result = scanner.next();
  scanner.close();
  return [responseCode, result];
}
function get(urlString) {
  var url = new URL(urlString);
  log("Opening connection.");
  var connection = url.openConnection();
  connection.setRequestMethod("GET");
  connection.setDoOutput(true);
  connection.setRequestProperty('Content-Type', 'application/json');

  var responseCode = connection.getResponseCode();
  log("Response is: " + responseCode);

  var scanner = new Scanner(connection.getInputStream(), "UTF-8").useDelimiter("\\A");
  var result = scanner.next();
  scanner.close();
  return [responseCode, result];
}

var update={}
var result={}

if (currentCall === null)
{

  update.callState='Calling...'
  update.muteState='Unmuted'
  put(CONFERENCE_APP_URL+"/participant/"+participantId,JSON.stringify(update))
  call(numberToDial);
  result = ask("press one to join the conference, or press two to hang up",{choices: "1,2", voice: "Ava"})
  if (result.value == 1)
  {
    update={}
    update.callState='Connected'
    update.muteState='Unmuted'
    put(CONFERENCE_APP_URL+"/participant/"+participantId,JSON.stringify(update))
  }
}


function conferenceUnmute()
{
  var signal = false;
  conference(conferenceId, {
    allowSignals: ["mute","hangup"],
    terminator: "*",
    onSignal: function(event) {
      if (event.value == "mute")
        signal = true
    }

  });
  return signal
}

function conferenceMute()
{
  var signal = false;
  conference(conferenceId, {
    allowSignals: ["unmute","hangup"],
    terminator: "*",
    mute: true,
    onSignal: function(event) {
      if (event.value == "unmute")
        signal = true
    }

  });
  return signal
}

if (result.value == 1)
{
  say("Welcome to the conference", {voice: "Ava"})
  var mute = conferenceUnmute()
  var unmute = false

  while (currentCall.isActive)
  {
    if (mute) {
      mute = false
      update={}
      update.callState='Connected'
      update.muteState='Muted'
      put(CONFERENCE_APP_URL+"/participant/"+participantId,JSON.stringify(update))
      say("muted",{voice:"Ava"})
      unmute = conferenceMute()
    }
    else{
      update={}
      update.callState='Disconnecting'
      put(CONFERENCE_APP_URL+"/participant/"+participantId,JSON.stringify(update))
      say("thanks for joining. please comeback again")
      hangup()
      break;
    }
    if (unmute){
      unmute = false
      update={}
      update.callState='Connected'
      update.muteState='Unmuted'
      put(CONFERENCE_APP_URL+"/participant/"+participantId,JSON.stringify(update))
      say("unmuted",{voice:"Ava"})
      mute = conferenceUnmute()
    }
    else {
      update={}
      update.callState='Disconnecting'
      put(CONFERENCE_APP_URL+"/participant/"+participantId,JSON.stringify(update))
      say("thanks for joining. please comeback again", {voice:"Ava"})
      hangup()
      break;
    }


  }
}
update={}
update.callState='Disconnected'
update.muteState='Unmuted'
put(CONFERENCE_APP_URL+"/participant/"+participantId,JSON.stringify(update))
