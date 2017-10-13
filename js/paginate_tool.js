var paginate_html= function(){
	/*
	<div class="paginate-tool row "> 
		<div class="page-select col-md-6 left"> 
			<div class="dropdown"> 
				<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> 
					{{rows}} 
					<span class="caret"></span> 
				</button> 
				<ul class="dropdown-menu"> 
					<template v-for="item in rows_list">
						<li><a href="javascript:;" @click="rows = item">{{item}}</a></li> 
					</template> 
				</ul> 
			</div> 
		</div> 
		<div class="paginate col-md-6 right"> 
			<div class="row">
				<ul class="col-md-6 pagination"> 
					<li class="start" @click="change_page(index--)"><i>&lt;</i></li> 
					<template v-for="index in show_page">
						<li v-if="index == '···'" class="ellipsis" v-text="index" :key="index" ></li> 
						<li v-else v-text="index" :title="index" :key="index" :class="{active: index == page}" @click="change_page(index)"></li>
					</template> 
					<li class="end" @click="change_page(index++)"><i>&gt;</i></li> 
				</ul>
				<div class="col-md-4 pagination-turn">
					跳转到
					<input onkeyup="value=value.replace(/[^0-9]/g, '')" v-bind:value="page" onblur="if(this.value == '' || this.value<=0){this.value=1}" @keyup.13="change_page(this.value)"/> 页 
					<label @click="change_page($('pagination-turn input').val())">确定</label>
				</div>
			</div>
		</div> 
	</div>
	*/
}

var html = new String(paginate_html);  
html = html.substring(html.indexOf("/*") + 3, html.lastIndexOf("*/"));


var paginate_vue = new Vue({
	delimiters:['((', '))'],
	el:'.bottom-tool',
	components:{
		'wear-paginate':{
			template:html,
			data:function(){
				return{
					rows: 10,
					page: 1,
					page_total: 1,
					show_page: [],
					rows_list: [10, 20, 30],

				}
			},
			watch:{
				rows:function(){
					invoke(this.rows, this.page);
				},
				page:function(){
					invoke(this.rows, this.page);
				}
			},
			updated:function(){
				
				/*直接跳转页面时，使用的渲染*/
				if($('.paginate .active').length == 0){
					var lis = $('.paginate ul li');
					for(var i=0;i<lis.length;i++){
						var li = $(lis[i]);
						if(li.html() == $('.pagination-turn input').val()){
							li.attr('class', 'active');
							return;
						}
					}
				}		
			},
			methods:{
				change_page:function(index){
					console.info("asd");
					var exit = $.inArray(index, this.show_page);
					this.page = index;
					if(exit != -1);
					else if(this.page_total-5<index && index<this.page_total){
						var list = [];
						list.push(1);
						list.push("···");
						for(var i=this.page_total-5;i<=this.page_total;i++){
							list.push(i);
						}
						this.show_page = list;
					}
					else if(index>=5){
						var list = [];
						list.push(1);
						list.push("···");
						for(var i=index-2;i<index+2;i++){
							list.push(i);
						}
						list.push("···");
						list.push(this.page_total);
						this.show_page = list;
					}
				}
			}	
		}
	}
})

var paginate_tool = new Object();

paginate_tool.method_name = "";

paginate_tool.init = function (method_name, page_total, rows_list){
	this.method_name = method_name;
	var list = [];
	for(var i=1;i<=5;i++){
		list.push(i);
	}
	if(page_total>5){
		list.push('···');
		list.push(page_total);
	}
	paginate_vue.$children[0].show_page = list;
	paginate_vue.$children[0].page_total = page_total;
	paginate_vue.$children[0].change_page(1);
	
	if(rows_list != null && rows_list != '' ){
		if(rows_list.length != 0){
			paginate_vue.$children[0].rows_list = rows_list;
			paginate_vue.$children[0].rows = rows_list[0];
		}
	}
}

function invoke(rows, page){
	if(paginate_tool.method_name == '') console.info('没有传递查询函数的函数名');
	var func = eval(paginate_tool.method_name);
	new func(rows, page);
}

$(function(){
	$(".page-select").on('click', 'button.btn', function(e){
		e.stopPropagation();
		$(this).siblings('ul.dropdown-menu').stop().slideDown('fase');
	}).on('click', 'ul.dropdown-menu li', function(e){
		e.stopPropagation();
		$(this).parents('ul.dropdown-menu').stop().slideToggle('fast');
	});
	
	$('body').on('click', function(e){
		e.stopPropagation();
		$(".page-select").find("ul.dropdown-menu").stop().slideUp('fast');
	})
})