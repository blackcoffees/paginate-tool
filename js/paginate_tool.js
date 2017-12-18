var paginate_html= function(){
	/*
	<div class="paginate-tool row "> 
		<div class="page-select left"> 
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
		<div class="paginate right"> 
			<div class="row">
				<div class="left">
					<div class="left paginate_total_record">总共 {{row_total}} 条记录</div>
					<div class="left">
						<ul>
							<li v-if="page == 1" class="paginate_start no_allowed"></li> 
							<li v-else class="paginate_start" @click="change_page(page-1)"></li> 
							<template v-for="index in show_page">
								<li v-if="index == '···'" class="ellipsis" v-text="index" :key="index" ></li> 
								<li v-else v-text="index" :title="index" :key="index" :class="{active: index == page}" @click="change_page(index)"></li>
							</template> 
							<li v-if="page == page_total" class="paginate_end no_allowed"><i>&gt;</i></li> 
							<li v-else class="paginate_end" @click="change_page(page+1)"></li>
						</ul>
					</div>
				</div>
				<div class="left pagination-turn">
					<span>跳转到</span>
					<input onkeyup="value=value.replace(/[^0-9]/g, '')" v-bind:value="page" onblur="if(this.value == '' || this.value<=0){this.value=1}" @keyup.13="input_page"/> 页 
					<label @click="input_page">确定</label>
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
					row_total: 0
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
			methods:{
				input_page:function(){
					this.change_page($('.pagination-turn input').val());
				},
				change_page:function(index){
					if(index > this.page_total && index != 1){
						alert('输入的页码超过了最大页码，请重新输入');
						$('.pagination-turn input').val(this.page);
						return;
					}
					index = parseInt(index);
					this.page = index
					var list = [];					
					
					if(this.page_total <= 5){
						for(i=1;i<=this.page_total;i++)
							list.push(i);
						this.show_page = list;
						return;
					}
					
					if(index < 5){
						for(i=1;i<=5;i++){
							list.push(i);
						}
						list.push('···');
						list.push(this.page_total);						
					}
					else if(index > this.page_total-4){
						list.push(1);
						list.push('···');
						for(i=this.page_total-4;i<=this.page_total;i++){
							list.push(i);
						}
					}
					else if(index >= 5){
						list.push(1);
						list.push('···');
						for(i=index-2;i<=index+2;i++){
							list.push(i);
						}
						list.push('···');
						list.push(this.page_total);
					}
					this.show_page = list;
				}
			}	
		}
	}
})

var paginate_tool = new Object();

paginate_tool.method_name = "";

paginate_tool.init = function (method_name, page_total, row_total, rows_list){
	this.method_name = method_name;
	paginate_vue.$children[0].page_total = page_total;
	paginate_vue.$children[0].row_total = row_total;
	
	if(paginate_vue.$children[0].page == 1)
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