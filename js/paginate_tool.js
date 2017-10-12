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
						<li><a href="javascript:;" @click="child_change_rows(item)">{{item}}</a></li> 
					</template> 
				</ul> 
			</div> 
		</div> 
		<div class="paginate col-md-6 right"> 
			<div class="row">
				<ul class="col-md-6 pagination"> 
					<li class="start" @click="child_pre_page"><i>&lt;</i></li> 
					<template v-for="i in show_page">
						<li v-if="i == '···'" class="ellipsis" v-text="i" :key="i" ></li> 
						<li v-else v-text="i" :key="i" :class="{active: i == 1}" @click="child_change_page(i, $event)"></li>
					</template> 
					<li class="end" @click="child_next_page"><i>&gt;</i></li> 
				</ul>
				<div class="col-md-4 pagination-turn">
					跳转到
					<input onkeyup="value=value.replace(/[^0-9]/g, '')" v-bind:value="page" onblur="if(this.value == '' || this.value<=0){this.value=1}" @keyup.13="child_change_page(0, '')"/> 页 
					<label @click="child_change_page(0, '')">确定</label>
				</div>
			</div>
		</div> 
	</div>
	*/
}

var wear_html = function(){
	/*
	<paginate-tool v-on:change_rows="change_rows" v-on:change_page="change_page" v-on:pre_page="pre_page" v-on:next_page="next_page" :rows="rows" :show_page="show_page" :rows_list="rows_list" :page="page"></paginate-tool>
	*/
}

var html2 = new String(wear_html);  
html2 = html2.substring(html2.indexOf("/*") + 3, html2.lastIndexOf("*/"));

var html = new String(paginate_html);  
html = html.substring(html.indexOf("/*") + 3, html.lastIndexOf("*/"));

Vue.component('paginate-tool', {
	template: html,
	props:['rows', 'rows_list', 'show_page', 'page'],
	methods:{
		child_change_rows: function(item){
			this.$emit('change_rows', item);
		},
		child_change_page: function(i, event){
			this.$emit('change_page', i, event);
		},
		child_pre_page: function(){
			this.$emit('pre_page');
		},
		child_next_page: function(){
			this.$emit('next_page');
		}
	}
})


var paginate_vue = new Vue({
	delimiters:['((', '))'],
	el:'.bottom-tool',
	components:{
		'wear-paginate':{
			template:html2,
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
					this.show_paged();
				},
				page_total:function(){
					this.show_paged();
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
				change_rows: function(item){
					this.rows = item;
				},
				change_page:function(i, event){
					if(event == ''){
						if($('.pagination-turn input').val() > this.page_total){
							alert('输入的页码过大，请重新输入');
							$('.pagination-turn input').val(this.page);
							return;
						}
						if($('.pagination-turn input').val() == $('.pagination .active').html()) return;
						this.remove_class();				
						this.page = $('.pagination-turn input').val();	
						
					}
					else{
						if(event.target.className == 'start' ||event.target.className == 'end' || event.target.className == 'ellipsis');
						else{
							this.remove_class();
							
							this.page = event.target.innerText;
							$(event.target).attr('class', 'active');
						}
					}
				},
				pre_page:function(){
					if(this.page == 1);
					else{
						this.page = parseInt(this.page)-1;
						var active = $('.paginate li.active');
						active.removeAttr('class');
						active.prev().attr('class', 'active');
					}
				},
				next_page:function(){
					if(this.page == this.page_total);
					else{
						this.page = parseInt(this.page)+1;
						var active = $('.paginate li.active');
						active.removeAttr('class');
						active.next().attr('class', 'active');
					}
				},
				remove_class: function(){
					var start = $('.paginate .start');
					var end = $('.paginate .end');
					var ellipsis = $('.paginate .ellipsis');
							
					start.attr('class', 'start');
					end.attr('class', 'end');
					ellipsis.attr('class', 'ellipsis');
			
					$('.paginate ul li').removeAttr('class');
				},
				show_paged:function(){
					this.show_page = [];
					if(this.page_total > 10){
						if(this.page >= 5){
							if(this.page_total - this.page < 5){
								this.show_page.push(1);
								this.show_page.push("···");
								for(i=this.page_total-5;i<=this.page_total;i++){
									this.show_page.push(i);
								}
							}
							else{
								var page_end = parseInt(this.page) + 5;
								this.show_page.push(1);
								this.show_page.push("···");
								for(i=this.page-2;i<page_end-2;i++){
									this.show_page.push(i);
								}
								this.show_page.push("···");
								this.show_page.push(this.page_total);
							}
						}
						else{
							for(i=1;i<6;i++){
								this.show_page.push(i);
							}
							this.show_page.push("···");
							this.show_page.push(this.page_total);
						}
					}
					else{
						for(i=1;i<this.page_total;i++){
							this.show_page.push(i);					
						}
					}
				}
			}	
		}
	}
})

var paginate_tool = new Object();

paginate_tool.method_name = "";

paginate_tool.init = function (method_name, page_total, rows_list){
	paginate_vue.$children[0].page_total = page_total;
	this.method_name = method_name;
	if(rows_list != null && rows_list != '' ){
		if(rows_list.length != 0){
			paginate_vue.$children[0].rows_list = rows_list;
			paginate_vue.$children[0].rows = rows_list[0];
		}
	}
}

function invoke(rows, page){
	if(paginate_tool.method_name == '') return;
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
		console.info("adsf");
		e.stopPropagation();
		$(".page-select").find("ul.dropdown-menu").stop().slideUp('fast');
	})
})