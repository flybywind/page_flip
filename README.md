## 翻页效果 page flip

### 配置信息

* height: 指定css height
* width:  指定css width
* vh:     指定css perspective
* vo:     指定css perspective-origin
* effect_time: 指定翻页所耗时间
* effect: 指定翻页的时间函数timing function，可以自己定义

demo：

```javascript

  var book = $("#book-wrapper");
  book.flip().init({
    height: 600,
    width: 1000,
    vh: 5500,
    margin: "33px auto",
	effect: book.flipEffect.easeInOut(2000),
	//effect: book.flipEffect.linear(),
  	effect_time: 4000,  // unit ms
  });

```


### html结构

应该按照以下结构定义book，

```html
#book-wrapper
	span.prev_btn 上一页
	span.next_btn 下一页
	.book
		.page
			img.content(src="img/1.jpg")
		.page
			img.content(src="img/2.jpg")
		.page
			img.content(src="img/3.jpg")

```

其中book-wrapper定义了book，“上一页”和“下一页”的将分别安排在book左右两侧。样式可以自己修改；`.book`下面是每个`.page`，page内容由`.content`类说明。目前只支持img和p标签。复杂的div结构应该也可以，但是样式需要小心配置一下才行。

和book相关的样式定义在`css/flip.css`中，一般不需要修改。

index.jade和index_img.jade给出了一个简单示例。

### 动画效果

默认情况下是线性时间函数, 同时定义了一个`easeInOut`时间函数，可以直接使用。当然，用户也可以实现自己的时间函数。如果要设计bezier时间函数，可以使用flipEffect内置的`bezierPath`函数，然后参考`easeInOut`的方法即可实现一个新的时间曲线。
