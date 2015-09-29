$(function(){
  var book = $("#book-wrapper");
  book.flip().init({
    height: 600,
    width: 1000,
  	effect_time: 100,
    vh: 2500,
    margin: "33px auto"
  });

  $(".next_btn").on("click", function() {
    book.flip().nextPage();
  })
  $(".prev_btn").on("click", function() {
    book.flip().prevPage();
  })
})
