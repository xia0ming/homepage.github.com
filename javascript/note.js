jQuery(document).ready(function($) {
	//笔记数据
		//笔记本初始数据
	var data_notebook = jQuery.parseJSON(store.get("data_notebook"));
	if(!data_notebook)
		data_notebook = [
		{
			notebook_name: "笔记本一",
			create_time: "2016-05-03 11:00",
			update_time: "2016-05-03 11:00",
			notes_number: "2"
		},{
			notebook_name: "笔记本二",
			create_time: "2016-04-04 11:00",
			update_time: "2016-05-04 11:00",
			notes_number: "2"
		}
	]
		//笔记初始数据
	var data_notes = jQuery.parseJSON(store.get("data_notes"));
	if(!data_notes)
		data_notes = {
		"笔记本一": [{
			notes_title: "笔记本一 笔记1",
			notes_content: "笔记本一 笔记1",
			notes_date: "20,July,",
			create_time: "2016-05-05 11:00",
			update_time: "2016-05-05 11:00",
			notes_week: "Sunday",
			notes_fuzzy: "two weeks ago"
		}, {
			notes_title: "笔记本一 笔记2",
			notes_content: "笔记本一 笔记2",
			notes_date: "20,July,",
			create_time: "2016-04-04 11:00",
			update_time: "2016-04-04 11:00",
			notes_week: "Sunday",
			notes_fuzzy: "two weeks ago"
		}],
		"笔记本二": [{
			notes_title: "笔记本二 笔记1",
			notes_content: "笔记本二 笔记1",
			notes_date: "20,July,",
			create_time: "2016-05-03 11:00",
			update_time: "2016-05-03 11:00",
			notes_week: "Sunday",
			notes_fuzzy: "two weeks ago"
		},{
			notes_title: "笔记本二 笔记2",
			notes_content: "笔记本二 笔记2",
			notes_date: "20,July,",
			create_time: "2016-05-04 11:00",
			update_time: "2016-05-04 11:00",
			notes_week: "Sunday",
			notes_fuzzy: "two weeks ago"
		}]
	}
	//获取每个笔记本的笔记数量和笔记本名称
	var notes_numbers = new Array();
	var notebooks_titles = new Array();
	var notebooks_number = 0;
	function notesNumbersAndTitles(){
		notebooks_number = 0;
		for(var item in data_notes){
			notebooks_titles[notebooks_number] = item;
			notes_numbers[notebooks_number] = data_notes[item].length;
			notebooks_number = notebooks_number + 1;
		}
	}
	notesNumbersAndTitles();

	//初始化显示第一个笔记本的笔记数量
	$("div.counter .number").html("<span>" + notes_numbers[0] + "</span>" + " notes");

	//文本编辑器
	var ue = UE.getEditor('editor',{
		 autoHeightEnabled: true,
		 initialFrameHeight: 200
	});
	//渲染完成后再用
	ue.addListener("ready", function () {
		fillEditArea();
	});

	//笔记点击
	$("ul.notes_list").on('click', 'li', function(event) {
		if ($(event.target).attr('class') == 'note_delete') return;
		$(this).addClass('active').siblings('li').removeClass('active');

		var note_index = $(this).index();
		var notebook_title = $("div.chosen_notebook").text();
		var note_title = data_notes[notebook_title][note_index].notes_title;
		var note_content = data_notes[notebook_title][note_index].notes_content;

		$("#title_input input").val(note_title);
		ue.setContent(note_content);
	});
	//笔记删除
	$(".notes_list").on('click', '.note_delete', function(event) {
		var notes_title_ = $(this).prev('.note_title').text();
		var book_title = $('.chosen_notebook').text();
		console.log(data_notes[book_title]);
		for(var item in data_notes[book_title]){
				 console.log(item);
			if(notes_title_ == item.notes_title){
			}
		}
		// displayNotes(book_title);
	});
	//笔记编辑区默认显示当前笔记本的第一个笔记
	function fillEditArea(notebook_index,note_index){
		var i = notebook_index ? notebook_index : 0;
		var j = note_index ? note_index : 0;
		var _notes = data_notes[notebooks_titles[i]][j].notes_content;
		//显示标题
		$("#title_input > input").val(data_notes[notebooks_titles[i]][j].notes_title);
		//显示内容
			//用延时等文本编辑器加载完
		// setTimeout(function(){
			ue.setContent(_notes);
		// },100)
	}

	//新建笔记本
	var new_notebook = {
			notebook_name: "",
			create_time: "",
			update_time: "",
			notes_number: "0"
		};
	var new_notes = [{
		notes_title: "",
		notes_content: "",
		notes_date: "",
		create_time: "",
		update_time: "",
		notes_week: "",
		notes_fuzzy: ""
	}]
	//保存notebook或者notes的json数据到localstorage
	function saveJsonNote(type){
		if(type == data_notebook){
			var str_data_notebook = JSON.stringify(data_notebook); 
			store.set('data_notebook', str_data_notebook);
		}else if(type == data_notes){
			var str_data_notes = JSON.stringify(data_notes); 
			store.set('data_notes', str_data_notes);
		}
	}
	//展示笔记函数
	function displayNotes(notebook){
		//先清空再显示
		$("ul.notes_list").empty();

		var notes_json = data_notes[notebook];
		var notes_len = data_notes[notebook].length;
		for(var i = 0;i < notes_len;i++){
			//建立新节点
			var creat_date = timeWithoutClock(notes_json[i].create_time);
			var notes_li = $("<li></li>");
			//第一个默认选中
			if(i == 0){
				notes_li.attr('class', 'active');
			}
			var notes_li_html = 
				'<div class="note_title_box">' +
					'<p class="note_title">' + notes_json[i].notes_title + '</p>' +
					'<div class="note_delete"></div>' +
				'</div>' +
				'<div class="note_time">' +
					'<span class="note_date">' + getTheDate(creat_date) +
					', ' + getFullMonth(creat_date) + ', ' + '</span>' + 
					'<span class="note_week">' + getWeekday(creat_date) + '</span>' + 
					'<span class="note_fuzzy">' + getFuzzyTime(creat_date) +'</span>' + 
				'</div>' + 
				//预览卡片中只显示纯文本 去除标签和元素
				'<div class="note_content">' + notes_json[i].notes_content.replace(/<\/?[^>]*>/g,'') + '</div>' +
				'<div class="note_slide"></div>'
			notes_li.html(notes_li_html);
			notes_li.appendTo($("ul.notes_list"));
		}
	}

	//展示选择的笔记本和对应笔记
	function displayNotebook(index){
		var i = index ? index : 0;
		//默认展示第一个笔记本的笔记
		displayNotes(notebooks_titles[i]);
		//默认选择第一个笔记本
		$("div.chosen_notebook").text(notebooks_titles[i]);
	}
	displayNotebook();

	//更多笔记本
	function moreNotebook(){
		notesNumbersAndTitles();
			//先删除 后添加
		$("ul.notebook_list li.search").siblings('li').remove();

		var notebook_len = data_notebook.length;
		for(var i = 0;i < notebook_len; i++){
			var notebook_li = $("<li></li>");
			notebook_li.html(data_notebook[i].notebook_name);
			notebook_li.appendTo($("ul.notebook_list"));
		}
			//更多笔记本从左滑入定义延时
		for(var i = 0;i <= notebook_len; i++){
			$(".notebook_list li").eq(i).css('animation-delay', i*30+'ms');
		}
			//先插入元素后 在定义滚动条 不然不能按结构正确插入
		$("ul.notebook_list").mCustomScrollbar({
			theme:"minimal-dark"
		});
	}
	moreNotebook();
	//更多笔记本展示
	var display_more_notebook = false;
	$(".notebook_more").click(function(event) {
		if(!display_more_notebook){
			$(this).find('img').attr('src', 'images/arrow-up.svg');
			$(".notebook_list").css('display', 'block').addClass('inFromLeft');
			display_more_notebook = true;
		}else{
			$(this).find('img').attr('src', 'images/arrow-down.svg');
			$(".notebook_list").css('display', 'none').removeClass('inFromLeft');
			display_more_notebook = false;
		}
	});
	//保存正在编辑的笔记
	function saveEdit(){
		//编辑的笔记标题
		var edit_title = $("#title_input > input").val();

		//编辑后的笔记内容
		var current_edit = jQuery.parseJSON(store.get("ueditor_preference"));
		var current_edit_title = '';//title在不同的环境下可能不一样
		//现在是这样的 {"http_localhost_8088_XM_editor-drafts-data":"<p>正在编辑的笔记内容</p>"}
		for(var item in current_edit){
			current_edit_title = item;
		}
		//取出正在编辑的笔记内容
		var edit_content = current_edit[current_edit_title];

		//笔记本标题
		var notebook_title = $("div.chosen_notebook").text();
		//笔记的位置
		var note_name = $(".notes_list li.active").find('p.note_title').text();
		var note_index = 0;
		for(var i = 0;i < data_notes[notebook_title].length;i++){
			if(data_notes[notebook_title][i].notes_title == note_name)
				note_index = i;
		}
		
		//保存更改到json
			//保存笔记
		var _update = getTodayFormatDate();
		var _fuzzy = getFuzzyTime(_update);

		var this_note = data_notes[notebook_title][note_index];
		this_note.notes_title = edit_title;
		this_note.notes_content = edit_content;
		this_note.update_time = _update;
		this_note.notes_fuzzy = _fuzzy;
		//更新所属笔记本的更新时间
		for(var item in data_notebook){
			if(item.notebook_name == notebook_title){
				item.update_time = getTodayFormatDate() + ' ' + getTimeHM();
			}
		}

		saveJsonNote(data_notebook);
		saveJsonNote(data_notes);

		//更新预览卡片
		$(".notes_list li").eq(note_index).find('p.note_title').text(edit_title);
		$(".notes_list li").eq(note_index).find('div.note_content').text(edit_content.replace(/<\/?[^>]*>/g,''));
	}
	window.save_edit = setInterval(saveEdit,3000);

	//点击选择笔记本
	$(".notebook_list").on('click', 'li', function(event) {
		// var li_index = $(this).index();
		// displayNotebook(li_index-1);
		// if(li_index){
		// 	$(".notebook_more").find('img').attr('src', 'images/arrow-down.svg');
		// 	$(".notebook_list").css('display', 'none').removeClass('inFromLeft');
		// 	display_more_notebook = false;
		// }
		// fillEditArea(li_index-1,0);

		var li_index = $(this).index();
		if(!li_index) return;
		//不使用index来取笔记本 使用笔记本名称
		clearInterval(window.save_edit);
		var notebookName =  $(this).text();
		displayNotesByNotebookName(notebookName);
		window.save_edit = setInterval(saveEdit,3000);
	});
	//根据创建时间或者更新时间排序
	function sortByCreatedOrUpdated(data_JSON,method){
		//笔记本排序
		if(data_JSON == data_notebook){
			if(method == "created"){
				data_JSON.sort(function(a,b){
					//创建时间从今天向过去
					return b.create_time.replace(/[-: ]/g,'') - a.create_time.replace(/[-: ]/g,'');
				})
			}else if(method == "updated"){
				data_JSON.sort(function(a,b){
					//更新时间从今天向过去
					return b.update_time.replace(/[-: ]/g,'') - a.update_time.replace(/[-: ]/g,'');
				})
			}
		//每个笔记本的笔记排序
		}else if(data_JSON == data_notes){
			if(method == "created"){
				for(var item in data_notes){
					data_notes[item].sort(function(a,b){
						//创建时间从今天向过去
						return b.create_time.replace(/[-: ]/g,'') - a.create_time.replace(/[-: ]/g,'');
					})
				}
			}else if(method == "updated"){
				for(var item in data_notes){
					data_notes[item].sort(function(a,b){
						//更新时间从今天向过去
						return b.update_time.replace(/[-: ]/g,'') - a.update_time.replace(/[-: ]/g,'');
					})
				}
			}
		}
		saveJsonNote(data_notebook);
		saveJsonNote(data_notes);
	}
		//刷新时都按照updated排序 保存 显示
	sortByCreatedOrUpdated(data_notebook,"updated");
	sortByCreatedOrUpdated(data_notes,"updated");
	
	//排序方式
	var notes_order = "Updated";
	var notebooks_order = "Updated";
	$(".order_option_box div.order_options span").click(function(event) {
		//点击交换排序方式
		var active_order = $(".order_option_box > div > span").text();
		var this_order = $(this).text();
		$(this).text(active_order);
		$(".order_option_box > div > span").text(this_order);

		//笔记本排序方式
		if(display_notebook){
			//记录排序方式并 排序然后存储
			notebooks_order = this_order;
			sortByCreatedOrUpdated(data_notebook,notebooks_order);
			allNotebook(data_notebook);
		//笔记排序方式
		}else{
			notes_order = this_order;
			sortByCreatedOrUpdated(data_notes,notes_order);
		}
	});
	//显示排序方式
	function displayOrder(display_notebook){
		if(display_notebook == true){
			$(".order_option_box > div > span.order_option").text(notebooks_order);
			if (notebooks_order == "Updated") {
				$(".order_option_box div.order_options span").text("Created");
			}else{
				$(".order_option_box div.order_options span").text("Updated");
			}
		}else{
			$(".order_option_box > div > span").text(notes_order);
			if (notes_order == "Updated") {
				$(".order_option_box div.order_options span").text("Created");
			}else{
				$(".order_option_box div.order_options span").text("Updated");
			}
		}
	}
	//生成笔记本卡片函数
	function allNotebook(notebook){
		var notebook_len = notebook.length;
		$('.notebooks_list').empty();
		notesNumbersAndTitles();
		for(var i = 0;i < notebook_len;i++){
			var notebook_li = $("<li></li>");
			var notebook_li_html = '<p class="notebooks_title">'+
										notebook[i].notebook_name +
									'</p>'+
									'<p class="notes_number">'+
										'<span class="notes_number">'+
										data_notes[notebook[i].notebook_name].length+'</span>'+'条笔记'+
									'</p>'+
									'<div class="notebook_delete"></div>';
			notebook_li.html(notebook_li_html);
			notebook_li.appendTo($('.notebooks_list'));
		}
	}
	//显示所有笔记本
	var display_notebook = false;
	var hidden = null;
	var showup = null;
	//显示笔记本 隐藏笔记
	function showNotebook(){
		display_notebook = true;

		clearTimeout(hidden);
		clearTimeout(showup);
		$(".notes_list_box").removeClass('animated fadeOutLeft');
		$(".notebooks").removeClass('animated bounceInRight');
		//按钮替换为显示笔记
		$(".display_notebook").find('img').attr({
			src: 'images/notes.svg',
			title: 'Notes'
		});
		//显示笔记本 隐藏笔记
			//笔记先消失 后隐藏
		$(".notes_list_box").addClass('fadeOutRight');
		hidden = setTimeout(function() {
			$(".notes_list_box").css('display', 'none');
			clearTimeout(hidden);
		}, 750);
			//笔记本先显示 后移入
		showup = setTimeout(function() {
			$(".notebooks").css('display', 'block');
			$(".notebooks").addClass('bounceInLeft');
			clearTimeout(showup);
		}, 200);
	}
	//显示笔记 隐藏笔记本
	function hideNotebook(){
		display_notebook = false;

		clearTimeout(hidden);
		clearTimeout(showup);
		$(".notes_list_box").removeClass('fadeOutRight');
		$(".notebooks").removeClass('bounceInLeft');
		//按钮替换为显示笔记本
		$(".display_notebook").find('img').attr({
			src: 'images/notebook.svg',
			title: 'All notebooks'
		});
		//显示笔记 隐藏笔记本
			//笔记本先消失 后隐藏
		$(".notebooks").addClass('animated fadeOutLeft');
		hidden = setTimeout(function() {
			$(".notebooks").css('display', 'none');
			clearTimeout(hidden);
		}, 750);
			//笔记先显示 后移入
		showup = setTimeout(function() {
			$(".notes_list_box").css('display', 'block');
			$(".notes_list_box").addClass('animated bounceInRight');
			clearTimeout(showup);
		}, 300);
	}
	$(".display_notebook").click(function(event) {
		if(!display_notebook){
			displayOrder(display_notebook);
			//刷新笔记列表
			allNotebook(data_notebook);
			//计数替换为笔记本数量
			$("div.counter .number").html("<span>" + data_notebook.length + "</span>" + " notebooks");

			showNotebook();
		}else{
			displayOrder(display_notebook);
			//计数替换为笔记数量
			$("div.counter .number").html("<span>" + notes_numbers[0] + "</span>" + " notes");

			hideNotebook();
		}
	});
	//所有笔记本中 点击选择
	$(".notebooks_list").on('click', 'li', function(event) {
		// var li_index = $(this).index();
		// hideNotebook();
		// displayNotebook(li_index);
		// fillEditArea(li_index,0);
		var notebookName = $(this).find('p.notebooks_title').text();
		displayNotesByNotebookName(notebookName);
		hideNotebook();
	});
	//展示选中名称的笔记本的笔记
	function displayNotesByNotebookName(notebookName){
		//更新当前选择的笔记本
		$(".chosen_notebook").text(notebookName);
		//展示该笔记本的所有笔记
		displayNotes(notebookName);
		var cur_notebook = data_notes[notebookName];
		//第一条笔记填充编辑区域
		var _notes = cur_notebook[0].notes_content;
			//显示标题
		$("#title_input > input").val(cur_notebook[0].notes_title);
			//显示内容
				//用延时等文本编辑器加载完
		setTimeout(function(){
			ue.setContent(_notes);
		},500)
	}
});






























//获得当前完整日期
	function getTodayFormatDate(){
		var today = new Date();
		var full_month = today.getMonth() + 1;
		if(full_month < 10) full_month = "0" + full_month;
		var full_date = today.getDate();
		if(full_date < 10) full_date = "0" + full_date;
		var format_day = today.getFullYear() +"-"+ full_month +"-"+ full_date;
		return format_day;
	}
	//函数获取当前时间 格式 13:20
	function getTimeHM(){
		var date = new Date();
		var hour = date.getHours();
		if(hour < 10) hour = "0" + hour;
		var minute = date.getMinutes();
		if(minute < 10) minute = "0" + minute;
		var time = hour + ":" + minute;
		return time;
	}
	//返回月份单词
	function getFullMonth(format_day){
		var _month_arr = format_day.split('-');
		var _month = '';
		switch(parseInt(_month_arr[1])-1){
			case 0: _month = "January"; break;
			case 1: _month = "February"; break;
			case 2: _month = "March"; break;
			case 3: _month = "April"; break;
			case 4: _month = "May"; break;
			case 5: _month = "June"; break;
			case 6: _month = "July"; break;
			case 7: _month = "August"; break;
			case 8: _month = "September"; break;
			case 9: _month = "October"; break;
			case 10: _month = "November"; break;
			case 11: _month = "December"; break;
			default:;
		}
		return _month;
	}
	//返回星期
	function getWeekday(format_day){
		var day_arr = format_day.split('-');
		var _day = new Date();
		_day.setFullYear(day_arr[0],parseInt(day_arr[1])-1,parseInt(day_arr[2]));
		var weekday = _day.getDay();
		switch(weekday){
			case 0: weekday = "Sunday"; break;
			case 1: weekday = "Monday"; break;
			case 2: weekday = "Tuesday"; break;
			case 3: weekday = "Wednesday"; break;
			case 4: weekday = "Thursday"; break;
			case 5: weekday = "Friday"; break;
			case 6: weekday = "Satursday"; break;
			default:;
		}
		return weekday;
	}
	//返回几号
	function getTheDate(format_day){
		var day_arr = format_day.split('-');
		return day_arr[2];
	}
	//创建或修改时间去掉时刻
	function timeWithoutClock(json_time){
		return json_time.toString().substring(0,10);
	}
	//计算距离今天的模糊时间
	function getFuzzyTime(format_date){
		//获得今天的日期
		var format_today = getTodayFormatDate();
		//分别计算参数日期和几天的年 月 日的差值
		var d = format_date.split('-',3);
		var t = format_today.split('-',3);
		var range_year = parseInt(t[0]) - parseInt(d[0]);
		var range_month = parseInt(t[1]) - parseInt(d[1]);
		var range_day = parseInt(t[2]) - parseInt(d[2]);
		//根据年月日的差值计算模糊时间
		var range_week = '';
		var fuzzy_time = '';
		//一个月内
		if (range_year == 0 && range_month == 0) {
			range_week = Math.round(range_day / 7);
			//今天 昨天
			if (range_day == 0) fuzzy_time = "today";
			else if (range_day == 1) fuzzy_time = "yesterday";
			//一周内
			else if (range_day < 7) fuzzy_time = range_day + " days ago";
			//一周
			else if (range_week == 1) fuzzy_time = "a week ago";
			//几周 一个月内
			else fuzzy_time = range_week + " weeks ago";
		}
		//几个月 可能性还是很小的....
		else if(range_year == 0){
			//月份数相差一个月
			if(range_month == 1){
				//因为是模糊时间 取前一个月为30天
				var range_week = Math.round((30 - parseInt(d[2]) + parseInt(t[2]))/7);
				 if (range_week == 1) fuzzy_time = "a week ago";
				 else fuzzy_time = range_week + " weeks ago";
			}else {
				//这里偷个懒 月份相差大于1 直接定为几月 不判断具体时间差
				fuzzy_time = range_month + " month ago";
			}
		}
		//一年或几年前 呃 应该用不到....
		else if (range_year == 1) fuzzy_time = "lastyear";
		else if (range_year > 1) fuzzy_time = range_year + " years ago";
		return fuzzy_time;
	}
