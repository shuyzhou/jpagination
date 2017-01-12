# jQuery Pagination Plugin
name:jPagination      
author:shuyzhou
# Get Started
There is a example to show how to use the plugin for pagination.     
In the HTML file, you should add only one DOM element to be the container of pagination.
```
<div id="pagination"></div>
```
Here is how to init the config of pagination.
```
$("#pagination").jPagination(['init',]{
	currentPage : 7 ,
	maxPage : 25 ,
	callback: function (page) {
		$("#result").html("change to page : "+page+"!");
	}
});
```
# License
Copyright 2017, shuyzhou       
Licensed under the MIT license.