$(function(){
  var book = $("#book-wrapper");
  book.flip().init({
    height: 600,
    width: 1000,
  	effect_time: 4000,  // unit ms
    vh: 5500,
    margin: "33px auto",
	//effect: book.flipEffect.easeInOut(2000),
	//effect: book.flipEffect.linear(),
  });

  $(".next_btn").on("click", function() {
    book.flip().nextPage();
  })
  $(".prev_btn").on("click", function() {
    book.flip().prevPage();
  })
})
