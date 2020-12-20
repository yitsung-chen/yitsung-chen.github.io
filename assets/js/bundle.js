// $('.preloader').animate({"opacity":"1"},500);

 if($(document).find("title").text() === "Yi-Tsung - Photography Work" || $(document).find("title").text() === "Yi-Tsung Chen"){
   showPage();
 }else {
   $(window).on("load", function(){
     showPage();
   });
 }
// Mobile navbar function
function openNav() {
  document.getElementById("small-width-navbar").style.width = "100%";
}
function closeNav() {
  document.getElementById("small-width-navbar").style.width = "0%";
}

function showPage() {
  $('.header-container').animate({"opacity":"1"},500);
  if ($(document).find("title").text() !== "Yi-Tsung Chen") {
    $('#project-overall-container').animate({"opacity":"1"},500);
    if ($(document).find("title").text() === "Yi-Tsung - Project Qaimo") {
      // Init data table
      var table = $('#example').DataTable( {
        "bAutoWidth": false,
        pageLength : 5,
        lengthMenu: [[5, 10, 20, 40], [5, 10, 20, 40]],
        "scrollX": true
      });
      // Redraw table width on screen resizing
      $(window).resize(function(){
        table.columns.adjust().draw();
      });
      // flip card function
      $('.chart-switch').on("click",function(){
        flip();
      });
      function flip() {
          $('.flip-card').toggleClass('flipped');
      }
    }

    $('a.section-jumper-link').bind('click', function(e) {
      e.preventDefault(); // prevent hard jump, the default behavior
      var target = $(this).attr("href"); // Set the target as variable
      // perform animated scrolling by getting top-position of target-element and set it as scroll target
      $('html, body').stop().animate({
          scrollTop: $(target).offset().top
      }, 750);
      // , function() {
          // location.hash = target; //attach the hash (#jumptarget) to the pageurl
      // });
      return false;
    });

    // Show & Hide section jumper-menu functions
    $(".section-jumper-menu-switch").on("click",function(){
      if ($(".section-jumper-wrapper").css("display") === "none") {
        $("#project-header-section").animate({"opacity": "0.7"},450);
        $("#project-content-section").animate({"opacity": "0.7"},450);
        $("#footer-container").animate({"opacity": "0.7"},450);
        $(".section-jumper-wrapper").fadeIn(450);
        $('.jumper-text').fadeOut(150);
      }else{
        $("#project-header-section").animate({"opacity": "1"},450);
        $("#project-content-section").animate({"opacity": "1"},450);
        $("#footer-container").animate({"opacity": "1"},450);
        $(".section-jumper-wrapper").fadeOut(150);
        $('.jumper-text').fadeIn(450);
      }
      $(".section-jumper-menu-switch").toggleClass("jumper-switch-on");
    });
  }else {
    // $('.navbar-container').animate({"opacity":"1"},200);
    $('#home-project-section').animate({"opacity":"1"},500);
  }

  if ($(document).find("title").text() === "Yi-Tsung Chen" || $(document).find("title").text() === "Yi-Tsung - About" || $(document).find("title").text() === "Yi-Tsung - Contact") {
    $('.projects-jumper').bind('click', function(e) {
      e.preventDefault(); // prevent hard jump, the default behavior

      var target = $(this).attr("href"); // Set the target as variable

      // perform animated scrolling by getting top-position of target-element and set it as scroll target
      $('html, body').stop().animate({
          scrollTop: $(target).offset().top
      }, 375);

      // , function() {
          // location.hash = target; //attach the hash (#jumptarget) to the pageurl
      // });
      return false;
    });
  }
  // Mobile version menu animation when the device width is < 576 px
  if (window.innerWidth < 576) {
    $('.mobile-nav-switch-container').animate({"opacity":"1"},500);
  }

    // Mobile version menu animation when the device width resized until is < 576 px
  $(window).resize(function(){
    if (window.innerWidth < 576) {
      $('.mobile-nav-switch-container').css("opacity","1");
    }else{
      $('.mobile-nav-switch-container').css("opacity","0");
    }
  });
}
