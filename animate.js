var data;
request(false);
var _status = ["<b style='color:green;'>UP</b>", "<b style='color:yellow;'>MUMBLE</b>", "<b style='color:orange;'>CORRUPT</b>", "<b style='color:red;'>DOWN</b>", "<b style='color:black;'>ERROR</b>", "<b style='color:black;'>UNKNOWN</b>"];
var refreshTime = 6000; // 60 seconds
var refInterval = window.setInterval('request(true)', refreshTime);
var teams = 21, angle = 0, step = (2*Math.PI) / teams, container_size = 700, radius = 300;
var svg = d3.select('#diagram').append('svg').attr('width', container_size).attr('height', container_size);

// создать подключение
var socket = new WebSocket("ws://localhost:8081");

// обработчик входящих сообщений
socket.onopen = function() {
  $("#battlelog").append("<p style='color:green;'>Connection succesfully established!</p>");
};
socket.onmessage = function(event) {
  var msg = JSON.parse(event.data);
  attack(msg);
};

// обновлялка запросов
function request(type) {
  $.ajax({
    url: "http://localhost:8080/test.json?_=" + new Date().getTime(),
    async: type,
    dataType: 'json',
    success: function(json) {
      data = json;
    }
  })
}
function teamInfo(id) {
  if(id == undefined)
    return;
  var content = "";
  var team = data.Teams.filter(function( obj ) {
    return obj.ID == id;
  })[0];
  content += "<p>Score: " + team.Score + " (" + team.ScorePercent + "%)</p>";
  content += "<p>Attack: " + team.Attack + " (" + team.AttackPercent + "%)</p>";
  content += "<p>Defense: " + team.Defence + " (" + team.DefencePercent + "%)</p>";
  content += "<p>Advisory: " + team.Advisory + " (" + team.AdvisoryPercent + "%)</p>";
  content += "<p align=center>Services:</p>";
  team.Status.forEach(function(item, i, arr) {
    content += "<p>"+ data.Services[i] + ": " + _status[team.Status[i]] + "</p>";
  })
  return content;
}
function initSystem() {
  for(var i = 0; i < teams; i++) {
    var x = container_size/2 + radius * Math.cos(angle);
    var y = container_size/2 + radius * Math.sin(angle);
    angle += step;
    svg.append('rect')
    .attr('id', "team" + data.Teams[i].ID)
    .attr('width', 50)
    .attr('height', 50)
    .attr('fill', '#afc6e8')
    .attr('x', x)
    .attr('y', y)
    .attr('tmp', data.Teams[i].ID)
    .attr('team_id', data.Teams[i].Name); // был #001d38
  }
  svg.append('image')
.attr('xlink:href', "mctf.png")
.attr('width', 400)
.attr('height', 400)
.attr('x', container_size/2 - 180)
.attr('y', container_size/2 - 180)
}

$(document).ready(function()
{
  initSystem();
  /*
  // генератор атак
  setInterval( function() {
    var t1 = getRandomInt(1, teams + 1);
    var t2 = getRandomInt(1, teams + 1);
    attack("team" + t1, "team" + t2, 1);
  } , 1000)
*/
  // MAKE SURE YOUR SELECTOR MATCHES SOMETHING IN YOUR HTML!!!
  $('rect').each(function() {
    $(this).qtip({
      content: {
        text: teamInfo($(this).attr('tmp')),
        title: $(this).attr('team_id')
      },
      position: {
        target: 'mouse', // Track the mouse as the positioning target
        adjust: { x: 5, y: 5 } // Offset it slightly from under the mouse
      },
      style: { classes: 'my-qtip' }
    });
  });
});

setInterval( function() {
  $('rect').each(function() {
      $(this).qtip('option', 'content.text', teamInfo($(this).attr('tmp')));
  });
} , refreshTime/2);
// атака пошла
function attack(msg) {
  var attack = d3.select("#team" + msg.Attacker);
  var victim = d3.select("#team" + msg.Victim);
  var packet = svg.append('rect')
  .attr('width', 20)
  .attr('height', 20)
  .attr('fill', '#ff0000')
  .attr('x', attack.attr('x'))
  .attr('y', attack.attr('y'))
  .attr('text', 'KEK');
  packet.transition()
  .duration(600)
  .attr('x', victim.attr('x'))
  .attr('y', victim.attr('y'))
  .attr('fill', 'green')
  .transition()
  .duration(300)
  .attr('opacity', 0)
  .remove();
  var date = new Date(msg.Timestamp*1000);
  var timestamp = date.getHours() + ':' + ("0" + date.getMinutes()).substr(-2) + ':' + ("0" + date.getSeconds()).substr(-2);
  var logger = $("<p>[" + timestamp + "] <b class='attack'>" + attack.attr('team_id') + "</b> attacked <b class='victim'>" + victim.attr('team_id') + "</b> on service <b class='service'>" + data.Services[msg.Service-1] +"</b></p>").hide();
  if($("#battlelog > p").length > 25)
    $("#battlelog").find('p:first').remove();
  $("#battlelog").append(logger);
  logger.show('normal');
  $('#battlelog').animate({scrollTop: $('#battlelog').prop("scrollHeight")}, 0);
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
