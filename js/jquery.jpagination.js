/*!
 * A jQuery Pagination Plugin
 * Copyright 2017, shuyzhou
 * Licensed under the MIT license.
*/
(function($) {
    var JPagination = function() {
        this.prev = $('<a href="#" class="previous" data-action="previous">上一页</a>');
        this.next = $('<a href="#" class="next" data-action="next">下一页</a>');
        this.leftDot = $('<span class="dot" style="display:none">...</span>');
        this.rightDot = $('<span class="dot" style="display:none">...</span>');
        this.items = $('<span class="items"></span>');
        this.input = $('<input class="input">');
        this.confirm = $('<button class="confirm">确定</button>');
    }
    JPagination.prototype = {
        constructure: JPagination,
        isNumber: function(num) {
            return ! isNaN(num) && isFinite(num);
        },
        isFunction: function(fn) {
            return Object.prototype.toString.call(fn) === '[object Function]';
        },
        toCertainPage: function() {
            var page = parseInt(this.input.val());
            if (this.isNumber(page) && page > 0 && page <= this.options.maxPage) {
                this.options.currentPage = page;
                this.refreshItems();
                this.options.callback(page);
            }
        },
        init: function(ele) {
            var self = this;
            //validation for options
            if (!this.isNumber(this.options.maxPage = parseInt(this.options.maxPage)) || this.options.maxPage < 1) {
                this.options.maxPage = 1;
            }
            if (!this.isNumber(this.options.currentPage = parseInt(this.options.currentPage)) || this.options.currentPage < 1 || this.options.currentPage > this.options.maxPage) {
                this.options.currentPage = 1;
            }
            if (!this.isFunction(this.options.callback)) {
                this.options.callback = function() {};
            }
            this.total = $('<span class="text"></span>');
            //init container
            this.clear(ele);
            ele.append(this.prev, this.leftDot, this.items, this.rightDot, this.next, '<span class="total">共</span>', this.total, '<span class="text">页,</span><span class="text">到第</span>', this.input, '<span class="text">页</span>', this.confirm);
            //refresh pages
            this.refreshItems();
            //handlers
            ele.on("click", "a",function(event) {
                var action = this.dataset.action,
                page;
                switch (action) {
                case "previous":
                    page = self.options.currentPage - 1;
                    break;
                case "next":
                    page = self.options.currentPage + 1;
                    break;
                default:
                    if (!isNaN(action = parseInt(action))) {
                        page = action;
                    }
                }
                if (page >= 1 && page <= self.options.maxPage && page != self.options.currentPage) {
                    self.options.currentPage = page;
                    self.refreshItems();
                    self.options.callback(page);
                }
                event.preventDefault();
            });
            this.input.on("keypress",function() {
                if (event.keyCode == "13") {
                    self.toCertainPage();
                }
            });
            this.confirm.on("click",function() {
                self.toCertainPage();
            });
        },
        refreshItems: function() {
            var i, start, end, page = this.options.currentPage;
            this.total.html(this.options.maxPage);
            //only display five pages
            if (this.options.maxPage <= 5) {
                this.displayItem(1, this.options.maxPage);
            } else {
                start = page - 2;
                end = page + 2;
                while (start < 1) {
                    start++;
                    end++;
                }
                while (end > this.options.maxPage) {
                    start--;
                    end--;
                }
                if (start > 1) {
                    this.leftDot.css("display", "inline");
                } else {
                    this.leftDot.css("display", "none");
                }
                if (end < this.options.maxPage) {
                    this.rightDot.css("display", "inline");
                } else {
                    this.rightDot.css("display", "none");
                }
                this.displayItem(start, end);
            }
            this.options.currentPage = page;
            //change style
            if (page == 1) {
                this.prev.addClass("disabled");
            } else {
                this.prev.removeClass("disabled");
            }
            if (page == this.options.maxPage) {
                this.next.addClass("disabled");
            } else {
                this.next.removeClass("disabled");
            }
            $('[data-action="' + page + '"]').addClass("disabled");
        },
        displayItem: function(start, end) {
            var content = '';
            for (var i = start; i <= end; i++) {
                content += this.options.item.replace(/\{page\}/g, i);
            }
            this.items.html(content);
        },
        clear: function(ele) {
            ele.empty();
            ele.off('click', 'a');
        }
    };
    //instance for pagination
    var jPagination = new JPagination();
    var methods = {
        init: function(options) {
            var ele = this;
            var defaultOption = {
                currentPage: 1,
                maxPage: 1,
                item: '<a href="#" class="item" data-action="{page}">{page}</a>',
                callback: function() {}
            };
            jPagination.options = $.extend(defaultOption, options);
            jPagination.init(ele);
        },
        set: function(options) {
            jPagination.options = $.extend(jPagination.options, options);
            jPagination.refreshItems();
        }
    };
    //jQuery plugin facade
    $.fn.jPagination = function(method, options) {
        if (typeof options === 'object') {
            if (method && methods[method]) {
                methods[method].call(this, options);
                return;
            }
        } else if (typeof method === 'object') {
            methods.init.call(this, method);
            return;
        }
        $.error('Method ' + method + ' does not exist on jquery.jPagination');
    };
})(jQuery);