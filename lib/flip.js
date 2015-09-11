(function($){
  var _bookObj = {
    init: function(){
      console.log("init book: " + (typeof this.$element));
    },
    prevPage: function(){
      var current = this.curPage().children("p").text();
      var prev = this.curPage()
        .prevAll(".page").eq(0)
        .children("p").text();

      console.log("current: " + current + ", prev: " + prev);
      return this;
    },
    nextPage: function(){
      var current = this.curPage().children("p").text();
      var next = this.curPage()
        .nextAll(".page").eq(0)
        .children("p").text();
      console.log("current: " + current + ", next: " + next);
      return this;
    },
    curPage: function() {
      return this.$element.find(".current");
    }
  }
  $.fn.extend({
    flip: function(){
      _bookObj.$element = this;
      return _bookObj;
    }
  })
}(jQuery))
