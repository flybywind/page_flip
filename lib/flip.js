(function($) {
    var _bookObj = {
        init: function(opt) {
            this.effect_time = 100;
            // first set css style
            var height = 500,
                width = 800,
                vh = 2000,
                vo = "50% 75%";
            if (!opt) {
                opt = {
                    height: height,
                    width: width,
                    "-webkit-perspective": vh,
                    "perspective": vh,
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
                width: width + "px",
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
            var pages = this.$element.find(".book .page");
            if (pages.length <= 0) {
                throw new FlipException("no page(s) set");
            }
            var pn = pages.length;
            for (var i = 0; i < pn; i++) {
                var curPage = pages.eq(i),
                    left = $("<div class=left/>"),
                    right = $("<div class=right/>");
                var left_content = curPage.find(".content").eq(0),
                    right_content = left_content.clone();
                left_content.css({
                    width: width,
                    height: height,
                });
                right_content.css({
                    width: width,
                    height: height,
                })
                left.append(left_content);
                right.append(right_content);
                curPage.append(right).append(left);
            }

            this.page_num = pn;
            this.$pages = pages;
            this.initCurrent(0);
        },
        initCurrent: function(indx) {
            if (this.current_idx) {
                throw new FlipException("init current has been set");
            }
            if (this.page_num > indx) {
                this.current_idx = indx;
                this.$pages.eq(indx).addClass("current");
                return this;
            } else {
                throw new FlipException("can't setCurrent greater than " + pages.length);
            }
        },
        prevPage: function() {
            throw new FlipException("undone");
            return this;
        },
        nextPage: function(cbk) {
            var $next = this._offset_page(1);
            if ($next) {
                this._flip_wrapper(1, this.effect_time, cbk)
            } else {
                alert("no more pages");
                throw new FlipException("no more pages");
            }
            return this;
        },
        curPage: function() {
            return this.current_idx;
        },
        _flip_wrapper: function(op, dt, cbk) {
            var step = 180 / dt;
            var this_flip = $.proxy(this._flip, this);
            var $currentpage = this._offset_page(0),
                $nextpage = this._offset_page(op),
                $cur_right = $currentpage.find(".right"),
                $cur_left = $currentpage.find(".left"),
                $next_right = $nextpage.find(".right"),
                $next_left = $nextpage.find(".left");
            this._effect_param = {
                process: 0,
                op: op,
                step: step,
                duration: dt,
                $curr: $currentpage,
                $next: $nextpage,
                $cr: $cur_right,
                $cl: $cur_left,
                $nr: $next_right,
                $nl: $next_left,
                proxy_fn: this_flip,
                end_call_back: cbk
            };
            if (op > 0) {
                $cur_left.css({
                    width: "50%",
                });
                $cur_right.addClass("active").css({
                    "transform-origin": "0% 50%",
                });
                $next_left.css($.extend(_make_rotY(180), {
                    width: "50%",
                    "transform-origin": "100% 50%",
                }));
				$nextpage.addClass("next0");
            } else if (op < 0) {
                $cur_left.css({
                    width: "50%",
                    "transform-origin": "100% 50%",
                });
                $next_right.css($.extend(_make_rotY(-180), {
                    "transform-origin": "0% 50%",
                }));
				$nextpage.addClass("next0");
            }
            var aid = requestAnimationFrame(this_flip);
            this._effect_param.animation_id = aid;
        },
        _flip: function() {
            var p = this._effect_param;
            if (p.process >= p.duration) {
                p.$curr.removeClass("current");
                _clear_style(p.$cr);
				_clear_style(p.$cl);
                p.$next.addClass("current").removeClass("next");
                _clear_style(p.$nr);
				_clear_style(p.$nl);
                if (p.cbk && (typeof p.cbk === "function")) p.cbk();
                cancelAnimationFrame(p.animation_id);
            } else {
                p.process++;
                var ang = p.step * p.process;
                if (p.op > 0) {
                    p.$nl.css(_make_rotY(180 - ang));
					if (ang > 90) {
						p.$cr.css({width: 0});
						p.$next.removeClass("next0").addClass("next");
					} else {
						p.$cr.css(_make_rotY(-ang));
					}
                } else {
                    p.$nr.css(_make_rotY(ang - 180));
					if (ang > 90) {
						p.$cl.css({width: 0});
						p.$next.removeClass("next0").addClass("next");
					} else {
						p.$cl.css(_make_rotY(ang));
					}
                }
                requestAnimationFrame(p.proxy_fn);
            }
        },
        _offset_page: function(i) {
            if (this.current_idx + i >= this.page_num) {
                return null;
            }
            return this.$pages.eq(this.current_idx + i);
        },
    }

    function _clear_style(ele) {
		ele.removeAttr("style");
    }

    function _make_rotY(r) {
        var rotY = "rotateY(" + r + "deg)";
        return {
            transform: rotY,
            webkitTransform: rotY,
        }
    }

    function FlipException(message) {
        this.message = message;
        this.name = "FlipException";
    }
    FlipException.prototype = new Error();
    FlipException.prototype.constructor = FlipException;

    $.fn.extend({
        flip: function() {
            _bookObj.$element = this;
            return _bookObj;
        }
    })
}(jQuery))
