// Check off Specific Todos by Clicking
//---------Noted Important Message Below--------------

// For future potential existing <li> tags, the original
// .on("click", function(){}) won't work, instead it only
// work on the originally existing <li> tags. Thus, using
// $('ul').on("click", "li", function(){}) to solve it.
// What the above method does is adding the click event
// to the parent <ul> tag rather than child tags <li>,
// and once we click the <li> tags inside the <ul> tag,
// the function fired!

$('ul').on('click', 'li', function(){
  $(this).toggleClass("done");
});

//Click on X to delete Todo Task
$('ul').on("click","span", function(event){
  $(this).parent().fadeOut(500, function(){
    $(this).remove();
  });

  // To prevent click events from bubbles-up triggering,
  // Since <span> tag is nested inside the <li>, <ul>,
  // <div> and <body> tags, once being clicked, it'll
  // trigger 5 times of event which is not what we're expecting!

  event.stopPropagation();
});

// Adding new todo Task via input values
$('input[type="text"]').keypress(function(event){
  // Check if the key enterred is "Enter",
  // which code is equal to 13,using the which element to check
  if (event.which === 13) {
    //Grabbibg new todo Task from the input value
    var todoTask = $(this).val();

    // Once press enter key, clear out
    // the text in the input section
    $(this).val("");

    // creat new liand add to ul
    $("ul").append("<li><span><i class='fas fa-trash-alt'></i></span> " + todoTask + "</li>")
  }
});

$('i.fa-minus-circle').on('click', function(){
  $('input[type="text"]').fadeToggle();
  $(this).toggleClass("fa-minus-circle fa-plus-circle");
})
