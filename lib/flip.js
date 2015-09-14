(function($){
  var _bookObj = {
    init: function(opt){
      this.effect_time = 100;
      // first set css style
      var height = 500,
          width  = 800,
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
        if (opt.vh) {
          vh = opt.vh;
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
      // set prev and next button
      var prev = this.$element.find(".prev_btn").eq(0),
          next = this.$element.find(".next_btn").eq(0);
      if (prev) {
        prev.css({
          position: "absolute",
          top: 0,
          left: -prev.outerWidth(),
        });
      }
      if (next) {
        next.css({
          position: "absolute",
          top: 0,
          right: -next.outerWidth(),
        });
      }
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
      if (this.$current) {
        throw new FlipException("init current has been set");
      }
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
      throw new FlipException("undone");
      return this;
    },
    nextPage: function(cbk){
      var $back = this.$back;
      if ($back) {
        this._flip_wrapper("next", this.effect_time, cbk)
      } else {
        alert("no more pages");
        throw new FlipException("no more pages");
      }
      return this;
    },
    curPage: function() {
      return this.$current;
    },
    _move_current: function(op) {
      if (!op ||
          (op != "next" &&
          op != "prev")) {
          throw new FlipException("unsupported move action");
      }
      if (!this.$current) {
        throw new FlipException("cant move until current set");
      }
      var old = this.$current,
          nextpage = old[op + "All"](".page");
      if (nextpage.length > 0) {
        old.removeClass("current");
        _clear_transform(old);
        this.$current = nextpage.eq(0);
        this.$current.addClass("current");
        _clear_transform(this.$current);
        return this;
      }
    },
    _set_front_back: function() {
      if (this.$front) {
        this.$front.removeClass("turning");
        _clear_transform(this.$front);
      }
      this.$front = this.$current.nextAll(".front").eq(0)
        .addClass("turning")

      if (this.$back) {
        this.$back.removeClass("turning");
        _clear_transform(this.$back);
      }
      this.$back = this.$current.nextAll(".back").eq(0)
        .addClass("turning");
    },
    _flip_wrapper: function(op, dt, cbk) {
      var step = 180/dt;
      var this_flip = $.proxy(this._flip, this);
      this._effect_param = {
        process: 0,
        op: op,
        step: step,
        duration: dt,
        proxy_fn: this_flip,
        end_call_back: cbk
      };
      var aid = requestAnimationFrame(this_flip);
      this._effect_param.animation_id = aid;
    },
    _flip: function(){
      var p = this._effect_param;
      if (p.process >= p.duration) {
        this._move_current(p.op);
        this._set_front_back();
        if (p.cbk && (typeof p.cbk === "function")) p.cbk();
        cancelAnimationFrame(p.animation_id);
      } else {
        p.process++;
        var ang = p.step * p.process;
        var front_css = _make_transform(-ang, 1),
            back_css = _make_transform(180-ang, 0);
        if (ang > 90) {
          front_css.transform = front_css.webkitTransform = "";
          front_css.zIndex = 0;
          if (ang > 170) {
            this.$current.css({zIndex: 0});
            if (p.next_tiny_angle > 0) {
              p.next_tiny_angle = 180 - ang;
              back_css = _make_transform(180-ang, 0, 1);
              var next_css = _make_transform(-p.next_tiny_angle, 1, 1);
              var next_page = this.$current.nextAll(".page").eq(0);
              next_page.css(next_css);
            }
          }
        } else {
          back_css.transform = back_css.webkitTransform = "";
          if (ang > 6) {
            if (!p.next_tiny_angle) {
              p.next_tiny_angle = ang - 1;
              var css_next = _make_transform(-p.next_tiny_angle, 0)
              var next_page = this.$current.nextAll(".page").eq(0);
              next_page.css(css_next);
            }
          }
        }
        this.$front.css(front_css);
        this.$back.css(back_css);
        requestAnimationFrame(p.proxy_fn);
      }
    },
  }

  function _clear_transform(ele) {
    ele.css({
      webkitTransform: "",
      transform: "",
      zIndex: "",
    });
  }
  function _make_transform(r, z, zloc) {
    var rotY = "rotateY(" + r + "deg)";
    if (zloc) {
      rotY += " translateZ(" + zloc + "px)";
    }
    return {
      transform: rotY,
      webkitTransform: rotY,
      zIndex: z,
    }
  }

  function FlipException(message) {
    this.message = message;
    this.name = "FlipException";
  }
  FlipException.prototype = new Error();
  FlipException.prototype.constructor = FlipException;

  $.fn.extend({
    flip: function(){
      _bookObj.$element = this;
      return _bookObj;
    }
  })
}(jQuery))
