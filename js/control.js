$(function(){
  var book = $("#book-wrapper");
  book.flip().init({
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
