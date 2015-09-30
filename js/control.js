$(function(){
  var book = $("#book-wrapper");
  book.flip().init({
    height: 600,
    width: 1000,
  	effect_time: 2000,  // 2s
    vh: 5500,
    margin: "33px auto",
	effect: book.flipEffect.linear(),
  });

  $(".next_btn").on("click", function() {
    book.flip().nextPage();
  })
  $(".prev_btn").on("click", function() {
    book.flip().prevPage();
  })
})
