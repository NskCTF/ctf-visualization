var data;
request(false);
var _services = ["Voicemail", "Dr.Dre", "Pokemap", "MIS"];
var _status = ["<b style='color:green;'>UP</b>", "<b style='color:yellow;'>MUMBLE</b>", "<b style='color:orange;'>CORRUPTED</b>", "<b style='color:red;'>DOWN</b>", "<b style='color:black;'>ERROR</b>", "<b style='color:black;'>UNKNOWN</b>"];
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
function head(services) {
    $("#scoreboard").find('thead').empty();
    $("#scoreboard").find('thead')
      .append($('<tr>')
      .append($('<th>')
      .text("#"))
      .append($('<th>')
      .text("Team"))
      .append($('<th>')
      .text("Score"))
      .append($('<th>')
      .text("Attack"))
      .append($('<th>')
      .text("Defense"))
      .append($('<th>')
      .append(services[0]))
      .append($('<th>')
      .append(services[1]))
      .append($('<th>')
      .append(services[2]))
      .append($('<th>')
      .append(services[3]))
    );
};
function render(data) {
  $("#scoreboard").find('tbody').empty();
  data.Teams.forEach(function(team, i, arr) {
    $("#scoreboard").find('tbody')
      .append($('<tr>')
      .append($('<td>')
      .append(team.Rank))
      .append($('<td>')
      .append(team.Name))
      .append($('<td>')
      .append(Number((team.Score).toFixed(1))))
      .append($('<td>')
      .append(Number((team.Attack).toFixed(1))))
      .append($('<td>')
      .append(Number((team.Defence).toFixed(1))))
      .append($('<td>')
      .append(_status[team.Status[0]]))
      .append($('<td>')
      .append(_status[team.Status[1]]))
      .append($('<td>')
      .append(_status[team.Status[2]]))
      .append($('<td>')
      .append(_status[team.Status[3]]))
    );
  });
}
head(data.Services);
render(data);
setInterval(function() {
  request(false);
  render(data);
}, 25000);
