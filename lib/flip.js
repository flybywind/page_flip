(function($){
  var _bookObj = {
    init: function(opt){
      this.effect_time = 2000;
      // first set css style
      var height = 800,
          width  = 500,
          vh = 2000,
          vo = "50% 75%";
      if (!opt) {
        opt = {
          height: height,
          width:  width,
          "-webkit-perspective" : vh,
          "perspective" : vh,
          "-webkit-perspective-origin": vo,
                  perspectiveOrigin: vo,
        }
      } else {
        if (opt.height) {
          height = opt.height;
        }
        if (opt.width) {
          width = opt.width;
        }
        if (opt.perspective) {
          vh = opt.perspective;
        }
        if (opt.perspectiveOrigin) {
          vo = opt.perspectiveOrigin;
        }
      }
      var css = $.extend(opt, {
        position: "relative",
        "-webkit-transform-style": "preserve-3d",
                "transform-style": "preserve-3d",
        height: height + "px",
        width:  width + "px",
        "-webkit-perspective": vh + "px",
                "perspective": vh + "px",
        "-webkit-perspective-origin": vo,
                "perspective-origin": vo,
      });
      this.$element.css(css);

      // set turning faces:
      var pages = this.$element.find(".book .page");
      if (pages.length <= 0) {
        throw new FlipException("no page(s) set");
      }
      var curPage = pages.eq(0),
          pn = pages.length;

      for (var i = 1; i < pn; i++) {
          var tf = $("<div class='front'/>"),
            tb = $("<div class='back'/>");
          var nextPage = pages.eq(i);
          // 这样做会把原来page中的内容情况，相当于mv！！
          // tf.append(curPage.children().eq(0));
          // tb.append(nextPage.children().eq(0));
          tf.append(curPage.children().eq(0).clone());
          tb.append(nextPage.children().eq(0).clone());
          curPage.after(tb).after(tf);
          curPage = nextPage;
      }
      var tf = $("<div class='front'/>");
      tf.append(curPage.children().eq(0).clone());
      curPage.after(tf);
      this.page_num = pn;
      this.initCurrent(0);
    },
    initCurrent: function(indx) {
      if (this.page_num > indx) {
        this.$current = this.$element.find(".page").eq(indx)
          .addClass("current");
        this._set_front_back();
        return this;
      }else {
        throw new FlipException("can't setCurrent greater than " + pages.length);
      }
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
      var $current = this.curPage(),
          $front = this.$front,
          $back = this.$back;
      if ($current) {
        this.flipNext(this.effect_time, function(){
          $current.removeClass("active");
          this.$current = $current.nextAll(".page").eq(0);
          this._set_front_back();
        })
      } else {
        alert("no more pages");
        throw new FlipException("no more pages");
      }
      return this;
    },
    _set_front_back: function() {
      this.$front = this.$current.nextAll(".front").eq(0)
        .addClass("turning");
      this.$back = this.$current.nextAll(".back").eq(0)
        .addClass("turning");
    },
    curPage: function() {
      return this.$current;
    }
  }
  function FlipException(message) {
    this.message = message;
    this.name = "FlipException";
  }
  $.fn.extend({
    flip: function(){
      _bookObj.$element = this;
      return _bookObj;
    }
  })
}(jQuery))
