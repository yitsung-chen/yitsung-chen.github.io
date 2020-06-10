var movieObj = [
  ["All Sci-fi / Action", 2, "https://www.youtube.com/embed/EXeTwQWrcwY?wmode=transparent&amp;rel=0&autoplay=1", "https://www.youtube.com/embed/u843KNE-exo?wmode=transparent&amp;rel=0&autoplay=1"],
  ["All Sci-fi / Action", 2, "https://www.youtube.com/embed/YoHD9XEInc0?wmode=transparent&amp;rel=0&autoplay=1", "https://www.youtube.com/embed/8BfMivMDOBI?wmode=transparent&amp;rel=0&autoplay=1"],
  ["All Life Musical", 2, "https://www.youtube.com/embed/AXCTMGYUg9A?wmode=transparent&amp;rel=0&autoplay=1", "https://www.youtube.com/embed/CaE0JD1X12g?wmode=transparent&amp;rel=0&autoplay=1"],
  ["All Animation", 2, "https://www.youtube.com/embed/87E6N7ToCxs?wmode=transparent&amp;rel=0&autoplay=1", "https://www.youtube.com/embed/OzMJkRwOxjs?wmode=transparent&amp;rel=0&autoplay=1"],
  ["All Animation", 2, "https://www.youtube.com/embed/seMwpP0yeu4?wmode=transparent&amp;rel=0&autoplay=1", "https://www.youtube.com/embed/y2truxhcBko?wmode=transparent&amp;rel=0&autoplay=1"],
  ["All Animation", 2, "https://www.youtube.com/embed/jWM0ct-OLsM?wmode=transparent&amp;rel=0&autoplay=1", "https://www.youtube.com/embed/JOIjmLw0iQc?wmode=transparent&amp;rel=0&autoplay=1"],
  ["All Romantic", 2, "https://www.youtube.com/embed/PsD0NpFSADM?wmode=transparent&amp;rel=0&autoplay=1", "https://www.youtube.com/embed/xXYHPsTXzP8?wmode=transparent&amp;rel=0&autoplay=1"],
  ["All Romantic", 1, "https://www.youtube.com/embed/kVS-6k2tQAA?wmode=transparent&amp;rel=0&autoplay=1", ""],
  ["All Romantic", 1, "https://www.youtube.com/embed/tdF01cA7jOE?wmode=transparent&amp;rel=0&autoplay=1", ""],
  ["All Life", 1, "https://www.youtube.com/embed/HddkucqSzSM?wmode=transparent&amp;rel=0&autoplay=1", ""],
  ["All Life", 1, "https://www.youtube.com/embed/8ikeVQ8WAcQ?wmode=transparent&amp;rel=0&autoplay=1", ""],
  ["All Life", 1, "https://www.youtube.com/embed/uR-2TiQVY-k?wmode=transparent&amp;rel=0&autoplay=1", ""],
  ["All Sports", 1, "https://www.youtube.com/embed/I9RHqdZDCF0?wmode=transparent&amp;rel=0&autoplay=1", ""],
  ["All Sports", 1, "https://www.youtube.com/embed/-4QPVo0UIzc?wmode=transparent&amp;rel=0&autoplay=1", ""],
  ["All Sports", 1, "https://www.youtube.com/embed/K3SlVsdUuBY?wmode=transparent&amp;rel=0&autoplay=1", ""]
];
var movieTitles = [];
const movieAmounts = $('#movie-box*').length;
const pageAmounts = $('.page*').length;
var displaySpeed = 400;
var hideSpeed = 0;
var mode=1;
var currentPage = 1;

$(document).ready(function() {

  // Shows all the elements once the document is fully loaded
  $(".jumbotron").animate({"opacity":"1"},850);
  $(".page-button").animate({"opacity":"1"},850);
  setTimeout(function(){
    $("#movie-box*").animate({"opacity":"1"},450);
  },300);

  // Initiated the default text of the dropdown button
  $('.dropdown-toggle').text("All");

  // Initiated smooth scroll function
  $(window).scroll(function() {
      if ($(this).scrollTop()) {
          $('.arrow-up').fadeIn();
      } else {
          $('.arrow-up').fadeOut();
      }
  });
  $(".fa-arrow-up").click(function() {
      $("html, body").animate({scrollTop: 0}, 400);
   });


  // initiated movie title array for search function
  for (var i = 0; i < movieAmounts; i++) {
    movieTitles.push($(".movie-title*")[i].innerText);
  }

  // Regular Expression Searching commands
  var keysInput;

  $('.search-bar').keyup(function(e){

    keysInput = $('.search-bar').val();
    var query = new RegExp(keysInput,"gi");
    var filter = new RegExp($('.dropdown-toggle').text(),"g");
    var matchMovieList = [];
    var matchLength;

    // If user press left or right key toward the inputs text, the search function
    // won't be executed
    if (e.keyCode !== 37 && e.keyCode !== 39) {


      for (var i = 0; i < movieAmounts; i++) {

        // If the search text partially matched the movie title then show the movie box
        if (movieTitles[i].match(query) && movieObj[i][1] >= mode && (movieObj[i][0].match(filter))) {
          matchMovieList.push($('#movie-box*').eq(i));
        }else{
          $('#movie-box*').eq(i).removeClass().addClass("col-xs-12 col-sm-6 col-lg-4");
          $('#movie-box*').eq(i).fadeOut(hideSpeed);
        }
      }

      // Return the movies amounts that match the search
      matchLength = matchMovieList.length;

      // Show the page 2 buttons if the matched movies amounts are more than 9
      if (matchLength <= 9) {
        $('.page*').eq(1).hide(450);
      }else{
        $('.page*').eq(1).show(450);
      }


      for (var i = 0; i < matchLength; i++) {
        // Only show 9 movie boxes per page
        if (matchLength <= 9 && matchLength > 0) {
          matchMovieList[i].removeClass().addClass("page1 col-xs-12 col-sm-6 col-lg-4");
          matchMovieList[i].fadeIn(displaySpeed);
        }else{

          if (matchLength > 9 && i <= 8) {
            matchMovieList[i].removeClass().addClass("page1 col-xs-12 col-sm-6 col-lg-4");
            matchMovieList[i].fadeIn(displaySpeed);
          }else if (matchLength > 9 && i > 8){
            matchMovieList[i].removeClass().addClass("page2 col-xs-12 col-sm-6 col-lg-4");
            matchMovieList[i].fadeOut(hideSpeed);
          }else{
            // If the search text does not partially matched the movie title then hide the movie box
            matchMovieList[i].removeClass().addClass("col-xs-12 col-sm-6 col-lg-4");
            matchMovieList[i].fadeOut(hideSpeed);
          }
        }
      }


      // Reset movie box appearance when search text all been removed
      if (keysInput==="") {
        currentPage = 1;
        $('.page*').eq(1).removeClass("active");
        $('.page*').eq(0).addClass("active");
        movieDisplay();
      }else{
        // Reset acive page to first page everytime user input a search key (if not empty)
        if (/^page$/g.test($('.page*').eq(0).attr("class"))) {
          for (var i = 0; i < pageAmounts; i++) {
            if (/active/g.test($('.page*').eq(i).attr("class"))) {
              $('.page*').eq(i).removeClass("active");
            }
          }

          $('.page*').eq(0).addClass("active");

          currentPage = 1;

        }
      }
    }

  });


  // Player initiated events
  $('#movie-box*').click(function(){

    if(mode===1){
      $('.trailor').attr('src', movieObj[$('#movie-box*').index(this)][2]);
    }else{
      $('.trailor').attr('src', movieObj[$('#movie-box*').index(this)][3]);
    }
    $('#player').fadeIn();
    $('.container').animate({"opacity":"0.3"},450);
    $('.jumbotron').animate({"opacity":"0.3"},450);

  });

  // Player closing button events
  $('#close-container').click(function(){
    $('.trailor').attr('src', '');
    $('#player').fadeOut();
    $('.container').animate({"opacity":"1"},450);
    $('.jumbotron').animate({"opacity":"1"},450);
  });

  // To prevent user enter "enter/return" key to conduct search action and refresh the page
  $(window).keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
  });


  // Page function

  $('.page*').on("click", function(){

    $("movie-box*").fadeOut(hideSpeed);


    currentPage = Number($(this).text());
    if (/active/g.test($(this).attr("class"))) {
      return;
    }else{
      activeToggle();
    }
    movieDisplay();
  });

  $('.prev').click(function(){

    $("movie-box*").fadeOut(hideSpeed);

    if (/active/g.test($('.page*').eq(0).attr("class"))) {
      return;
    }else {
      activeToggle();
      currentPage--;
    }

    movieDisplay();

  });
  $('.next').click(function(){

    $("movie-box*").fadeOut(hideSpeed);

    // Check if page 2 class includes "active", then break the function, since it's the max page
    // If not, meaning page 1 is active, then change active page to page 2.
    if (/active/g.test($('.page*').eq(pageAmounts-1).attr("class")) || $('.page*').eq(pageAmounts-1).css("display")==="none") {
      return;
    }else {
      activeToggle();
      currentPage++;
    }

    movieDisplay();

  });

  //initiated Movie Display Function
  movieDisplay();

  function activeToggle(){
    for (var i = 0; i < pageAmounts; i++) {
      if (/active/g.test($('.page*').eq(i).attr("class"))) {
        $('.page*').eq(i).removeClass("active");
      }else if (/^page$/g.test($('.page*').eq(i).attr("class"))) {
        $('.page*').eq(i).addClass("active");
      }
    }
  }
  function moviePageIndex(index){
    return Number($('#movie-box*').eq(index).attr("class").slice(4,5));
  }
  function movieDisplay (){

    for (var i = 0; i < movieAmounts; i++) {
      if (movieObj[i][1] >= mode) {
        if (moviePageIndex(i) !== currentPage) {
          $('#movie-box*').eq(i).fadeOut(hideSpeed);
        }else{
          $('#movie-box*').eq(i).fadeIn(displaySpeed);
        }
      }else {
        $('#movie-box*').eq(i).fadeOut(displaySpeed);
      }
    }
  }

  //Toggle trailer mode
  $(".slider.round").click(function(){

    if ($(".switch-label").text() === "* Regular trailer mode") {
      $(".switch-label").text("* Honest trailer mode");
      $(".switch-label").css("color","#F5C518");

      mode = 2;

    }else{
      $(".switch-label").text("* Regular trailer mode");
      $(".switch-label").css("color","white");

      mode = 1;
    }

    var filter = new RegExp($('.dropdown-toggle').text(),"g");
    var matchMovieList = [];
    var matchLength;

    if (keysInput === undefined) {
      keysInput = "";
    }
    // keysInput = $('.search-bar').val();
    query = new RegExp(keysInput,"gi");


    // Reset to page 1 on every click to filter the genre
    currentPage = 1;
    $('.page*').eq(1).removeClass("active");
    $('.page*').eq(0).addClass("active");

    $("movie-box*").fadeOut(hideSpeed);


    for (var i = 0; i < movieAmounts; i++) {

      // If the search text partially matched the movie title then show the movie box
      if (movieTitles[i].match(query) && movieObj[i][0].match(filter) && movieObj[i][1] >= mode) {
        matchMovieList.push($('#movie-box*').eq(i));
      }else{
        $('#movie-box*').eq(i).removeClass().addClass("col-xs-12 col-sm-6 col-lg-4");
        $('#movie-box*').eq(i).fadeOut(hideSpeed);
      }
    }

    matchLength = matchMovieList.length;
    console.log(keysInput);

    if (matchLength <= 9) {
      $('.page*').eq(1).hide(450);
    }else{
      $('.page*').eq(1).show(450);
    }


    for (var i = 0; i < matchLength; i++) {
      // Only show 9 movie boxes per page
      if (matchLength <= 9 && matchLength > 0) {
        matchMovieList[i].removeClass().addClass("page1 col-xs-12 col-sm-6 col-lg-4");
        matchMovieList[i].fadeIn(displaySpeed);
      }else{

        if (matchLength > 9 && i <= 8) {
          matchMovieList[i].removeClass().addClass("page1 col-xs-12 col-sm-6 col-lg-4");
          matchMovieList[i].fadeIn(displaySpeed);
        }else if (matchLength > 9 && i > 8){
          matchMovieList[i].removeClass().addClass("page2 col-xs-12 col-sm-6 col-lg-4");
          matchMovieList[i].fadeOut(hideSpeed);
        }else{
          // If the search text does not partially matched the movie title then hide the movie box
          matchMovieList[i].removeClass().addClass("col-xs-12 col-sm-6 col-lg-4");
          matchMovieList[i].fadeOut(hideSpeed);
        }
      }
    }

    return mode;
  });


  // Movie genre filter function
  $('.dropdown-item.type').on("click",function(){

    $('.dropdown-toggle').text($(this).text());
    // $('.search-bar').val("");

    var filter = new RegExp($('.dropdown-toggle').text(),"g");
    var matchMovieList = [];
    var matchLength;

    // keysInput = $('.search-bar').val();
    query = new RegExp(keysInput,"gi");


    // Reset to page 1 on every click to filter the genre
    currentPage = 1;
    $('.page*').eq(1).removeClass("active");
    $('.page*').eq(0).addClass("active");

    $("movie-box*").fadeOut(hideSpeed);


    for (var i = 0; i < movieAmounts; i++) {

      // If the search text partially matched the movie title then show the movie box
      if (movieTitles[i].match(query) && movieObj[i][0].match(filter) && movieObj[i][1] >= mode) {
        matchMovieList.push($('#movie-box*').eq(i));
      }else{
        $('#movie-box*').eq(i).removeClass().addClass("col-xs-12 col-sm-6 col-lg-4");
        $('#movie-box*').eq(i).fadeOut(hideSpeed);
      }
    }

    matchLength = matchMovieList.length;

    if (matchLength <= 9) {
      $('.page*').eq(1).hide(450);
    }else{
      $('.page*').eq(1).show(450);
    }


    for (var i = 0; i < matchLength; i++) {
      // Only show 9 movie boxes per page
      if (matchLength <= 9 && matchLength > 0) {
        matchMovieList[i].removeClass().addClass("page1 col-xs-12 col-sm-6 col-lg-4");
        matchMovieList[i].fadeIn(displaySpeed);
      }else{

        if (matchLength > 9 && i <= 8) {
          matchMovieList[i].removeClass().addClass("page1 col-xs-12 col-sm-6 col-lg-4");
          matchMovieList[i].fadeIn(displaySpeed);
        }else if (matchLength > 9 && i > 8){
          matchMovieList[i].removeClass().addClass("page2 col-xs-12 col-sm-6 col-lg-4");
          matchMovieList[i].fadeOut(hideSpeed);
        }else{
          // If the search text does not partially matched the movie title then hide the movie box
          matchMovieList[i].removeClass().addClass("col-xs-12 col-sm-6 col-lg-4");
          matchMovieList[i].fadeOut(hideSpeed);
        }
      }
    }

  });

});
