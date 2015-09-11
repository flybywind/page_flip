$(function(){
  var book = $("#book-wrapper");
  $(".prev").on("click", function(){
    console.log("move to prev");
    book.flip().prevPage();
  })
  $(".next").on("click", function(){
    console.log("move to prev");
    book.flip().nextPage();
  })
})
