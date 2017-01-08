/*!
 * JPagination Plugin for jQuery
 * Copyright 2017, shuyzhou
 * Licensed under the MIT license.
*/

(function( $ ) {
  $.fn.jPagination = function(options) {
  	var self = this;
  	var defaultOption = {
  		currentPage : 1,
  		maxPage : 1,
  		item : '<a href="#" class="item" data-action="{page}">{page}</a>',
  		callback : function () {}
  	};
  	var prev = $('<a href="#" class="previous" data-action="previous">上一页</a>');
  	var next = $('<a href="#" class="next" data-action="next">下一页</a>');
  	var leftDot = $('<span class="dot" style="display:none">...</span>');
  	var rightDot = $('<span class="dot" style="display:none">...</span>');
  	var items = $('<span class="items"></span>');
  	var total;
  	var input = $('<input class="input">');
  	var confirm = $('<button class="confirm">确定</button>');

  	var isNumber = function (num) {
  		return !isNaN(num) && isFinite(num);
  	};
  	var isFunction = function(fn) {
   		return Object.prototype.toString.call(fn)=== '[object Function]';
	};
	var toCertainPage = function () {
		var page = parseInt(input.val());
  		if(isNumber(page) && page > 0 && page <= options.maxPage){
  			refreshItems(page);
	  		options.callback(page);
  		}
	}
  	options = $.extend(defaultOption,options);
  	var init = function () {
  		//保证options各参数有效性
  		if(!isNumber(options.maxPage = parseInt(options.maxPage)) || options.maxPage < 1){
  			options.maxPage = 1;
  		}
  		if(!isNumber(options.currentPage = parseInt(options.currentPage)) || options.currentPage < 1 || options.currentPage > options.maxPage){
  			options.currentPage = 1;
  		}
  		if(!isFunction(options.callback)){
  			options.callback = function () {};
  		}
  		total = $('<span class="total">共</span><span class="text">'+options.maxPage+'</span><span class="text">页,</span>');
  		//显示分页
  		self.append(prev,leftDot,items,rightDot,next,total,'<span class="text">到第</span>',input,'<span class="text">页</span>',confirm);
  		//更新分页
  		refreshItems(options.currentPage);
  		//监听点击事件
  		self.on("click","a",function (event) {
  			var action = this.dataset.action,
  				page;
  			switch (action){
  				case "previous" :
  					page = options.currentPage - 1;break;
  				case "next" :
  					page = options.currentPage + 1;break;
  				default :
  					if(!isNaN(action = parseInt(action))){
  						page = action;
  					}
  			}
  			if(page >= 1 && page <= options.maxPage && page != options.currentPage){
	  			refreshItems(page);
	  			options.callback(page);
	  		}
  			event.preventDefault();
  		});
  		input.on("keypress",function () {
  			if(event.keyCode == "13"){
  				toCertainPage();
  			}
  		});
  		 confirm.on("click",function () {
  			toCertainPage();
  		});
  	};
  	var refreshItems = function (page) {
  		var i,start,end;
  		//忽略maxPage小于page的情况
  		if(options.maxPage < page) {
  			return false;
  		}
  		//判断显示哪几页
  		if(options.maxPage <= 5) {
  			//总页数小于6页的情况下全部显示
  			displayItem(1,options.maxPage);
  		}
  		else {
  			//总页数大于5页
  			start = page - 2;
  			end = page + 2;
  			while(start < 1){
  				start++;
  				end++;
  			}
  			while(end > options.maxPage){
  				start--;
  				end--;
  			}
  			if(start > 1){
  				leftDot.css("display","inline");
  			}
  			else {
  				leftDot.css("display","none");
  			}
  			if(end < options.maxPage){
  				rightDot.css("display","inline");
  			}
  			else {
  				rightDot.css("display","none");
  			}
  			displayItem(start,end);
  		}
  		options.currentPage = page;
  		//改变样式
  		if(page == 1){
  			prev.addClass("disabled");
  		}
  		else {
  			prev.removeClass("disabled");
  		}
  		if(page == options.maxPage){
  			next.addClass("disabled");
  		}
  		else {
  			next.removeClass("disabled");
  		}
  		$('[data-action="'+page+'"]').addClass("disabled");
  	};
  	var displayItem = function (start,end) {
  		var content = '';
  		for (var i = start; i <= end; i++) {
  			content += options.item.replace(/\{page\}/g,i);
  		}
  		items.html(content);
  	};
  	init();
  };
})(jQuery);