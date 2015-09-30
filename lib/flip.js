(function($) {
    var _bookObj = {
        init: function(opt) {
            this.effect_time = 100;
            this.effect = this.flipEffect.linear();
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
				if (opt.effect_time) {
					this.effect_time = opt.effect_time;
				}
				if (opt.effect) {
					this.effect = opt.effect;
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
        prevPage: function(cbk) {
            var $next = this._offset_page(-1);
            if ($next) {
                this._flip_wrapper(-1, this.effect_time, cbk)
            } else {
                alert("no more pages");
                throw new FlipException("no more pages");
            }
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
        _flip_wrapper: function(op, dt, cbk) {
            var this_flip = $.proxy(this._flip, this);
            var $currentpage = this._offset_page(0),
                $nextpage = this._offset_page(op),
                $cur_right = $currentpage.find(".right"),
                $cur_left = $currentpage.find(".left"),
                $next_right = $nextpage.find(".right"),
                $next_left = $nextpage.find(".left");
            this._effect_param = {
                op: op,
				start: null,
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
				$next_left.css({
					width: "50%",
				});
                $next_right.css($.extend(_make_rotY(-180), {
                    "transform-origin": "0% 50%",
                }));
                $cur_left.css({
                    width: "50%",
                    "transform-origin": "100% 50%",
                });
				$nextpage.addClass("next0");
            }
            var aid = requestAnimationFrame(this_flip);
            this._effect_param.animation_id = aid;
        },
        _flip: function(time) {
            var p = this._effect_param;
			if (p.start == null) {
				p.start = time;
			}
			var t = time - p.start;
            if (t >= p.duration) {
				this.current_idx += p.op;
                p.$curr.removeClass("current");
                _clear_style(p.$cr.removeClass("active"));
				_clear_style(p.$cl.removeClass("active"));
                p.$next.addClass("current").removeClass("next");
                _clear_style(p.$nr.removeClass("active"));
				_clear_style(p.$nl.removeClass("active"));
                if (p.cbk && (typeof p.cbk === "function")) p.cbk();
                cancelAnimationFrame(p.animation_id);
            } else {
                var ang = this.effect(t, p.duration) * 180;
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
            if (this.current_idx + i >= this.page_num || this.current_idx + i < 0) {
                return null;
            }
            return this.$pages.eq(this.current_idx + i);
        },
		flipEffect: {
			bezierPath: function(n, px, py, qx, qy) {
				if (arguments.length < 5) {
					throw new FlipException("not enough parameters for bezier curve!");
				}

				var s = 1/n,
					bx = [],
					by = [];
				var bezier = function(t, p, q) {
					return 3 * Math.pow(1-t, 2) * t * p + 3 * (1-t) * Math.pow(t, 2) * q + Math.pow(t, 3);	
				};
				for (var i = 0; i < n; i++) {
					var t = i*s;
					bx.push(bezier(t, px, qx));
					by.push(bezier(t, py, qy));
				}
				return {
					pathX: bx,
					pathY: by,
				}
			},
			linear: function() {
				return function(t, duration) {
					if (duration == null) {
						return ;
					}
					if (duration <= 0) {
						throw new FlipException("effect duration must longer than 0");
					}
					if (t > duration) {
						return 1;
					}
					return t/duration;
				}
			},
			easeInOut: function(num) {
				if (num == null) {
					num = 1000;
				}
				var bezier = this.bezierPath(num, 0.42, 0, 0.58, 1);
				var n = 0;
				return function(t, duration) {
					if (duration == null) {
						return ;
					}
					if (duration <= 0) {
						throw new FlipException("effect duration must longer than 0");
					}
					var normT = t/duration;
					// reset n to zero
					if (t < 100) n = 0;
					for (var i = n; i < num; i++) {
						if (bezier.pathX[i] >= normT) {
							n = i;
							return bezier.pathY[i]
						}
					}
					n = i;
					return bezier.pathY[num];
				}
			}
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
        },
		flipEffect: _bookObj.flipEffect,
    })
}(jQuery))
