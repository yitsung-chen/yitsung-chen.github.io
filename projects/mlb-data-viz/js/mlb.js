var seasonStatsArray = [];
var seasonStatsClean = [];
var playerId;
var currentSeason;
var barsIndexClicked = "default";
var linePreMax;
var lineLegPos = [];
var lineLegNew = [];
var resetTimer = 0;


// Init page loading
pageLoader();

// Search Command
document.getElementById("search-bar").addEventListener("keyup", function(event){

  // Conduct search command
  if (event.key === "Enter"){
    search();
  }

  // Show or hide the search icon
  if(document.getElementById('search-bar').value !== ""){
    if (document.getElementById("search-icon").style.opacity !== "1") {
    fadeIn(document.getElementById("search-icon"), "inline-block", 5);
    }
  }else{
    fadeOut(document.getElementById("search-icon"), 5);
  }

});

// Search Command on user click the search icon
document.getElementById("search-icon").addEventListener("click", function(){
  search();
});

// Toggle function: Determine which type of player to search: active or inactive (death or retire)
document.getElementById("toggle").addEventListener("click", function(){

  var text = document.getElementsByClassName("toggle-label")[0];

  if (document.getElementById('toggle').checked) {
    text.innerHTML = "Active player";
  }else{
    text.innerHTML = "Inactive player";
  }
});

//Return button Function
document.getElementById("return-btn").addEventListener("click", function(){

  var searchPane = document.getElementById("search-pane");

  document.getElementById('search-bar').value="";
  seasonDataStopper = false;

  resetContent();
  // fadeIn(searchPane, "block", 17);

  // Prevent too many cache files with potentiality of generating undesirable bugs

  resetTimer++;

  if (resetTimer > 6) {
    location.reload();
  }else{
    fadeIn(searchPane, "block", 17);
  }

});

// Close error msg
document.getElementById("error-close-btn").addEventListener("click", function(){

  var errorWindow = document.getElementById("error-msg");
  var searchPane = document.getElementById("search-pane");
  var returnBtn = document.getElementById("return-btn");

  fadeOut(errorWindow, 20);
  fadeIn(searchPane, "block", 17);
  fadeOut(returnBtn, 17);
});
document.getElementById("system-error-close-btn").addEventListener("click", function(){

  var errorWindow = document.getElementById("system-error-msg");
  var searchPane = document.getElementById("search-pane");
  var returnBtn = document.getElementById("return-btn");

  fadeOut(errorWindow, 20);
  fadeIn(searchPane, "block", 17);
  fadeOut(returnBtn, 17);

});

// Close glossary window
document.getElementById("glossary-close-btn").addEventListener("click", function(){
  var glossary = document.getElementById("glossary");
  var dashHeader = document.getElementById("dash-header");
  var position = document.querySelectorAll(".grid-item")[0].innerText.slice(-1,);
  var pitcherMetrics = document.getElementById("pitcher-metrics");
  var batterMetrics = document.getElementById("batter-metrics");
  var blocker = document.getElementById("blocker");

  blocker.parentNode.removeChild(blocker);

  if (position === "P") {
    fadeOut(pitcherMetrics,17);
  }else{
    fadeOut(batterMetrics,17);
  }

  fadeOut(glossary, 17);
  dashHeader.style.opacity = "1";
});

// Dashboard button event
document.getElementById("dash-btn").addEventListener("click", function(){
  var dash = document.getElementById("dashboard-container");
  var returnBtn = document.getElementById("return-btn");
  var returnTxt = document.getElementById("return-text");

  // Show the dashboard layout
  if (dash.style.display === "grid") {
    scrollDown("dashboard-container",16);
    return;
  }else{
    fadeOut(returnBtn,14);
    fadeOut(returnTxt, 14);
    fadeIn(dash, "grid", 16);
    scrollDown("dashboard-container",16);

    // Let the container to display first before parsing and drawing <svg> to the <div> container,
    // which will result an error.

    setTimeout(function(){
      seasonStats(playerId, currentSeason);
    },450);

  }

});

// Glossary button event
document.getElementById("glossary-btn").addEventListener("click", function(){
  var glossary = document.getElementById("glossary");
  var glossaryContent = document.getElementById("glossary-content");
  var dashHeader = document.getElementById("dash-header");
  var position = document.querySelectorAll(".grid-item")[0].innerText.slice(-1,);
  var pitcherMetrics = document.getElementById("pitcher-metrics");
  var batterMetrics = document.getElementById("batter-metrics");
  var blocker = document.createElement("div");

  blocker.setAttribute("id", "blocker");
  document.body.appendChild(blocker);


  if (glossary.style.display === "inline-block") {
    return;
  }else{
    fadeIn(glossary, "inline-block", 14);
    setTimeout(function(){
      glossaryContent.scrollTo(0,0);
    },14);
  }

  if (position === "P") {
    fadeIn(pitcherMetrics,"inline-block",14);
  }else{
    fadeIn(batterMetrics,"inline-block",14);
  }

  setTimeout(function(){
    dashHeader.style.opacity = "0.3";
  },30);

});


//Search Command
function search(){
  var preloader = document.getElementById("preloader");
  var searchPane = document.getElementById("search-pane");
  var returnBtn = document.getElementById("return-btn");
  var searchBtn = document.getElementById("search-icon");
  var dashHeaderContainer = document.getElementById("dash-header");
  var status = "'" + "Y" + "'";
  var queryName = "";

  // If query text is not empty, then search...
  if (document.getElementById('search-bar').value !== "") {

    queryName = document.getElementById('search-bar').value;

    // Check player status: active or inactive
    // (This variable will pass along to later functions to decide which pool the query data should be got from:
    //  active players pool, or inactive player pool)
    if (document.getElementById('toggle').checked) {
      status = "'" + "Y" + "'";
    }else{
      status = "'" + "N" + "'";
    }

    // Hide the search interface
    fadeOut(searchPane, 17);

    // Show the preloader
    // ...Later will be hidden once contents are loaded
    fadeIn(preloader, "block", 19);

    // "Get" request sending to MLB api
    playerIdParse(preloader, queryName, status);
  }
}

// Request for player id
function playerIdParse(preloader, q, status) {
  var XHR = new XMLHttpRequest();

  XHR.onreadystatechange = function(){
      if(XHR.readyState == 4 && XHR.status == 200){
        var playerData = JSON.parse(XHR.responseText).search_player_all.queryResults.row;
        // If no matched id, then show erro window,
        // and break the function
        if (playerData === undefined) {
          fadeOut(preloader, 17);
          document.querySelector(".query-result").innerHTML = "<b><i>"+ q +"</i></b>";
          fadeIn(document.getElementById("error-msg"), "inline-block", 20);
          resetContent();
          return;
        }else{
          if (playerData.length > 1) {
            // if queried name matched more than 1 id,
            // then return the first returned id
            playerId = playerData[0].player_id;

          }else{

            playerId = playerData.player_id;

          }

          // Once get the player id, using the id and request the api again to retrieve other player info,
          // such as tall, weight, played position, team...etc
          playerInfoParse(playerId, status, preloader, q);

        }
      }else if (XHR.status == 500) {

        // If the query time is too long and server side throws an error in the console (status === 500),
        // then open up system error window, asking the user to refresh or type in different name combination later.

        fadeOut(preloader, 17);
        document.querySelector(".system-error-name").innerHTML = "<b><i>"+ q+"'s" +"</i></b>";
        fadeIn(document.getElementById("system-error-msg"), "inline-block", 20);
        resetContent();
        return;
      }
  }

  XHR.open("GET", "https://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'&active_sw=" + status + "&name_part='" + q + "%25'&search_player_all.col_in=player_id");
  XHR.send();

}

// Request for general player info
function playerInfoParse(playerId, status, preloader, q) {

  var XHR = new XMLHttpRequest();
  var playerInfoData;

  // Initiate html tags represent metrics to display on the page,
  // batters or pitchers respectively.
  var batterMetrics = [
    "<th>H</th>",
    "<th>1B</th>",
    "<th>2B</th>",
    "<th>3B</th>",
    "<th>HR</th>",
    "<th>RBI</th>",
    "<th>SB</th>",
    "<th>K</th>",
    "<th>AVG</th>",
    "<th>SLG</th>",
    "<th>OBP</th>",
    "<th>OPS</th>"
  ];
  var pitcherMetrics = [
    "<th>W</th>",
    "<th>SV</th>",
    "<th>HLD</th>",
    "<th>SO</th>",
    "<th>AO</th>",
    "<th>GO</th>",
    "<th>BB</th>",
    "<th>K%</th>",
    "<th>ERA</th>",
    "<th>WHIP</th>",
    "<th>WPCT</th>"
  ];
  var metricsTable = document.getElementById("metrics-title");

  // initiate a variable to store player's career performance for the given metrics,
  // passing the variable along with other necessary variables into careerStats(...) function.
  // (var stats won't be declared until the variable is passed into the careerStats(...) function and declared in the function.)
  var stats;

  XHR.onreadystatechange = function(){
    if(XHR.readyState == 4 && XHR.status == 200){
      playerInfoData = JSON.parse(XHR.responseText).player_info.queryResults.row;

      // If the debut record is empty return error
      if (playerInfoData.pro_debut_date === "" || playerInfoData === undefined) {

        fadeOut(preloader, 17);
        document.querySelector(".query-result").innerHTML = "<b><i>"+ q +"</i></b>";
        fadeIn(document.getElementById("error-msg"), "inline-block", 20);
        resetContent();
        return;

      }else{
        // Set Season year for team info query
        if (status === "'Y'" && playerInfoData.end_date === "") {
          currentSeason = new Date().getFullYear();
        }else {
          currentSeason = Number(playerInfoData.end_date.slice(0,4));
        }

        // Set metrics header
        if (playerInfoData.primary_position_txt !== "P") {
          metricsTable.innerHTML = batterMetrics.join("");
        }else{
          metricsTable.innerHTML = pitcherMetrics.join("");
        }

        // using required variables to pass in the following function to get:
        // 1. Career metrics performance.
        // 2. Most up to date MLB team that the player joined.
        // (Requesting data from MLB API twice in a row)
        careerStats(playerId, playerInfoData, stats);
        playerTeamParse(playerId, playerInfoData, currentSeason, preloader);
      }
    }
  }

  XHR.open("GET", "https://lookup-service-prod.mlb.com/json/named.player_info.bam?sport_code='mlb'&player_id='" + playerId + "'&player_info.col_in=primary_position_txt&player_info.col_in=bats&player_info.col_in=throws&player_info.col_in=age&player_info.col_in=height_feet&player_info.col_in=height_inches&player_info.col_in=weight&player_info.col_in=pro_debut_date&player_info.col_in=name_display_first_last&player_info.col_in=jersey_number&player_info.col_in=end_date&player_info.col_in=birth_date&player_info.col_in=death_date");

  XHR.send();
}

// Request for player team info
function playerTeamParse(playerId, playerInfoData, currentSeason, preloader) {

  var XHR = new XMLHttpRequest();
  var teamInfoData;

  XHR.onreadystatechange = function(){
      if(XHR.readyState == 4 && XHR.status == 200){

        teamInfoData = JSON.parse(XHR.responseText).player_teams.queryResults.row;

        // if the player team data is not available for the given season,
        // search the previous season until the data is available.
        // (Through recursive functioning)

        if (teamInfoData === undefined) {
          currentSeason--;
          playerTeamParse(playerId, playerInfoData, currentSeason, preloader);
          return

        }else{

          // If the player team data per queried season shows more than 1 team played,
          // initiating a variable index served to return the index of the team data array

          if (teamInfoData.length > 1) {
            var continueLoop = true;
            var index = 0;

            teamInfoData = JSON.parse(XHR.responseText).player_teams.queryResults.row[index];

            while (continueLoop) {
              // Check if the team and league belonged to MLB
              if (teamInfoData.sport_code.toLowerCase() !== "mlb") {

                index++;
                teamInfoData = JSON.parse(XHR.responseText).player_teams.queryResults.row[index];
                // If checked through all the returned data and no matched,
                // then break the loop

                if (teamInfoData === undefined) {

                  currentSeason--;
                  playerTeamParse(playerId, playerInfoData, currentSeason, preloader);
                  continueLoop = false;
                  return

                }
              }else{
                // if then looping through the team data which is belonged to MLB league,
                // break the loop
                continueLoop = false;
              }
            }
          }else if (teamInfoData.sport_code.toLowerCase() !== "mlb") {

            // Same operation as per the above code chunk in the while loop,
            // if the data returned is not belonged to MLB league, then rerun the function again with queried season minus 1,
            // and break the function until the team data is belonged to MLB league

            currentSeason--;
            playerTeamParse(playerId, playerInfoData, currentSeason, preloader);
            return

          }else{
            // After cleaned up the returned data, storing the data in the variable teamInfoData

            teamInfoData = JSON.parse(XHR.responseText).player_teams.queryResults.row;
          }

          playerInfoInsert(teamInfoData, playerInfoData);
          InfoDisplay(playerId, playerInfoData, preloader);

        }
      }
  }

  XHR.open("GET", "https://lookup-service-prod.mlb.com/json/named.player_teams.bam?season='" + String(currentSeason) + "'&player_id='" + playerId + "'"+"&player_teams.col_in=league&player_teams.col_in=team_abbrev&player_teams.col_in=sport_code");

  XHR.send();
}

// Attach player info into DOM
function playerInfoInsert(teamInfoData, playerInfoData){

  var actualAge = playerAgeCalculator(playerInfoData);
  var infoContainer = document.getElementsByClassName("grid-item");
  var playerInfoDetail = [
    "Position : " + playerInfoData.primary_position_txt.bold(),
    "B / T : " + playerInfoData.bats.bold() + " / " + playerInfoData.throws.bold(),
    "Age : " + actualAge,
    "Height / Weight : " + playerInfoData.height_feet.bold() + "'" + playerInfoData.height_inches.bold() + " / " + playerInfoData.weight.bold() + " lbs",
    "Debut : " + playerInfoData.pro_debut_date.slice(0,10).bold(),
    "League : " + teamInfoData.league.bold(),
    "Team : " + teamInfoData.team_abbrev.bold()
  ];

  var playerName = document.getElementById("player-info").querySelector("h1");

  playerName.classList.add("player-name");


  if (playerInfoData.jersey_number === "" || isNaN(Number(playerInfoData.jersey_number))) {
    document.getElementsByClassName("player-name")[0].innerHTML = playerInfoData.name_display_first_last;
  }else{
    document.getElementsByClassName("player-name")[0].innerHTML = playerInfoData.name_display_first_last + "&nbsp;&nbsp;#<span>"+ playerInfoData.jersey_number +"</span>";
  }

  for (let i = 0; i < infoContainer.length; i++) {
   infoContainer[i].innerHTML = playerInfoDetail[i];
  }
}

// Request Career Stats Data
function careerStats(playerId, playerInfoData, stats){

  var XHR = new XMLHttpRequest();
  var table = document.getElementById("stats-container");
  var btns = document.getElementById("btn-group");
  var statsTitle = document.querySelector(".stats-header");
  var statsSubTitle = document.querySelector(".stats-sub-header");
  var statsEle = document.getElementById("regular");
  var seasonAvgEle = document.getElementById("s-avg");
  var monthAvgEle = document.getElementById("m-avg");
  var weekAvgEle = document.getElementById("w-avg");
  var url;
  var cols;

  if (playerInfoData.primary_position_txt !== "P") {
    url = "sport_career_hitting";
    cols = "&" + url + ".col_in=h&" + url + ".col_in=hr&" + url + ".col_in=rbi&" + url + ".col_in=sb&" + url + ".col_in=g&" + url + ".col_in=so&" + url + ".col_in=avg&" + url + ".col_in=slg&" + url + ".col_in=obp&" + url + ".col_in=xbh&" + url + ".col_in=tb";
  }else{
    url = "sport_career_pitching";
    cols = "&" + url + ".col_in=w&" + url + ".col_in=sv&" + url + ".col_in=hld&" + url + ".col_in=so&" + url + ".col_in=bb&" + url + ".col_in=era&" + url + ".col_in=whip&" + url + ".col_in=wpct&" + url + ".col_in=qs&" + url + ".col_in=g&" + url + ".col_in=gs&" + url + ".col_in=l&" + url + ".col_in=ao&" + url + ".col_in=go&" + url + ".col_in=tbf";
  }


    XHR.onreadystatechange = function(){
        if(XHR.readyState == 4 && XHR.status == 200){
          stats = JSON.parse(XHR.responseText)[String(url)].queryResults.row;

          // set k% metrics for pitcher
          stats["kpct"] = Math.round(Number(stats.so)/Number(stats.tbf)*1000)/1000;

          //Parse in the career stats data
          careerStatsParse(playerInfoData, statsEle, seasonAvgEle, monthAvgEle, weekAvgEle, stats);

          // When all info are filled in then show the table
          setTimeout(function(){
            fadeIn(statsTitle,"block",16);
            fadeIn(statsSubTitle,"block",16);
            fadeIn(table,"grid",16);
            fadeIn(btns,"grid",16);
          },60);
        }
    }

  XHR.open("GET", "https://lookup-service-prod.mlb.com/json/named."+ url +".bam?league_list_id='mlb'&game_type='R'&player_id='" + playerId + "'"+cols);
  XHR.send();
}

// Request Season Stats Data
function seasonStats(playerId, currentSeason){

  var xhr = new XMLHttpRequest();
  var url;
  var cols;
  var season;
  var position = document.querySelectorAll(".grid-item")[0].innerText.slice(-1,);
  var debut = document.querySelectorAll(".grid-item")[4].innerText.slice(8,12);
  var dashPreloader = document.getElementById("dash-preloader");
  var bar = document.getElementById("bar-chart");
  var donut = document.getElementById("donut-chart");
  var line = document.getElementById("line-chart");

  // If it's active player, set the projected stats as the current season stats
  // and past 5 seasons stats were using historical stats.

  // if (currentSeason === new Date().getFullYear()) {
  //   currentSeason--;
  //   season = currentSeason;
  // }else{
  //   season = currentSeason;
  // }

  season = currentSeason;

  // Check player position to determine the requested api type

  if (position !== "P") {
    url = "sport_hitting_tm";
    cols = "&" + url + ".col_in=h&" + url + ".col_in=so&" + url + ".col_in=hr&" + url + ".col_in=rbi&" + url + ".col_in=sb&" + url + ".col_in=g&" + url + ".col_in=so&" + url + ".col_in=avg&" + url + ".col_in=ops&" + url +".col_in=slg&" + url + ".col_in=obp&" + url + ".col_in=xbh&" + url + ".col_in=tb&" + url + ".col_in=season&" + url + ".col_in=team_abbrev&" + url + ".col_in=ab&" + url + ".col_in=hbp&" + url + ".col_in=sf&" + url + ".col_in=go&" + url + ".col_in=ao&" + url + ".col_in=bb";
  }else{
    url = "sport_pitching_tm";
    cols = "&" + url + ".col_in=w&" + url + ".col_in=sv&" + url + ".col_in=hld&" + url + ".col_in=so&" + url + ".col_in=bb&" + url + ".col_in=era&" + url + ".col_in=whip&" + url + ".col_in=qs&" + url + ".col_in=g&" + url + ".col_in=gs&" + url + ".col_in=l&" + url + ".col_in=season&" + url + ".col_in=team_abbrev&" + url + ".col_in=go&" + url + ".col_in=ao&" + url + ".col_in=h&" + url + ".col_in=ip&" + url + ".col_in=er&" + url + ".col_in=tbf";
  }

  xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        var seasonData = JSON.parse(xhr.responseText)[url].queryResults.row;

        var kpi = "default";
        // If the player had no stats in the given season, check the followings...
        if (seasonData === undefined) {
          if (season <= Number(debut)) {
            // If the given season's earlier than the player's debut season, break the function
            return
          }else{
            // If not, then reduce the searched season by 1 and recurse the function
            currentSeason--;
            seasonStats(playerId, currentSeason);
            return
          }
        // If there's stats in the sesearched season, then check the following conditions
        }else{
          // If the given season's earlier than the player's debut season, break the function
          if (season <= Number(debut)) {
            seasonStatsParse(season, position, seasonData);
            fadeOut(dashPreloader,13);
            dashboardBuilder(kpi);
            setTimeout(function(){
              fadeIn(bar, "",15);
              fadeIn(donut, "",15);
              fadeIn(line, "",15);
            }, 100);
            return

          }else{

            seasonStatsParse(season, position, seasonData);

            if (seasonStatsArray.length === 5) {
              fadeOut(dashPreloader,13);
              dashboardBuilder(kpi);
              setTimeout(function(){
                fadeIn(bar, "",15);
                fadeIn(donut, "",15);
                fadeIn(line, "",15);
              }, 100);
              return
            }

            currentSeason--;
            seasonStats(playerId, currentSeason);
            return
          }
        }
      }
  }

  xhr.open("GET","https://lookup-service-prod.mlb.com/json/named."+ url +".bam?league_list_id='mlb'&game_type='R'&season='"+ String(season) +"'&player_id='"+ playerId +"'" + cols);
  xhr.send();
}

// Display player info, including player image
function InfoDisplay(playerId, playerInfoData, preloader){

  var dashHeaderContainer = document.getElementById("dash-header");
  var playerImg = new Image();
  // var playerImgUrl = "https://securea.mlb.com/mlb/images/players/head_shot/" + playerId + ".jpg";
  var pitcherUrl = "https://getdrawings.com/img/baseball-player-silhouette-vector-24.jpg";
  var batterUrl = "https://getdrawings.com/img/baseball-player-silhouette-vector-4.jpg";
  var img = document.getElementById("player-pic");
  var returnBtn = document.getElementById("return-btn");
  var weekAvgEle = document.getElementById("w-avg");

  // playerImg.onload = function(){
  //   displayInfo()
  //   img.src = this.src;
  // }
  //
  // playerImg.onerror = function(){
  playerImg.onload = function(){
    displayInfo()
    img.src = this.src;
  }

  if (playerInfoData.primary_position_txt === "P") {
    playerImg.src = pitcherUrl;
  }else{
    playerImg.src = batterUrl;
  }
  // }


  // if (playerInfoData.primary_position_txt === "P") {
  //   console.log("yes");
  //   img.src = pitcherUrl;
  // }else{
  //   img.src = batterUrl;
  // }
  //
  // displayInfo();

  function displayInfo(){

    fadeOut(preloader, 50);

    setTimeout(function(){
      fadeIn(dashHeaderContainer, "block", 17);
      fadeIn(returnBtn, "inline-block", 17);
      window.scrollTo(0,0);
    }, 180);
  }
}

// Smooth Scroll Function
function scrollDown(id, speed){

  var pos = window.pageYOffset;
  var stop = "";
  var scroll = window.setInterval(function() {

    if ( document.getElementById(id).offsetTop > pos) {
        window.scrollTo( 0, pos += document.getElementById(id).offsetTop/speed); // how far to scroll on each step
    }else{
        window.clearInterval(scroll);
        stop = "yes";
    }
  }, speed);
}

// fadeIn animation
function fadeIn(ele, displayType = "", speed){

  // Init DOM Opacity
  ele.style.opacity = 0;
  var incrementOp = 0;

  // If declared display property then opacity been animated.
  // After the animation, the display property will then be changed.
  if (displayType === "") {
    var animation = window.setInterval(function(){
      if (Number(ele.style.opacity) < 1) {
        incrementOp += 1/speed;
        ele.style.opacity = incrementOp;
      }else{
        ele.style.opacity = 1;
        window.clearInterval(animation);
      }
    }, speed);
  }else{
    // Only opacity is been animated
    var animation = window.setInterval(function(){
      if (Number(ele.style.opacity) < 1) {
        incrementOp += 1/speed;
        ele.style.opacity = incrementOp;
        ele.style.display = displayType;
      }else{
        ele.style.opacity = 1;
        window.clearInterval(animation);
      }
    }, speed);
  }
}

// fadeOut animation
function fadeOut(ele, speed, displayType = ""){
  // Init DOM Opacity
  ele.style.opacity = 1;
  var decrementOp = 1;

  if (displayType === "") {
    var animation = window.setInterval(function(){
      if (Number(ele.style.opacity) > 0) {
        decrementOp -= 1/speed;
        ele.style.opacity = decrementOp;
        ele.style.display = "none";
      }else{
        ele.style.opacity = 0;
        window.clearInterval(animation);
      }
    }, speed);

  }else{
    // Only opacity is been animated and fade out, display remains unchanged
    var animation = window.setInterval(function(){
      if (Number(ele.style.opacity) > 0) {
        decrementOp -= 1/speed;
        ele.style.opacity = decrementOp;
      }else{
        ele.style.opacity = 0;
        window.clearInterval(animation);
      }
    }, speed);
  }
}

// Get accurate player age
function playerAgeCalculator(playerInfoData){

  if (playerInfoData.death_date === "") {
    // If player not death, return age property
    return String(playerInfoData.age).bold();

  }else{
    // If player death, calculate acctually age
    // Subtraction using: birth_date & death_date

    var death = new Date(playerInfoData.death_date.slice(0,10))
    var birth = new Date(playerInfoData.birth_date.slice(0,10))
    var actualAge;

    if (death.getMonth()>birth.getMonth()) {
      return actualAge = String(death.getYear() - birth.getYear()).bold() + " ( death )".italics();
    }else if(death.getMonth() === birth.getMonth() && death.getDay() > birth.getDay()){
      return actualAge = String(death.getYear() - birth.getYear()).bold() + " ( death )".italics();
    }else{
      return actualAge = String(death.getYear() - birth.getYear()-1).bold() + " ( death )".italics();
    }
  }
}

// Reset Content
function resetContent() {

  var dashHeaderContainer = document.getElementById("dash-header");
  var returnBtn = document.getElementById("return-btn");
  var searchBtn = document.getElementById("search-icon");
  var statsEle = document.getElementById("regular");
  var seasonAvgEle = document.getElementById("s-avg");
  var monthAvgEle = document.getElementById("m-avg");
  var weekAvgEle = document.getElementById("w-avg");
  var table = document.getElementById("stats-container");
  var dash = document.getElementById("dashboard-container");
  var dashPreloader = document.getElementById("dash-preloader");
  var bar = document.getElementById("bar-chart");
  var donut = document.getElementById("donut-chart");
  var line = document.getElementById("line-chart");
  var barMetrics = document.getElementById("bar-metrics-option");
  var lineMetrics = document.getElementById("line-metrics-option");
  var donutTooltip = document.getElementsByClassName("donut-tooltip")[0];
  var lineTooltip = document.getElementsByClassName("line-tooltip")[0];

  // remove all tooltip of previous chart
  if (donutTooltip !== undefined) {
    donutTooltip.remove();
  }
  if (lineTooltip !== undefined) {
    lineTooltip.remove();
  }


  // initiate legend position
  lineLegNew = [];
  lineLegPos = [];

  // Reset metrics dropdown list in the dashboard
  barMetrics.innerHTML = "";
  lineMetrics.innerHTML = "";


  // Reset Season stats data array
  seasonStatsArray = [];
  seasonStatsClean = [];
  uniqueSeasons = [];

  //Reset dashboard preloader status
  fadeIn(dashPreloader,"block",10);

  for (let i = 0; i < document.getElementsByClassName("grid-item").length; i++) {
   document.getElementsByClassName("grid-item")[i].innerText = "";
  }

  //Remove and initial player img

  // document.getElementById("player-pic").src = "";

  // Reset name and jersy number section, then remove the class
  if (document.getElementsByClassName("player-name")[0] === undefined) {
    return;
  }else{
    document.getElementsByClassName("player-name")[0].innerText = "";
    document.getElementById("player-info").querySelector("h1").classList.remove("player-name");

    fadeOut(dashHeaderContainer, 17);
    fadeOut(returnBtn, 17);
    fadeOut(searchBtn, 17);
    fadeOut(table,17);
    fadeOut(dash, 17);
    fadeOut(bar, 17, "display-unchanged");
    fadeOut(donut, 17, "display-unchanged");
    fadeOut(line, 17, "display-unchanged");


    // Reset stats records
    statsEle.innerHTML = "";
    seasonAvgEle.innerHTML = "";
    monthAvgEle.innerHTML = "";
    weekAvgEle.innerHTML = "";
  }

  d3.select("#bar-chart").selectAll("svg").remove();
  d3.select("#donut-chart").selectAll("svg").remove();
  d3.select("#line-chart").selectAll("svg").remove();
  d3.select("#donut-season").remove();
}

// Loading the webpage
function pageLoader(){

  var bodySelector = document.querySelector("body");
  var logo = document.getElementById("header-logo");
  var preloadImg = new Image();

  bodySelector.style.opacity = 0;

  preloadImg.onload = function(){
    logo.src = this.src;
    fadeIn(bodySelector, "block", 17);
  }

  preloadImg.src = "https://www.mlbstatic.com/team-logos/league-on-dark/1.svg";

}

// Career Data Parse in
function careerStatsParse(playerInfoData, statsEle, seasonAvgEle, monthAvgEle, weekAvgEle, stats){
  if (playerInfoData.primary_position_txt !== "P") {

    // Defined avg weighted and rounded to 2 decimal points
    var seasonAvg = 162 / Number(stats.g);
    var monthAvg = 27 / Number(stats.g);
    var weekAvg = 6.75 / Number(stats.g);
    var hit1B = String(Number(stats['h'])-Number(stats['xbh']));
    var hit2B = String(2*Number(stats['xbh'])+Number(stats['hr'])-Number(stats['tb'])+Number(stats['h']));
    var hit3B = String(Number(stats['tb'])-Number(stats['h'])-Number(stats['xbh'])-2*Number(stats['hr']));


    statsEle.innerHTML = "<td>"+ stats.h +"</td>" +
    "<td>" + hit1B + "</td>" +
    "<td>" + hit2B + "</td>" +
    "<td>" + hit3B + "</td>" +
    "<td>" + stats.hr + "</td>" +
    "<td>" + stats.rbi + "</td>" +
    "<td>"+ stats.sb + "</td>" +
    "<td>"+ stats.so + "</td>" +
    "<td>"+ stats.avg +"</td>" +
    "<td>"+ stats.slg +"</td>" +
    "<td>"+ stats.obp +"</td>" +
    "<td>"+ (Number(stats.slg)+Number(stats.obp)).toFixed(3) +"</td>";

    seasonAvgEle.innerHTML = "<td>"+ String(Math.round(Number(stats.h)*seasonAvg*10)/10) +"</td>" +
    "<td>" + String(Math.round(Number(hit1B)*seasonAvg*10)/10) + "</td>" +
    "<td>" + String(Math.round(Number(hit2B)*seasonAvg*10)/10) + "</td>" +
    "<td>" + String(Math.round(Number(hit3B)*seasonAvg*10)/10) + "</td>" +
    "<td>" + String(Math.round(Number(stats.hr)*seasonAvg*10)/10) + "</td>" +
    "<td>" + String(Math.round(Number(stats.rbi)*seasonAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.sb)*seasonAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.so)*seasonAvg*10)/10) + "</td>" +
    "<td>"+ stats.avg +"</td>" +
    "<td>"+ stats.slg +"</td>" +
    "<td>"+ stats.obp +"</td>" +
    "<td>"+ (Number(stats.slg)+Number(stats.obp)).toFixed(3) + "</td>";

    monthAvgEle.innerHTML = "<td>"+ String(Math.round(Number(stats.h)*monthAvg*10)/10) +"</td>" +
    "<td>" + String(Math.round(Number(hit1B)*monthAvg*10)/10) + "</td>" +
    "<td>" + String(Math.round(Number(hit2B)*monthAvg*10)/10) + "</td>" +
    "<td>" + String(Math.round(Number(hit3B)*monthAvg*10)/10) + "</td>" +
    "<td>" + String(Math.round(Number(stats.hr)*monthAvg*10)/10) + "</td>" +
    "<td>" + String(Math.round(Number(stats.rbi)*monthAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.sb)*monthAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.so)*monthAvg*10)/10) + "</td>" +
    "<td>"+ stats.avg +"</td>" +
    "<td>"+ stats.slg +"</td>" +
    "<td>"+ stats.obp +"</td>" +
    "<td>"+ (Number(stats.slg)+Number(stats.obp)).toFixed(3) +"</td>";

    weekAvgEle.innerHTML = "<td>"+ String(Math.round(Number(stats.h)*weekAvg*10)/10) +"</td>" +
    "<td>" + String(Math.round(Number(hit1B)*weekAvg*10)/10) + "</td>" +
    "<td>" + String(Math.round(Number(hit2B)*weekAvg*10)/10) + "</td>" +
    "<td>" + String(Math.round(Number(hit3B)*weekAvg*10)/10) + "</td>" +
    "<td>" + String(Math.round(Number(stats.hr)*weekAvg*10)/10) + "</td>" +
    "<td>" + String(Math.round(Number(stats.rbi)*weekAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.sb)*weekAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.so)*weekAvg*10)/10) + "</td>" +
    "<td>"+ stats.avg +"</td>" +
    "<td>"+ stats.slg +"</td>" +
    "<td>"+ stats.obp +"</td>" +
    "<td>"+ (Number(stats.slg)+Number(stats.obp)).toFixed(3) +"</td>";

  }else{
    // Cleaned up the retrieved data from career stats api
    // if (isNaN(Number(stats.gs)) || Number(stats.gs) === 0 || isNaN(Number(stats.qs)) || Number(stats.qs) === 0) {
    //   var qsRatio = ".000";
    // }else{
    //   var qsRatio = String(Math.round(Number(stats.qs)/Number(stats.gs)*1000)/1000).slice(1,);
    // }

    var kpct = (stats.kpct*100).toFixed(1) + "%"

    if (isNaN(Number(stats.hld)) || Number(stats.hld) === 0) {
      var hld = "0";
    }else{
      var hld = stats.hld;
    }

    if (Number(stats.w) === 0) {
      var wpct = "0.000";
    }else if ( Number(stats.w) / (Number(stats.l) + Number(stats.w))  === 1) {
      var wpct = "1.000";
    }else{
      var wpct = String(Math.round(Number(stats.w) / (Number(stats.l) + Number(stats.w))*1000)/1000).slice(0,);
    }

    if (isNaN(Number(stats.ao)) || Number(stats.ao) === 0) {
      stats.ao = "0";
    }

    if (isNaN(Number(stats.go)) || Number(stats.go) === 0) {
      stats.go = "0";
    }

    // Defined avg weighted and rounded to 2 decimal points
    var seasonAvg = 68 / (Number(stats.g) + Number(stats.gs));
    var monthAvg = 11.33 / (Number(stats.g) + Number(stats.gs));
    var weekAvg = 2.8325 / (Number(stats.g) + Number(stats.gs));

    statsEle.innerHTML = "<td>"+ stats.w +"</td>" +
    "<td>" + stats.sv + "</td>" +
    "<td>" + hld + "</td>" +
    "<td>"+ stats.so + "</td>" +
    "<td>"+ stats.ao + "</td>" +
    "<td>"+ stats.go + "</td>" +
    "<td>"+ stats.bb + "</td>" +
    "<td>"+ kpct +"</td>"+
    "<td>"+ stats.era +"</td>" +
    "<td>"+ stats.whip +"</td>" +
    "<td>"+ wpct +"</td>";

    seasonAvgEle.innerHTML = "<td>"+ String(Math.round(Number(stats.w)*seasonAvg*10)/10) +"</td>" +
    "<td>" + String(Math.round(Number(stats.sv)*seasonAvg*10)/10) + "</td>" +
    "<td>" + String(Math.round(Number(hld)*seasonAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.so)*seasonAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.ao)*seasonAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.go)*seasonAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.bb)*seasonAvg*10)/10) + "</td>" +
    "<td>"+ kpct +"</td>"+
    "<td>"+ stats.era +"</td>" +
    "<td>"+ stats.whip +"</td>" +
    "<td>"+ wpct +"</td>";

    monthAvgEle.innerHTML = "<td>"+ String(Math.round(Number(stats.w)*monthAvg*10)/10) +"</td>" +
    "<td>" + String(Math.round(Number(stats.sv)*monthAvg*10)/10) + "</td>" +
    "<td>" + String(Math.round(Number(hld)*monthAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.so)*monthAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.ao)*monthAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.go)*monthAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.bb)*monthAvg*10)/10) + "</td>" +
    "<td>"+ kpct +"</td>"+
    "<td>"+ stats.era +"</td>" +
    "<td>"+ stats.whip +"</td>" +
    "<td>"+ wpct +"</td>";

    weekAvgEle.innerHTML = "<td>"+ String(Math.round(Number(stats.w)*weekAvg*10)/10) +"</td>" +
    "<td>" + String(Math.round(Number(stats.sv)*weekAvg*10)/10) + "</td>" +
    "<td>" + String(Math.round(Number(hld)*weekAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.so)*weekAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.ao)*weekAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.go)*weekAvg*10)/10) + "</td>" +
    "<td>"+ String(Math.round(Number(stats.bb)*weekAvg*10)/10) + "</td>" +
    "<td>"+ kpct +"</td>"+
    "<td>"+ stats.era +"</td>" +
    "<td>"+ stats.whip +"</td>" +
    "<td>"+ wpct +"</td>";
  }
}

// Seasonal Data Parse in
function seasonStatsParse(season, position, seasonData){

  // Multiple data per season, meaing the player have been traded in the middle of the season
  if (seasonData.length !== undefined) {

    // Get the whole metrics name of the seasonal data into an array
    var seasonDataMerge = {};

    for (var i = 0; i < seasonData.length; i++) {
      if (position !== "P") {
        seasonData[i]['1b'] = String(Number(seasonData[i]['h'])-Number(seasonData[i]['xbh']));
        seasonData[i]['2b'] = String(2*Number(seasonData[i]['xbh'])+Number(seasonData[i]['hr'])-Number(seasonData[i]['tb'])+Number(seasonData[i]['h']));
        seasonData[i]['3b'] = String(Number(seasonData[i]['tb'])-Number(seasonData[i]['h'])-Number(seasonData[i]['xbh'])-2*Number(seasonData[i]['hr']));
      }
    }
    var dataIndex = Object.keys(seasonData[0]);
    // Stored the original data structure for the multi seasonal data array
    seasonStatsArray.unshift(seasonData);

    // After stored, merge the player's seaonsal data in different teams during the same season
    for (var j = 0; j < dataIndex.length; j++) {
      var metricsName = dataIndex[j]

      seasonDataMerge[metricsName] = seasonData.reduce(function(prev, now){
        if (metricsName === "ip") {
          var inningsPitched = prev + Number(now[metricsName]);
          // Return only the integer innings pitch
          var wholeInningPitched = inningsPitched - Math.round(inningsPitched%1*10)/10;
          var decimInningPitched = Math.round(inningsPitched%1*10)/10;
          // For every .3 pitched innings, add on additional 1-inning pitched
          var extraInningPitched = Math.floor(decimInningPitched/0.3);
          // Remained decimal part innings pitched
          var remainedDecimalInnings = Math.round((decimInningPitched%.3*10))/10;
          return wholeInningPitched + extraInningPitched + remainedDecimalInnings;

        }else if (metricsName === "whip" || metricsName === "era") {

          return 0;

        }else if (metricsName === "avg" || metricsName === "slg" || metricsName === "obp" || metricsName === "ops"){

          return 0;

        }else if (metricsName === "team_abbrev"){

          return prev + " / " + (now[metricsName]);

        }else if (metricsName === "season"){

          return (now[metricsName]);

        }else{

          return prev + Number(now[metricsName]);

        }

      },0);

      seasonDataMerge[metricsName] = String(seasonDataMerge[metricsName]);

    }

    seasonDataMerge.team_abbrev = seasonDataMerge.team_abbrev.slice(4,);

    // Add k% metrics to pitcher's season data
    if (position === "P"){
      var ipWhole = Math.floor(Number(seasonDataMerge["ip"]));
      var ipDeci = (Number(seasonDataMerge["ip"])*10 - Math.floor(Number(seasonDataMerge["ip"]))*10)/3;
      var ip = ipWhole + ipDeci;

      seasonDataMerge["kpct"] = Math.round(Number(seasonDataMerge["so"])/Number(seasonDataMerge["tbf"])*1000)/1000;
      seasonDataMerge["era"] = Math.round((Number(seasonDataMerge["er"])/ip)*9*100)/100;
      seasonDataMerge["whip"] = Math.round((Number(seasonDataMerge["bb"])+Number(seasonDataMerge["h"]))/ip*100)/100;
    }else {
      var slgNom = Number(seasonDataMerge["1b"])*1 + Number(seasonDataMerge["2b"])*2 + Number(seasonDataMerge["3b"])*3 + Number(seasonDataMerge["hr"])*4;
      var obpNom = Number(seasonDataMerge["h"]) + Number(seasonDataMerge["bb"]) + Number(seasonDataMerge["hbp"]);
      var obpDenom = Number(seasonDataMerge["ab"]) + Number(seasonDataMerge["bb"]) + Number(seasonDataMerge["hbp"]) + Number(seasonDataMerge["sf"]);

      seasonDataMerge["avg"] = String(Math.round(Number(seasonDataMerge["h"])/Number(seasonDataMerge["ab"])*1000)/1000).slice(1,);
      seasonDataMerge["slg"] = String(Math.round(Number(slgNom/seasonDataMerge["ab"])*1000)/1000).slice(1,);
      seasonDataMerge["obp"] = String(Math.round(obpNom/obpDenom*1000)/1000).slice(1,);
      seasonDataMerge["ops"] = Math.round((Number(seasonDataMerge["slg"]) + Number(seasonDataMerge["obp"]))*1000)/1000;

      if (seasonDataMerge["ops"]>=1) {
        seasonDataMerge["ops"] = String(seasonDataMerge["ops"]);
      }else {
        seasonDataMerge["ops"] = String(seasonDataMerge["ops"]).slice(1,);
      }
    }

    // Merge multi seasonal data then append into another data array
    seasonStatsClean.unshift(seasonDataMerge);

  }else if (position !== "P") {
    seasonData['1b'] = String(Number(seasonData['h'])-Number(seasonData['xbh']));
    seasonData['2b'] = String(2*Number(seasonData['xbh'])+Number(seasonData['hr'])-Number(seasonData['tb'])+Number(seasonData['h']));
    seasonData['3b'] = String(Number(seasonData['tb'])-Number(seasonData['h'])-Number(seasonData['xbh'])-2*Number(seasonData['hr']));
    seasonStatsArray.unshift(seasonData);
    seasonStatsClean.unshift(seasonData);
  }else {
    seasonData["kpct"] = Math.round(Number(seasonData["so"])/Number(seasonData["tbf"])*1000)/1000;
    seasonStatsArray.unshift(seasonData);
    seasonStatsClean.unshift(seasonData);
  }
}

// Create data visualization and interactive dashboard
function dashboardBuilder(kpi){
  // Create a bar chart

  var seasonsArray = [];
  var dataLength = seasonStatsClean.length;
  var seasonInit = Number(seasonStatsClean[0].season);
  var metricsBench = {};


  while (seasonInit <= Number(seasonStatsClean[ dataLength - 1].season)) {
    seasonsArray.push(seasonInit);
    seasonInit++;
  }

  var barChart = d3.select("#bar-chart")
                   .append("svg")
                   .attr("class", "bar-chart");


  var donutChart = d3.select("#donut-chart")
                     .append("svg")
                     .attr("class", "donut-chart")

  var donutLabel = d3.select("body")
                     .append("div")
                     .attr("class", "donut-tooltip")
                     .style("display", "none");

  var dataSeason = d3.select("#donut-chart").append("span").attr("id", "donut-season")
  dataSeason.html("<p>"+"Season :"+"</p>"+"<p class = \"seasonNum\">"+"&nbsp"+(seasonsArray[seasonsArray.length-1])+"</p>");

  var donutDefault = "default";



  var lineChart = d3.select("#line-chart")
                    .append("svg")
                    .attr("class", "line-chart");

  // Define height & width

  var height = [document.getElementById("bar-chart").offsetHeight, document.getElementById("donut-chart").offsetHeight, document.getElementById("line-chart").offsetHeight];
  var width = [document.getElementById("bar-chart").offsetWidth, document.getElementById("donut-chart").offsetWidth, document.getElementById("line-chart").offsetWidth];

  // Return only the unique years of season
  seasonsArray = [...new Set(seasonsArray)];

  // Init metrics dropdown list
  dropdown(kpi, metricsBench, barChart, lineChart, height, width, seasonsArray);

  // Build dashboard
  dashConstruction(kpi, metricsBench, barChart, donutLabel, donutDefault, donutChart, lineChart, height, width, seasonsArray);


  // Resize window
  window.addEventListener("resize", function(){

    var barMetrics = document.getElementById("bar-metrics-option");
    var lineTooltipContainer = document.getElementsByClassName("line-tooltip-container")[0];
    var lineTooltipDash = document.querySelector(".line-tooltip-dash");
    var lineTooltip = document.querySelector(".line-tooltip");

    if (lineTooltipContainer !== undefined && lineTooltipContainer !== null) {
      console.log(lineTooltipContainer);

      lineTooltipContainer.remove();
    }

    if (lineTooltipDash !== undefined && lineTooltipDash !== null) {
      lineTooltipDash.remove();
    }

    if (lineTooltip !== undefined && lineTooltip !== null) {
      lineTooltip.remove();
    }


    lineLegPos = [];
    donutDefault = barsIndexClicked;

    if (barMetrics === undefined) {
      return
    }else{

      var currentMetrics = barMetrics.options[barMetrics.selectedIndex].value.toLowerCase();

      if (currentMetrics === "k") {
        kpi = "so";
      }else{
        kpi =  currentMetrics;
      }


      barChart.selectAll("g").remove();
      barChart.selectAll("rect").remove();
      barChart.selectAll("text").remove();

      lineChart.selectAll("g").remove();

      donutChart.selectAll("g").remove();

      height = [document.getElementById("bar-chart").offsetHeight, document.getElementById("donut-chart").offsetHeight, document.getElementById("line-chart").offsetHeight];
      width = [document.getElementById("bar-chart").offsetWidth, document.getElementById("donut-chart").offsetWidth, document.getElementById("line-chart").offsetWidth];

      dashConstruction(kpi, metricsBench, barChart, donutLabel, donutDefault, donutChart, lineChart, height, width, seasonsArray);

    }

  });
}

// dashboard function
function dashConstruction(kpi, metricsBench, barChart, donutLabel, donutDefault, donutChart, lineChart, height, width, seasonsArray){

  var returnBtn = document.getElementById("return-btn");
  var returnTxt = document.getElementById("return-text");

  barConstruction(barChart, kpi, metricsBench, height, width, seasonsArray, returnBtn, returnTxt);
  donutContruction("yes", donutDefault, donutChart, donutLabel, width, height);
  lineConstruction(lineChart, width, height, seasonsArray);

  // If dashboard shows nothing, then pin the function again to rebuild one
  // (This is to tackle some bugs occurred while I tested the functions)
  setTimeout(function(){
    if (height[0] === 0 || height[1] === 0) {

      d3.select("#bar-chart").selectAll("svg").remove();
      d3.select("#donut-chart").selectAll("svg").remove();
      d3.select("#line-chart").selectAll("svg").remove();

      // remove donut chart tooltip
      d3.select("div.toolTip").remove();

      dashboardBuilder(kpi);

      fadeIn(returnBtn, "inline-block", 10);
      fadeIn(returnTxt, "inline-block", 10);
    }
  }, 80);

  setTimeout(function(){
    if (returnBtn.style.opacity === "0") {
      fadeIn(returnBtn, "inline-block", 10);
      fadeIn(returnTxt, "inline-block", 10);
    }
  }, 300);
}

// bar chart options
function dropdown(kpi, metricsBench, barChart, lineChart, height, width, seasonsArray){

  var barMetrics = document.getElementById("bar-metrics-option");
  var lineMetrics = document.getElementById("line-metrics-option");
  var metrics = document.querySelectorAll("#metrics-title>th");
  var returnBtn = document.getElementById("return-btn");
  var returnTxt = document.getElementById("return-text");

  if (barMetrics.innerHTML === "") {

    // Append bar chart metrics element to the dropdown list
    for (var i = 0; i < metrics.length-4; i++) {
      barMetrics.innerHTML +=  "<option class=\"options\" value=\""+metrics[i].innerText+"\">" + metrics[i].innerText + "</option>";
    }

    // Add event listener to the bar dropdown list
    barMetrics.addEventListener("change",function(){

      height = [document.getElementById("bar-chart").offsetHeight, document.getElementById("donut-chart").offsetHeight, document.getElementById("line-chart").offsetHeight];
      width = [document.getElementById("bar-chart").offsetWidth, document.getElementById("donut-chart").offsetWidth, document.getElementById("line-chart").offsetWidth];

      var currentMetrics = barMetrics.options[barMetrics.selectedIndex].value.toLowerCase();

      if (currentMetrics === "k") {
        kpi = "so";
      }else{
        kpi =  currentMetrics;
      }

      updateBar(kpi, barChart, width, height, seasonsArray, metricsBench, returnBtn, returnTxt);

      // Resize window
      // window.addEventListener("resize", function(){
      //
      //   var barMetrics = document.getElementById("bar-metrics-option");
      //
      //   if (barMetrics === undefined) {
      //     return
      //   }else{
      //
      //     var currentMetrics = barMetrics.options[barMetrics.selectedIndex].value.toLowerCase();
      //
      //     if (currentMetrics === "k") {
      //       kpi = "so";
      //     }else{
      //       kpi =  currentMetrics;
      //     }
      //
      //     height = [document.getElementById("bar-chart").offsetHeight, document.getElementById("donut-chart").offsetHeight, document.getElementById("line-chart").offsetHeight];
      //     width = [document.getElementById("bar-chart").offsetWidth, document.getElementById("donut-chart").offsetWidth, document.getElementById("line-chart").offsetWidth];
      //
      //     barChart.selectAll("g").remove();
      //     barChart.selectAll("rect").remove();
      //     barChart.selectAll("text").remove();
      //
      //     barConstruction(barChart, kpi, metricsBench, height, width, seasonsArray, returnBtn);
      //
      //   }
      // });
    });

    // lineMetrics.innerHTML +=  "<input type=\"checkbox\" class=\"line-chart-options\" name=\"all\"" + " value=\"all\">"+ "&nbsp;" +"<label for=\"all\">"+"<b>All</b>"+"</label><br>";

    if (metrics[0].innerText === "W") {
      for (var i = metrics.length-4; i < metrics.length-1; i++) {
        lineMetrics.innerHTML +=  "<input type=\"checkbox\" class=\"line-chart-options\" name=\"" + metrics[i].innerText + "\"" + " value=\""+metrics[i].innerText+"\" checked >"+ "&nbsp;" +"<label for=\""+metrics[i].innerText+"\">"+metrics[i].innerText+"</label><br>";
      }
    }else {
      for (var i = metrics.length-4; i < metrics.length; i++) {
        lineMetrics.innerHTML +=  "<input type=\"checkbox\" class=\"line-chart-options\" name=\"" + metrics[i].innerText + "\"" + " value=\""+metrics[i].innerText+"\" checked >"+ "&nbsp;" +"<label for=\""+metrics[i].innerText+"\">"+metrics[i].innerText+"</label><br>";
      }
    }

    var lineOps = document.querySelectorAll('input.line-chart-options');

    // Init visible metrics list
    for (var i = 0; i < lineOps.length; i++) {
      if(lineOps[i].checked){
        if (lineOps[i].value.toLowerCase() === "k%") {
          lineLegNew.push("kpct");
        }else {
          lineLegNew.push(lineOps[i].value.toLowerCase());
        }
      }
    }

    lineOps.forEach(function(ele) {
      ele.addEventListener("change", function() {
        height = [document.getElementById("bar-chart").offsetHeight, document.getElementById("donut-chart").offsetHeight, document.getElementById("line-chart").offsetHeight];
        width = [document.getElementById("bar-chart").offsetWidth, document.getElementById("donut-chart").offsetWidth, document.getElementById("line-chart").offsetWidth];
        lineLegNew = [];

        var toggleEle = this;
        var barMetrics = document.getElementById("bar-metrics-option");
        var lineTooltipDash = document.querySelector(".line-tooltip-dash");
        var lineTooltip = document.querySelector(".line-tooltip");


        if (lineTooltipDash !== undefined) {
          lineTooltipDash.remove();
        }

        if (lineTooltip !== undefined) {
          lineTooltip.remove();
        }

        if (!toggleEle.checked && toggleEle.value === "K%") {

          d3.selectAll(".kpct").remove();
          d3.selectAll(".line-legend.-kpct").attr("display","none");

        }else if (!toggleEle.checked) {

          d3.selectAll("."+toggleEle.value.toLowerCase()).remove();
          d3.selectAll(".line-legend.-"+toggleEle.value.toLowerCase()).attr("display","none");

        }

        // Filter visible metrics list
        for (var i = 0; i < lineOps.length; i++) {
          if(lineOps[i].checked){
            if (lineOps[i].value.toLowerCase() === "k%") {
              lineLegNew.push("kpct");
            }else {
              lineLegNew.push(lineOps[i].value.toLowerCase());
            }
          }
        }

        // Update the legend position
        for (var i = 0; i < lineLegNew.length; i++) {
          d3.select(".line-legend.-"+lineLegNew[i]).attr("transform", lineLegPos[i]);
        }

        updateLine(toggleEle, lineOps, lineChart, width, height, seasonsArray);

    });
  });


  }

  // init benchmark
  for (var i = 0; i < metrics.length; i++) {
    if (metrics[i].innerText.toLowerCase() === "k") {
      metricsBench["so"] = Number(document.querySelectorAll("#s-avg>td")[i].innerText);
    }else{
      metricsBench[metrics[i].innerText.toLowerCase()] = Number(document.querySelectorAll("#s-avg>td")[i].innerText);
    }
  }

}

// Set Y-axis scale
function barYCoordInit(xScale, xAxis, width, height, metrics){

  var valueMax = d3.max(seasonStatsClean, (d) => Number(d[metrics]));

  if (valueMax > 350) {
    // Create bar chart y-Axis's domain, range
    var yScaleInit = d3.scaleLinear()
               .domain([0, 450])
               .range([height[0], height[0] - height[0]/1.2]);


    var yAxisInit = d3.axisLeft(yScaleInit)
              .tickValues([0,50,100,150,200,250,300,350,400,450])
              .tickSizeOuter(0);

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScaleInit).ticks(6);
    }


  }else if (valueMax > 300 && valueMax <= 350) {
    // Create bar chart y-Axis's domain, range
    var yScaleInit = d3.scaleLinear()
               .domain([0, 400])
               .range([height[0], height[0] - height[0]/1.2]);


    var yAxisInit = d3.axisLeft(yScaleInit)
              .tickValues([0,50,100,150,200,250,300,350,400])
              .tickSizeOuter(0);

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScaleInit).ticks(3);
    }


  }else if(valueMax > 200 && valueMax <= 300){

    // Create bar chart y-Axis's domain, range
    var yScaleInit = d3.scaleLinear()
               .domain([0, 350])
               .range([height[0], height[0] - height[0]/1.2]);


    var yAxisInit = d3.axisLeft(yScaleInit)
              .tickValues([0,50,100,150,200,250,300,350])
              .tickSizeOuter(0);

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScaleInit).ticks(4);
    }

  }else if (valueMax > 50 && valueMax <= 200) {

    // Create bar chart y-Axis's domain, range
    var yScaleInit = d3.scaleLinear()
                .domain([0, 250])
                .range([height[0], height[0] - height[0]/1.2]);


    var yAxisInit = d3.axisLeft(yScaleInit)
              .tickValues([0,50,100,150,200,250])
              .tickSizeOuter(0);

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScaleInit).ticks(5);
    }

  }else if (valueMax > 30 && valueMax <= 50) {
    // Create bar chart y-Axis's domain, range
    var yScaleInit = d3.scaleLinear()
                .domain([0, 60])
                .range([height[0], height[0] - height[0]/1.2]);


    var yAxisInit = d3.axisLeft(yScaleInit)
              .tickValues([0,10,20,30,40,50,60])
              .tickSizeOuter(0);

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScaleInit).ticks(6);
    }

  }else if (valueMax > 15 && valueMax <= 30){

    // Create bar chart y-Axis's domain, range
    var yScaleInit = d3.scaleLinear()
                .domain([0, 40])
                .range([height[0], height[0] - height[0]/1.2]);


    var yAxisInit = d3.axisLeft(yScaleInit)
              .tickValues([0,10,20,30,40])
              .tickSizeOuter(0);

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScaleInit).ticks(4);
    }

  }else {
    // Create bar chart y-Axis's domain, range
    var yScaleInit = d3.scaleLinear()
                .domain([0, 25])
                .range([height[0], height[0] - height[0]/1.2]);


    var yAxisInit = d3.axisLeft(yScaleInit)
              .tickValues([0, 5, 10, 15, 20, 25])
              .tickSizeOuter(0);

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScaleInit).ticks(4);
    }
  }

  return [yScaleInit, yAxisInit, make_y_gridlines()];
}

// Set Y-axis scale
function lineYCoordInit(xScale, xAxis, width, height, metrics){

  var metricsList = document.querySelectorAll('input.line-chart-options');
  var metricsMax = {};
  var valueMax;
  var tickMax;
  var tickVal = 0;
  var tickArr = [];


  for (var i = 0; i < metrics.length; i++) {
    metricsMax[metrics[i]] = d3.max(seasonStatsClean, (d) => Number(d[metrics[i]]));
  }

  metricsMax = Object.values(metricsMax);
  valueMax = Math.max(...metricsMax);
  tickMax = Math.round((valueMax+0.1)*10)/10;

  if (tickMax*10%2 === 1) {
    tickMax = Math.round((tickMax+0.1)*10)/10;
  }

  // if user filter out all the line chart
  if (tickMax === -Infinity) {
    tickMax = 0.4;

    while (tickVal <= tickMax) {
      tickArr.push(tickVal);
      tickVal += 0.1;
      tickVal = Math.round((tickVal+0.1)*10)/10;
    }

  }else if (tickMax >= 1.5) {
    tickMax = Math.round(tickMax/1.5)*1.5+1;

    while (tickVal <= tickMax) {
      tickArr.push(tickVal);
      tickVal += 0.5;
      tickVal = Math.round((tickVal+0.5));
    }

  }else {

    while (tickVal <= tickMax) {
      tickArr.push(tickVal);
      tickVal += 0.1;
      tickVal = Math.round((tickVal+0.1)*10)/10;
    }

  }


  // Create bar chart y-Axis's domain, range
  var yScaleInit = d3.scaleLinear()
             .domain([0, tickMax])
             .range([height[2], height[2] - height[2]/1.15]);

  // Dynamically set the ticks interval by max value

  var yAxisInit = d3.axisLeft(yScaleInit)
            .tickValues(tickArr)
            .tickFormat(d3.format('.1f'))
            .tickSizeOuter(0);


  // if (valueMax > 10 && valueMax <= 30) {
  //   // Create bar chart y-Axis's domain, range
  //   var yScaleInit = d3.scaleLinear()
  //              .domain([0, 30])
  //              .range([height[2], height[2] - height[2]/1.15]);
  //
  //
  //   var yAxisInit = d3.axisLeft(yScaleInit)
  //             .tickValues([0, 5, 10, 15, 20, 25, 30, 35])
  //             .tickSizeOuter(0);
  //
  //   // gridlines in y axis function
  //   function make_y_gridlines() {
  //       return d3.axisLeft(yScaleInit).ticks(4);
  //   }
  //
  // }else if (valueMax > 7 && valueMax <= 10) {
  //
  //   // Create bar chart y-Axis's domain, range
  //   var yScaleInit = d3.scaleLinear()
  //              .domain([0, 12])
  //              .range([height[2], height[2] - height[2]/1.15]);
  //
  //
  //   var yAxisInit = d3.axisLeft(yScaleInit)
  //             .tickValues([0, 2, 4, 6, 8, 10, 12])
  //             .tickSizeOuter(0);
  //
  //   // gridlines in y axis function
  //   function make_y_gridlines() {
  //       return d3.axisLeft(yScaleInit).ticks(4);
  //   }
  //
  // }else if (valueMax > 5.5 && valueMax <= 7) {
  //
  //   // Create bar chart y-Axis's domain, range
  //   var yScaleInit = d3.scaleLinear()
  //              .domain([0, 7.5])
  //              .range([height[2], height[2] - height[2]/1.15]);
  //
  //
  //   var yAxisInit = d3.axisLeft(yScaleInit)
  //             .tickValues([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5])
  //             .tickSizeOuter(0)
  //             .tickFormat(d3.format(".1f"));
  //
  //   // gridlines in y axis function
  //   function make_y_gridlines() {
  //       return d3.axisLeft(yScaleInit).ticks(8);
  //   }
  //
  // }else if (valueMax > 3 && valueMax <= 5.5) {
  //
  //   // Create bar chart y-Axis's domain, range
  //   var yScaleInit = d3.scaleLinear()
  //              .domain([0, 6])
  //              .range([height[2], height[2] - height[2]/1.15]);
  //
  //
  //   var yAxisInit = d3.axisLeft(yScaleInit)
  //             .tickValues([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6])
  //             .tickSizeOuter(0)
  //             .tickFormat(d3.format(".1f"));
  //
  //   // gridlines in y axis function
  //   function make_y_gridlines() {
  //       return d3.axisLeft(yScaleInit).ticks(6);
  //   }
  //
  // }else if (valueMax > 1 && valueMax <= 3) {
  //
  //   // Create bar chart y-Axis's domain, range
  //   var yScaleInit = d3.scaleLinear()
  //              .domain([0, 3.5])
  //              .range([height[2], height[2] - height[2]/1.15]);
  //
  //
  //   var yAxisInit = d3.axisLeft(yScaleInit)
  //             .tickValues([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5])
  //             .tickSizeOuter(0)
  //             .tickFormat(d3.format(".1f"));
  //
  //   // gridlines in y axis function
  //   function make_y_gridlines() {
  //       return d3.axisLeft(yScaleInit).ticks(6);
  //   }
  //
  // }else if (valueMax > 0.75 && valueMax <= 1) {
  //
  //   // Create bar chart y-Axis's domain, range
  //   var yScaleInit = d3.scaleLinear()
  //              .domain([0, 1.2])
  //              .range([height[2], height[2] - height[2]/1.15]);
  //
  //
  //   var yAxisInit = d3.axisLeft(yScaleInit)
  //             .tickValues([0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2])
  //             .tickSizeOuter(0)
  //             .tickFormat(d3.format(".2f"));
  //
  //   // gridlines in y axis function
  //   function make_y_gridlines() {
  //       return d3.axisLeft(yScaleInit).ticks(6);
  //   }
  //
  // }else if (valueMax > 0.45 && valueMax <= 0.75) {
  //
  //   // Create bar chart y-Axis's domain, range
  //   var yScaleInit = d3.scaleLinear()
  //              .domain([0, 0.8])
  //              .range([height[2], height[2] - height[2]/1.15]);
  //
  //
  //   var yAxisInit = d3.axisLeft(yScaleInit)
  //             .tickValues([0, 0.2, 0.4, 0.6, 0.8])
  //             .tickSizeOuter(0)
  //             .tickFormat(d3.format(".2f"));
  //
  //   // gridlines in y axis function
  //   function make_y_gridlines() {
  //       return d3.axisLeft(yScaleInit).ticks(4);
  //   }
  //
  // }else {
  //
  //   // Create bar chart y-Axis's domain, range
  //   var yScaleInit = d3.scaleLinear()
  //              .domain([0, 0.6])
  //              .range([height[2], height[2] - height[2]/1.15]);
  //
  //
  //   var yAxisInit = d3.axisLeft(yScaleInit)
  //             .tickValues([0, 0.2, 0.4, 0.6])
  //             .tickSizeOuter(0)
  //             .tickFormat(d3.format(".2f"));
  //
  //   // gridlines in y axis function
  //   function make_y_gridlines() {
  //       return d3.axisLeft(yScaleInit).ticks(4);
  //   }
  //
  // }

  // return [yScaleInit, yAxisInit, make_y_gridlines()];
  return [yScaleInit, yAxisInit];

}

// Create donut chart
function donutContruction(init, dataEntry, donutChart, donutLabel, width, height){
  // Create a donut chart
  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.

  var radius = Math.min(width[1]*0.8, height[1]*0.8) / 2;
  var data;
  var donutData;
  var total;
  var color;

  if (dataEntry === "default") {
    data = seasonStatsClean[seasonStatsClean.length-1];
  }else{
    data = seasonStatsClean[dataEntry];
  }

  donutData = {"Fly Out": Number(data.ao), "Ground Out": Number(data.go), "Strike Out": Number(data.so)};
  total = d3.sum([donutData["Fly Out"],donutData["Ground Out"], donutData["Strike Out"]]);


  color = d3.scaleOrdinal()
            .domain(donutData)
            .range(["#1D45A7", "#B9455D", "#008806"]);

  // Compute the position of each group on the pie:
  var pie = d3.pie()
              .value(function(d) {return d.value;})
              .sort(null);

  var dataReady = pie(d3.entries(donutData));

  var arc = d3.arc()
    .innerRadius(function(){
      if (width[1] <= 450) {
        return 80;
      }else{
        return 100;
      }
    })         // This is the size of the donut hole
    .outerRadius(function(){
      if (width[1] <= 450) {
        return radius*0.85;
      }else{
        return radius;
      }
    });

  // Legend settings
  var legendRectSize = 13;
  var legendSpacing = 6;




  if (init === "yes") {

    var donutSvg = donutChart.attr("width", width[1])
    .attr("height", height[1])
    .append("g")
    .attr("transform", "translate(" + width[1] / 2 + "," + height[1] / 2 + ")")
    .attr("class", "donut-chart-group");

    donutSvg.selectAll('g')
            .data(dataReady)
            .enter()
            .append('path')
            .on("mousemove", function(d){
              donutLabel.style("left", d3.event.pageX+10+"px");
              donutLabel.style("top", d3.event.pageY-25+"px");
              donutLabel.style("display", "inline-block");
              donutLabel.html((d.data.key)+"<br>"+(Math.round((d.data.value/total)*1000)/10)+"%");
            })
            .on("mouseout", function(d){
                donutLabel.style("display", "none");

            })
            .attr('d', arc)
            .attr('fill', function(d){ return(color(d.data.key));})
            .attr("opacity", "0")
            .transition()
            .ease(d3.easeBounceOut)
            .duration(950)
            .delay(200)
            .attr("opacity", "0.7")
            .attrTween("d", pieTweenInit)
            .attr("stroke", "black")
            .attr("class", "donut-arcs")
            .style("stroke-width", "1px")
            .each(function(d) { this._current = d; });


    // Add lengend to the donut chart
    var legend = donutSvg.selectAll('.legend') //the legend and placement
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'circle-legend')
            .attr('transform', function (d, i) {
                 var height = legendRectSize + legendSpacing + 2;
                 var offset = height * color.domain().length / 2-3;
                 var horz = -2 * legendRectSize - 13;
                 var vert = i * height - offset;
                 return 'translate(' + horz + ',' + vert + ')';
            });

    // Specify legend color
    legend.append('circle')
          .style('fill', color)
          .style('stroke', color)
          .style("opacity", 0.7)
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', function(){
            if (width[1] <= 350) {
              return '.28rem';
            }else{
              return '.35rem';
            }
          })
          .style("opacity","0")
          .transition()
          .duration(1000)
          .style("opacity","0.7");

    // Append legend text
    legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function (d) {
               return d;
          })
          .style("opacity","0")
          .transition()
          .duration(1000)
          .style("opacity","1");


  }else{

    // Update donut chart on bar chart's click event
    var arcNew = d3.select('svg.donut-chart')
      .selectAll("path")
      .data(dataReady)


    arcNew.transition()
      .ease(d3.easeBounceOut)
      .duration(275)
      .delay(75)
      .attrTween("d", arcTween);


    arcNew.enter()
        .append("path")
        .attr("class", "arc")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        .each(function(d) { this._current = d; });


    arcNew.on("mousemove", function(d){
            donutLabel.style("left", d3.event.pageX+10+"px");
            donutLabel.style("top", d3.event.pageY-25+"px");
            donutLabel.style("display", "inline-block");
            donutLabel.html((d.data.key)+"<br>"+(Math.round((d.data.value/total)*1000)/10)+"%");
          })
          .on("mouseout", function(d){
            donutLabel.style("display", "none");
          });

  }

  //animation function
  function pieTweenInit(d){
    d.innerRadius = 0;
    var i = d3.interpolate({startAngle: 0, endAngle: 0}, d);
    return function(t){ return arc(i(t)); }
  }

  // twitch donut chart arc

  function arcTween(a) {
    var j = d3.interpolate(this._current, a);
    this._current = j(0);
    return function(t) {
      return arc(j(t));
    }
  }

}

// Create bar chart
function barConstruction(barChart, kpi, metricsBench, height, width, seasonsArray, returnBtn, returnTxt){
  var position = document.getElementsByClassName("grid-item")[0].innerText.slice(11,);
  var benchmark;

  var xScale = d3.scaleLinear()
                 .domain([
                   d3.min(seasonStatsClean, (d) => Number(d.season)-1),
                   d3.max(seasonStatsClean, (d) => Number(d.season)+1)
                 ])
                 .range([
                   45,
                   width[0] - 50
                 ]);


  var xAxis = d3.axisBottom(xScale)
                .tickValues(seasonsArray)
                .tickFormat(function(d) { return String(d)})
                .tickPadding(2.5)
                .tickSizeOuter(0);


  // Create bar chart y-Axis's domain, range

  if (kpi === "default") {

    if (position !== "P") {
      var metrics = "h";
    }else{
      var metrics = "w";
    }
  }else{
    var metrics = kpi;
  }

  var yAxisOutput = barYCoordInit(xScale, xAxis, width, height, metrics);
  var yScale = yAxisOutput[0];
  var yAxis = yAxisOutput[1];

  // Set width & height
  barChart.attr("width", width[0]-5)
          .attr("height", height[0]*5/6);


  // Add bar chart y-axis
  barChart.append("g")
          .attr("transform", "translate( 45, -25)")
          .attr("x",0)
          .attr("id","y-axis")
          .transition()
          .duration(1000)
          .call(yAxis);


  // Add bar chart y-gridlines
  barChart.append("g")
          .attr("class", "bar-gridlines")
          .attr("transform", "translate( 45, -25)")
          .transition()
          .duration(1000)
          .call(yAxisOutput[2]
                .tickSize(-width[0]+95)
                .tickFormat(""));


  // Add bar chart x-axis
  barChart.append("g")
          .attr("transform", "translate(0," + String(height[0]-25) + ")")
          .transition()
          .duration(1000)
          .call(xAxis)
          .attr("class","bar-x-axis");


  // Append bar chart into the container
  if (document.querySelector("body").offsetWidth <= 375) {
    var barWidth = 22;
  }else{
    var barWidth = 30;
  }


  barChart.append("g")
          .attr("class","bars-group")
          .selectAll(".bars")
          .data(seasonStatsClean)
          .enter()
          .append("rect")
          .attr("x", (d,i) => xScale(Number(d.season))-barWidth/2)
          .attr("y", yScale(0)-25)
          .attr("width", barWidth)
          .attr("height", height[0] - yScale(0))
          .attr("class", "bars")
          .on("click", (d,i)=>{

            var donutChartNew = d3.select("svg.donut-chart");
            var donutLabelNew = d3.select("div.donut-tooltip");

            d3.select("p.seasonNum")._groups[0][0].innerHTML = "";
            d3.select("p.seasonNum")._groups[0][0].innerHTML = "&nbsp"+ d.season;

            barsIndexClicked = i;

            donutContruction("no", i, donutChartNew, donutLabelNew, width, height);

          })
          .transition()
          .duration(400)
          .ease(d3.easeBounce)
          .attr('height', (d,i)=>{
            return height[0] - yScale(Number(d[metrics]));
          })
          .attr('y', (d,i) => {
            return yScale(Number(d[metrics])) - 25;
          })
          .delay(function(d,i){
            return i* 100+30;
          });


  // Append benchmark line
  barChart.append("g")
          .attr("class", "benchmark-group")
          .selectAll("path")
          .data(seasonStatsClean)
          .enter()
          .append("path")
          .attr("class", "benchmark")
          .style("stroke", "d45d79")
          .style("opacity", "0")
          .style("stroke-width", 1.75)
          // .style("stroke-dasharray",(5,5))
          .attr("d", function(d,i){

            if (position !== "P") {
              benchmark = metricsBench[metrics]*(Number(d.g)/162);
            }else{
              benchmark = metricsBench[metrics]*((Number(d.g)+Number(d.gs))/68);
            }

            var linePts = "M" + (xScale(Number(d.season))-barWidth/2-2) + "," + (yScale(benchmark) - 25);
            linePts += "L" + (xScale(Number(d.season))+barWidth/2+2) + "," + (yScale(benchmark) - 25);

            return linePts;
          });

    // Transition
    barChart.selectAll("path")
            .transition()
            .duration(300)
            .delay(1100)
            .style("opacity",".9");


    // Add bar chart data labels
    barChart.append("g")
            .attr("class","bar-label-group")
            .selectAll("text")
            .data(seasonStatsClean)
            .enter()
            .append("text")
            .text((d,i)=>{
              return d[metrics];
            })
            .attr("x", (d, i) => {
              if(d[metrics].length>=3){
                return xScale(Number(d.season)) - 11;
              }else if (d[metrics].length===2) {
                return xScale(Number(d.season)) - 7;
              }else if (d[metrics].length===1) {
                return xScale(Number(d.season)) - 3.5;
              }
            })
            .attr("y", (d, i) => {
              return yScale(Number(d[metrics])) - 30;
            })
            .attr("class","bar-value")
            .style("opacity","0");

    // Transition
    barChart.selectAll("text")
            .transition()
            .duration(300)
            .delay(1100)
            .style("opacity","1");


    // If dashboard shows nothing, then pin the function again to rebuild one
    // (This is to tackle some bugs occurred while I tested the functions)

    setTimeout(function(){
      if (height[0] <= 0) {

        d3.select("#bar-chart").selectAll("svg").remove();
        d3.select("#donut-chart").selectAll("svg").remove();
        d3.select("#line-chart").selectAll("svg").remove();
        dashboardBuilder(kpi);

        fadeIn(returnBtn, "inline-block", 10);
        fadeIn(returnTxt, "inline-block", 10);
      }
    }, 80);

    setTimeout(function(){
      if (returnBtn.style.opacity === "0") {
        fadeIn(returnBtn, "inline-block", 10);
        fadeIn(returnTxt, "inline-block", 10);
      }
    }, 300);
}

// Update bar chart function
function updateBar(kpi, barChart, width, height, seasonsArray, metricsBench, returnBtn, returnTxt){
  var position = document.getElementsByClassName("grid-item")[0].innerText.slice(11,);
  var metrics = kpi;
  var benchmark;

  var xScale = d3.scaleLinear()
                 .domain([
                   d3.min(seasonStatsClean, (d) => Number(d.season)-1),
                   d3.max(seasonStatsClean, (d) => Number(d.season)+1)
                 ])
                 .range([
                   45,
                   width[0] - 50
                 ]);


  var xAxis = d3.axisBottom(xScale)
                .tickValues(seasonsArray)
                .tickFormat(function(d) { return String(d)})
                .tickPadding(2.5)
                .tickSizeOuter(0);

  var yAxisOutput = barYCoordInit(xScale, xAxis, width, height, metrics);
  var yScale = yAxisOutput[0];
  var yAxis = yAxisOutput[1];

  // Append bar chart into the container
  if (document.querySelector("body").offsetWidth <= 375) {
    var barWidth = 22;
  }else{
    var barWidth = 30;
  }

  // Update  y-gridlines
  barChart.select(".bar-gridlines")
          .transition()
          .duration(500)
          .call(yAxisOutput[2]
                .tickSize(-width[0]+95)
                .tickFormat(""));


  // Update bar chart y-axis
  barChart.select("#y-axis")
          .transition()
          .duration(1000)
          .call(yAxis);


  // Update bar chart
  d3.select(".bars-group")
    .selectAll(".bars")
    .data(seasonStatsClean)
    .transition()
    .ease(d3.easeBounce)
    .duration(250)
    .attr('height', (d,i)=>{
      return height[0] - yScale(Number(d[metrics]));
    })
    .attr('y', (d,i) => {
      return yScale(Number(d[metrics])) - 25;
    }).delay(function(d,i){
      return 50*i;
    });


  // Update benchmark
  barChart.select('.benchmark-group')
          .selectAll("path.benchmark")
          .data(seasonStatsClean)
          .transition()
          .duration(275)
          .attr("d", function(d,i){

            if (position !== "P") {
              benchmark = metricsBench[metrics]*(Number(d.g)/162);
            }else{
              benchmark = metricsBench[metrics]*((Number(d.g)+Number(d.gs))/68);
            }

            var linePts = "M" + (xScale(Number(d.season))-barWidth/2-2) + "," + (yScale(benchmark) - 25);
            linePts += "L" + (xScale(Number(d.season))+barWidth/2+2) + "," + (yScale(benchmark) - 25);

            return linePts;
          }).delay(function(d,i){
            return 50*i+80;
          });


    barChart.select(".bar-label-group")
            .selectAll("text.bar-value")
            .data(seasonStatsClean)
            .transition()
            .duration(275)
            .text((d,i)=>{
              return d[metrics];
            })
            .attr("x", (d, i) => {
              if(d[metrics].length>=3){
                return xScale(Number(d.season)) - 11;
              }else if (d[metrics].length===2) {
                return xScale(Number(d.season)) - 7;
              }else if (d[metrics].length===1) {
                return xScale(Number(d.season)) - 3.5;
              }
            })
            .attr("y", (d, i) => {
              return yScale(Number(d[metrics])) - 30;
            }).delay(function(d,i){
              return 50*i+80;
            });

    // If dashboard shows nothing, then pin the function again to rebuild one
    // (This is to tackle some bugs occurred while I tested the functions)


    setTimeout(function(){
      if (returnBtn.style.opacity === "0") {
        fadeIn(returnBtn, "inline-block", 10);
        fadeIn(returnTxt, "inline-block", 10);
      }
    }, 300);

}

// Create Line Chart
function lineConstruction(lineChart, width, height, seasonsArray){

  var position = document.getElementsByClassName("grid-item")[0].innerText.slice(11,);
  var xScale = d3.scaleLinear()
                 .domain([
                   d3.min(seasonStatsClean, (d) => Number(d.season)-1),
                   d3.max(seasonStatsClean, (d) => Number(d.season)+1)
                 ])
                 .range([
                   45,
                   Math.round(width[2]*7/8)
                 ]);


  var xAxis = d3.axisBottom(xScale)
                .tickValues(seasonsArray)
                .tickFormat(function(d) { return String(d)})
                .tickPadding(2.5)
                .tickSizeOuter(0);


  // if (position !== "P") {
  //   var metrics = ["avg","slg","obp","ops"];
  // }else{
  //   var metrics = ["kpct","era","whip"];
  // }

  var metrics = [];
  var metricsList = document.querySelectorAll('input.line-chart-options');

  // Update the metrics to show on line graph
  for (var i = 0; i < metricsList.length; i++) {
    if(metricsList[i].checked && metricsList[i].value === "K%"){

      metrics.push("kpct");

    }else if (metricsList[i].checked && metricsList[i].value !== "K%") {

      metrics.push(metricsList[i].value.toLowerCase());

    }
  }


  var yAxisOutput = lineYCoordInit(xScale, xAxis, width, height, metrics);
  var yScale = yAxisOutput[0];
  var yAxis = yAxisOutput[1];


  // Set width & height
  lineChart.attr("width", Math.round(width[2]*7/8))
          .attr("height", height[2]*5/6);


  // Add line chart y-axis
  lineChart.append("g")
          .attr("transform", "translate( 45, -25)")
          .attr("x",0)
          .attr("id","line-y-axis")
          .transition()
          .duration(1000)
          .call(yAxis);


  // Add line chart y-gridlines
  //
  // lineChart.append("g")
  //         .attr("class", "line-gridlines")
  //         .attr("transform", "translate( 45, -20)")
  //         .transition()
  //         .duration(1000)
  //         .call(yAxisOutput[2]
  //               .tickSize(-width[2]+160)
  //               .tickFormat(""));


  // Add line chart x-axis
  lineChart.append("g")
          .attr("transform", "translate(0," + String(height[2]-25) + ")")
          .transition()
          .duration(1000)
          .call(xAxis)
          .attr("class","line-x-axis");

  var lineObj = lineChart.append("g")
                         .attr("class", "line-chart-group");

  // var ptsObj = lineChart.append("g")
  //                        .attr("class", "dot-chart-group");


  var len = d3.select("#line-y-axis").selectAll(".tick").select("text")._groups[0].length;
  var colorKey = {};

  linePreMax = d3.select("#line-y-axis").selectAll(".tick").select("text")._groups[0][len-1].innerHTML;


  if (position !== "P") {
    var colorRange = {"avg":"#1D45A7", "slg":"#B9455D", "obp":"#008806", "ops":"#FF823D"};
  }else{
    var colorRange = {"kpct":"#1D45A7", "era":"#B9455D", "whip":"#008806"};
  }


  // Set dynamic color range
  for (var i = 0; i < metricsList.length; i++) {
    if(metricsList[i].value === "K%"){
      colorKey["kpct"] = colorRange["kpct"];
    }else {
      colorKey[metricsList[i].value.toLowerCase()] = colorRange[metricsList[i].value.toLowerCase()];
    }
  }

  var lineColor = d3.scaleOrdinal()
                    .domain(Object.keys(colorKey))
                    .range(Object.values(colorKey));



  // Append multi-line to the line chart container
  for (var index = 0; index < metrics.length; index++) {

   var line = d3.line()
                .x(function(d,i){ return xScale(Number(d.season));})
                .y(function(d){ return yScale(Number(d[metrics[index]]))-25; });


    // ptsObj.selectAll(".dot."+metrics[index])
    //       .data(seasonStatsClean)
    //       .enter().append("circle")
    //       .attr("class", "dot"+" "+metrics[index])
    //       .attr("cx", function(d,i){ return xScale(Number(d.season));})
    //       .attr("cy", function(d){
    //         return yScale(Number(d[metrics[index]]))-25;
    //       })
    //       .attr("opacity","0")
    //       .attr("r", 3.7)
    //       .attr("fill", "none")
    //       .attr("stroke","black")
    //       .attr("stroke-width",1.5);


   lineObj.append("path")
          .datum(seasonStatsClean)
          .attr('fill', "none")
          .attr("stroke", function(d){ return(lineColor(metrics[index]));})
          .attr("stroke-width", 2.5)
          .attr("class", "line "+metrics[index])
          .attr("opacity","0.8")
          .attr("d", line);

  }



  // append a container for tooltip
  var tipBox =lineChart.append('rect')
           .attr("x", 45)
           .attr("y", 20)
           .attr('width', Math.round(width[2]*7/8)-45)
           .attr('height', height[2]/1.15)
           .attr('opacity', 0)
           .attr("class", "line-tooltip-container")
           .on('mousemove', drawTooltip)
           .on('mouseout', removeTooltip);


  var lineTooltip = d3.select("body")
                     .append("div")
                     .attr("class", "line-tooltip")
                     .style("display", "none");


  var tooltipLine = lineChart.append('line').attr("class", "line-tooltip-dash");


  function drawTooltip(){

    var lineSeason = Math.floor((xScale.invert(d3.mouse(tipBox.node())[0]) + 0.5) / 1) * 1;

    if (lineSeason < seasonStatsClean[0].season) {
      lineSeason = seasonStatsClean[0].season;
    }else if (lineSeason > seasonStatsClean[seasonStatsClean.length-1].season) {
      lineSeason = seasonStatsClean[seasonStatsClean.length-1].season;
    }

    // if no data of the season then return out of the function
    if (seasonStatsClean.find(hover => Number(hover.season) === lineSeason) === undefined) {
      tooltipLine.attr('stroke', 'none');
      lineTooltip.style("display","none");
      return
    }


    tooltipLine.attr('stroke', 'black')
               .attr("opacity", "0.8")
               .attr('x1', xScale(lineSeason)+0.5)
               .attr('x2', xScale(lineSeason)+0.5)
               .attr('y1', yScale(0)-25)
               .attr('y2', height[2] - height[2]/1.15-25)
               .style("stroke-dasharray", ("4, 4"));

    // sorting the display metrics name by data
    metrics.sort(function(prev, nxt){ return seasonStatsClean.find(data => Number(data.season) === Math.floor(lineSeason))[nxt] - seasonStatsClean.find(data => Number(data.season) === Math.floor(lineSeason))[prev]; });


    lineTooltip.html("<span><u>"+ lineSeason+" Season" + "</u></span>")
               .style('display', 'block')
               .style('left', d3.event.pageX + 20 + "px")
               .style('top', d3.event.pageY - 20 + "px")
               .selectAll()
               .data(metrics)
               .enter()
               .append('div')
               .style("color",function(d){
                 return colorRange[d];
               })
               .attr("class","tooltip-contents")
               .html(function(d){
                 if (d === "kpct") {

                   return "K%" + ' ' + String(Math.round(Number(seasonStatsClean.find(hover => Number(hover.season) === Math.floor(lineSeason))[d])*1000)/10)+"%"

                 }else {

                   return d.toUpperCase() + ' ' + (seasonStatsClean.find(hover => Number(hover.season) === Math.floor(lineSeason))[d]);
                 }
               });

  }
  function removeTooltip(){
    tooltipLine.attr('stroke', 'none');
    lineTooltip.style("display","none");
  }


  // line animation
  function tweenDash() {
			var l = this.getTotalLength(),
				i = d3.interpolateString("0," + l, l + "," + l);
			return function (t) { return i(t); };
	}

	function transition(selection) {
			selection.each(function(){
       d3.select(this).transition()
				.duration(1000)
        .ease(d3.easeCubic)
				.attrTween("stroke-dasharray", tweenDash);
      })
	}

  transition(d3.selectAll("path.line"));
  // transition(d3.selectAll("path.domain"));


   // Add lengend to the donut chart
   var legendSize = 10;

   var lineLeg = lineChart.selectAll('.line-legend') //the legend and placement
           .data(lineColor.domain())
           .enter()
           .append('g')
           .attr('class', function(d){
             return 'line-legend ' + '-'+d;
           })
           .attr('transform', function (d, i) {
                var offset = 18;
                var horz = width[2]-55-legendSize;
                var vert = height[2]/1.5 + offset*i;
                return 'translate(' + horz + ',' + vert + ')';
           });


   for (var i = 0; i < metricsList.length; i++) {
     var offset = 18;
     var horz = width[2]-55-legendSize;
     var vert = height[2]/1.5 + offset*i;

     // Stored the original position of each legend in the line chart
     lineLegPos.push('translate(' + horz + ',' + vert + ')');

     if (!metricsList[i].checked) {
       if (metricsList[i].value !== "K%") {
         d3.select(".line-legend.-"+metricsList[i].value.toLowerCase()).attr("display","none");
       }else {
         d3.select(".line-legend.-kpct").attr("display","none");
       }
     }
   }

   // Update the legend position
   for (var i = 0; i < lineLegNew.length; i++) {
     d3.select(".line-legend.-"+lineLegNew[i]).attr("transform", lineLegPos[i]);
   }


   // Specify legend color
   lineLeg.append('circle')
         .style('fill', lineColor)
         .style('stroke', lineColor)
         .style("opacity", 1)
         .attr('cx', 0)
         .attr('cy', 0)
         .attr('r', function(){
           if (width[1] <= 350) {
             return '.2rem';
           }else{
             return '.25rem';
           }
         })
         .style("opacity","0")
         .transition()
         .duration(1000)
         .style("opacity","0.8");

   // Append legend text
   lineLeg.append('text')
         .attr('x', legendSize + 1.5)
         .attr('y', legendSize - 5.5)
         .attr("class", "line-text")
         .text(function (d) {
           if (d === "kpct") {
             return "K%"
           }else{
            return d.toUpperCase();
           }
         })
         .style("opacity","0")
         .transition()
         .duration(1000)
         .style("opacity","1");
}

// Update line chart
function updateLine(metricsToggle, metricsList, lineChart, width, height, seasonsArray){

  var position = document.getElementsByClassName("grid-item")[0].innerText.slice(11,);

  var xScale = d3.scaleLinear()
                 .domain([
                   d3.min(seasonStatsClean, (d) => Number(d.season)-1),
                   d3.max(seasonStatsClean, (d) => Number(d.season)+1)
                 ])
                 .range([
                   45,
                   Math.round(width[2]*7/8)
                 ]);


  var xAxis = d3.axisBottom(xScale)
                .tickValues(seasonsArray)
                .tickFormat(function(d) { return String(d)})
                .tickPadding(2.5)
                .tickSizeOuter(0);



  var metrics = [];
  var colorKey = {};

  // Update the metrics to show on line graph
  for (var i = 0; i < metricsList.length; i++) {
    if(metricsList[i].checked && metricsList[i].value === "K%"){

      metrics.push("kpct");

    }else if (metricsList[i].checked && metricsList[i].value !== "K%") {

      metrics.push(metricsList[i].value.toLowerCase());

    }
  }

  var yAxisOutput = lineYCoordInit(xScale, xAxis, width, height, metrics);
  var yScale = yAxisOutput[0];
  var yAxis = yAxisOutput[1];


  if (position !== "P") {
    var colorRange = {"avg":"#1D45A7", "slg":"#B9455D", "obp":"#008806", "ops":"#FF823D"};
  }else{
    var colorRange = {"kpct":"#1D45A7", "era":"#B9455D", "whip":"#008806"};
  }

  // Set dynamic color range
  for (var i = 0; i < metricsList.length; i++) {
    if(metricsList[i].checked && metricsList[i].value === "K%"){
      colorKey["kpct"] = colorRange["kpct"];
    }else if (metricsList[i].checked && metricsList[i].value !== "K%"){
      colorKey[metricsList[i].value.toLowerCase()] = colorRange[metricsList[i].value.toLowerCase()];
    }
  }

  var lineColor = d3.scaleOrdinal()
                    .domain(Object.keys(colorKey))
                    .range(Object.values(colorKey));

  // Update line chart y-axis
  lineChart.select("#line-y-axis")
          .transition()
          .duration(1000)
          .call(yAxis);


  // Update line chart y-gridlines

  // lineChart.select(".line-gridlines")
  //          .transition()
  //          .duration(500)
  //          .call(yAxisOutput[2]
  //            .tickSize(-width[2]+160)
  //            .tickFormat(""));


  // Get the max value of the y-axis
  var len = d3.select("#line-y-axis").selectAll(".tick").select("text")._groups[0].length;
  var updateMax = d3.select("#line-y-axis").selectAll(".tick").select("text")._groups[0][len-1].innerHTML;



  // Update (append or remove) the line and point elements, based on the checkbox checked status
  var lineContainer = d3.select("g.line-chart-group");
  // var ptsContainer = d3.select("g.dot-chart-group");

  if (metricsToggle.checked && metricsToggle.value === "K%") {
    var filterMetrics = "kpct";
  }else if( metricsToggle.checked ){
    var filterMetrics = metricsToggle.value.toLowerCase();
  }

  if (metricsToggle.checked) {

    var lineUpdate = d3.line()
                       .x(function(d,i){ return xScale(Number(d.season));})
                       .y(function(d){ return yScale(Number(d[filterMetrics]))-20; });


    // ptsContainer.selectAll(".dot."+filterMetrics)
    //             .data(seasonStatsClean)
    //             .enter().append("circle")
    //             .attr("class", "dot "+filterMetrics)
    //             .attr("cx", function(d,i){ return xScale(Number(d.season));})
    //             .attr("cy", function(d){
    //               return yScale(Number(d[filterMetrics]))-20;
    //             })
    //             .attr("opacity","0")
    //             .attr("r", 3.7)
    //             .attr("fill", "none")
    //             .attr("stroke","black")
    //             .attr("stroke-width",1.5);



   lineContainer.append("path")
                .datum(seasonStatsClean)
                .attr('fill', "none")
                .attr("stroke", function(d){ return(lineColor(filterMetrics));})
                .attr("stroke-width", 2.5)
                .attr("class", "line "+filterMetrics)
                .attr("opacity","0.8")
                .attr("d", lineUpdate);


    // Update legend for the line chart
    d3.select(".line-legend.-"+filterMetrics).attr("display","inline-block");

  }

  // Update other lines
  if (Number(updateMax) !== Number(linePreMax)) {
    linePreMax = updateMax;
    d3.select(".dot-chart-group").selectAll("circle").attr("opacity","0");
  }

  for (var index = 0; index < metrics.length; index++) {

    var lineLen;

    d3.select(".line-chart-group")
      .selectAll("path.line." + metrics[index])
      .datum(seasonStatsClean)
      .transition()
      .duration(1000)
      .ease(d3.easeCubic)
      .attr("d", d3.line()
                   .x(function(d,i){ return xScale(Number(d.season));})
                   .y(function(d){ return yScale(Number(d[metrics[index]]))-25; }))
      .on("end", function(){
        lineLen = this.getTotalLength();
      })
      .attr("stroke-dasharray", String(lineLen)+","+String(lineLen));


    // d3.select(".dot-chart-group")
    //   .selectAll("circle.dot." + metrics[index])
    //   .data(seasonStatsClean)
    //   .attr("opacity","0")
    //   .transition()
    //   .duration(800)
    //   .ease(d3.easeCubic)
    //   .attr("cx", function(d,i){ return xScale(Number(d.season));})
    //   .attr("cy", function(d){
    //     return yScale(Number(d[metrics[index]]))-25;
    //   });

  }

  // append a container for tooltip
  var tipBox =lineChart.append('rect')
           .attr("x", 45)
           .attr("y", 20)
           .attr('width', Math.round(width[2]*7/8)-45)
           .attr('height', height[2]/1.15)
           .attr('opacity', 0)
           .attr("class", "line-tooltip-container")
           .on('mousemove', drawTooltip)
           .on('mouseout', removeTooltip);


  var lineTooltip = d3.select("body")
                     .append("div")
                     .attr("class", "line-tooltip")
                     .style("display", "none");


  var tooltipLine = lineChart.append('line').attr("class", "line-tooltip-dash");


  function drawTooltip(){

    var lineSeason = Math.floor((xScale.invert(d3.mouse(tipBox.node())[0]) + 0.5) / 1) * 1;

    if (lineSeason < seasonStatsClean[0].season) {
      lineSeason = seasonStatsClean[0].season;
    }else if (lineSeason > seasonStatsClean[seasonStatsClean.length-1].season) {
      lineSeason = seasonStatsClean[seasonStatsClean.length-1].season;
    }

    // if no data of the season then return out of the function
    if (seasonStatsClean.find(hover => Number(hover.season) === lineSeason) === undefined) {
      tooltipLine.attr('stroke', 'none');
      lineTooltip.style("display","none");
      return
    }

    tooltipLine.attr('stroke', 'black')
               .attr("opacity", "0.8")
               .attr('x1', xScale(lineSeason)+0.5)
               .attr('x2', xScale(lineSeason)+0.5)
               .attr('y1', yScale(0)-25)
               .attr('y2', height[2] - height[2]/1.15-25)
               .style("stroke-dasharray", ("4, 4"));

    // sorting the display metrics name by data
    metrics.sort(function(prev, nxt){ return seasonStatsClean.find(data => Number(data.season) === Math.floor(lineSeason))[nxt] - seasonStatsClean.find(data => Number(data.season) === Math.floor(lineSeason))[prev]; });


    lineTooltip.html("<span><u>"+ lineSeason+" Season" + "</u></span>")
               .style('display', 'block')
               .style('left', d3.event.pageX + 20 + "px")
               .style('top', d3.event.pageY - 20 + "px")
               .selectAll()
               .data(metrics)
               .enter()
               .append('div')
               .style("color",function(d){
                 return colorRange[d];
               })
               .attr("class","tooltip-contents")
               .html(function(d){
                 if (d === "kpct") {

                   return "K%" + ' ' + String(Math.round(Number(seasonStatsClean.find(hover => Number(hover.season) === Math.floor(lineSeason))[d])*1000)/10)+"%"

                 }else {

                   return d.toUpperCase() + ' ' + (seasonStatsClean.find(hover => Number(hover.season) === Math.floor(lineSeason))[d]);
                 }
               });

  }
  function removeTooltip(){
    tooltipLine.attr('stroke', 'none');
    lineTooltip.style("display","none");
  }
}
