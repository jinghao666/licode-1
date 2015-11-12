var serverUrl = "/";
var localStream, room, recording, recordingId, globalToken;

function createUnicRoom(){
  var roomName = document.getElementById('NewRoomName');

}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function testConnection () {
  window.location = "/connection_test.html";
}

function startRecording () {
  if (room !== undefined){
    if (!recording){
  recordButton.innerHTML = 'Stop Recording';
      room.startRecording(localStream, function(id) {
        recording = true;
        recordingId = id;
      });
      
    } else {
  recordButton.innerHTML = 'Start Recording';
      room.stopRecording(recordingId);
      recording = false;
    }
  }
}

window.onbeforeunload = function (evt) {
  console.log('stopping video recording');
  room.stopRecording(recordingId);
  return "Если вы закончили, можете закрывать.";
}

var roomName;

window.onload = function () {
    console.log('onload event');
    roomName = window.location.search.replace("?", "");
    console.log(roomName);
};

function start_video(){
  console.log('starting video');
  recording = false;
  var screen = getParameterByName("screen");
  var config = {audio: true, video: true, data: true, screen: screen, videoSize: [640, 480, 640, 480]};
  // If we want screen sharing we have to put our Chrome extension id. The default one only works in our Lynckia test servers.
  // If we are not using chrome, the creation of the stream will fail regardless.
  if (screen){
    config.extensionId = "okeephmleflklcdebijnponpabbmmgeo";
  }
  localStream = Erizo.Stream(config);
  var createToken = function(userName, role, callback) {

    var req = new XMLHttpRequest();
    var url = serverUrl + 'createToken/';
    var roomName = window.location.search.replace("?", "");
    var body = {username: userName, role: role, roomName: roomName};

    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        callback(req.responseText);
      }
    };

    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(body));
  };

  createToken("user", "presenter", function (response) {
    var token = response;
    globalToken = token;
    room = Erizo.Room({token: token});
    room.name = 'dasm1';
    localStream.addEventListener("access-accepted", function () {
      var subscribeToStreams = function (streams) {
        for (var index in streams) {
          var stream = streams[index];
          if (localStream.getID() !== stream.getID()) {
            room.subscribe(stream);
            stream.addEventListener("bandwidth-alert", function (evt){
                console.log("Bandwidth Alert", evt.msg, evt.bandwidth);
            });
            

          }
        }
      };

      room.addEventListener("room-connected", function (roomEvent) {

        room.publish(localStream, {maxVideoBW: 3000, minVideoBW:500});
        subscribeToStreams(roomEvent.streams);
      });

      room.addEventListener("stream-subscribed", function(streamEvent) {
        var stream = streamEvent.stream;
        var div = document.createElement('div');
        div.setAttribute("style", "width: 320px; height: 240px;");
        div.setAttribute("id", "test" + stream.getID());

        document.body.appendChild(div);
        stream.show("test" + stream.getID());

      });

      room.addEventListener("stream-added", function (streamEvent) {
        var streams = [];
        streams.push(streamEvent.stream);
        subscribeToStreams(streams);
        document.getElementById("recordButton").disabled = false;
        console.log('try 2 start recording');
        startRecording();
      });

      room.addEventListener("stream-removed", function (streamEvent) {
        // Remove stream from DOM
        var stream = streamEvent.stream;
        if (stream.elementID !== undefined) {
          var element = document.getElementById(stream.elementID);
          document.body.removeChild(element);
        }
      });
      
      room.addEventListener("stream-failed", function (streamEvent){
          console.log(room);
          console.log("STREAM FAILED, DISCONNECTION");
          room.disconnect();

      });

      room.connect();

      localStream.show("myVideo");

    });
    localStream.init();
  });


  

}