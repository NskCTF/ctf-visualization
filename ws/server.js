var WebSocketServer = new require('ws');

// ������������ �������
var clients = {};

// WebSocket-������ �� ����� 8081
var webSocketServer = new WebSocketServer.Server({
  port: 8081
});
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
 var teams = 21;
 var services = 4;
  setInterval(function() {
	  var attack = getRandomInt(1, teams);
	  var victim = getRandomInt(1, teams);
	  var service = getRandomInt(1, services);
	  var time = Date.now() / 1000 | 0;
	  for(var key in clients) {
		  clients[key].send('{"Attacker":'+ attack +',"Victim":'+ victim + ',"Service":' + service +',"Timestamp":'+ time + '}');
	  }
  }, 300); 
webSocketServer.on('connection', function(ws) {

  var id = Math.random();
  clients[id] = ws;
  console.log("Opened " + id);
  ws.on('message', function(message) {
    console.log('Received ' + message);

    for (var key in clients) {
      clients[key].send(message);
    }
  });

  ws.on('close', function() {
    console.log('Closed ' + id);
    delete clients[id];
  });

});