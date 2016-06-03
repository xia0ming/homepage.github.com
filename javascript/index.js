//主页基本事件绑定js 备忘js
jQuery(document).ready(function($) {
	//初始化分享服务
	bShare.init();
	bShare.addEntry({
		title: getTitle(),
		url: "",
		//分享内容去除标签
		summary: getNotes(),
		pic: ""
	});

	function getTitle(){
		//直接写成 title: $("#title_input > input").val()不行
		return $("#title_input input").val();
	}
	function getNotes(){
		//当前笔记内容
		var current_edit = jQuery.parseJSON(store.get("ueditor_preference"));
		var current_edit_title = '';//title在不同的环境下可能不一样
		//现在是这样的 {"http_localhost_8088_XM_editor-drafts-data":"<p>正在编辑的笔记内容</p>"}
		for(var item in current_edit){
			current_edit_title = item;
		}
		//取出正在编辑的笔记内容
		var edit_content = current_edit[current_edit_title];
		return edit_content.replace(/<\/?[^>]*>/g,'');
	}
	//获得天气数据 需要联网 :(
	// var weather_json = $('#weather_iframe').contents().find('pre').text();
	// var weather_json = $(window.frames["weather_iframe"].document).find("pre").text();
	// console.log(weather_json);


	//备忘初始数据
		//获取本地数据
	var data_schedule = jQuery.parseJSON(store.get("data_schedule"));
	if (!data_schedule)
	data_schedule = [
		{
			schedule_time: "17:35",
			is_imp: true,
			is_alert: true,
			is_finished:false,
			schedule_content: "The day to come wants you to get up early today !"
		},{
			schedule_time: "17:30",
			is_imp: false,
			is_alert: false,
			is_finished:false,
			schedule_content: "welcome !"
		}
	]

	//保存json数据到localstorage
	function saveJsonSchedule(){
		var str_data_schedule = JSON.stringify(data_schedule); 
		store.set('data_schedule', str_data_schedule);
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

	//函数获取当前日期 年月等
	function getToday(){
		var today = new Date();
		//获取当前日期
		var day = today.getDate();
		//获取日期英语序数词词尾
		var ordinal = "th";
		if(4 <= day && day <= 20 || 24 <= day && day <= 30 ) ordinal = "th";
		else{
			switch(day % 10){
				case 1 : ordinal = "st"; break;
				case 2 : ordinal = "nd"; break;
				case 3 : ordinal = "rd"; break;
				default: ordinal = "th";
			}
		}
		//获取星期
		var  week = today.getDay();
		switch(week){
			case 0: week = "Sunday"; break;
			case 1: week = "Monday"; break;
			case 2: week = "Tuesday"; break;
			case 3: week = "Wednesday"; break;
			case 4: week = "Thursday"; break;
			case 5: week = "Friday"; break;
			case 6: week = "Satursday"; break;
			default:;
		}
		//获取月份
		var month = today.getMonth();
		switch(month){
			case 0: month = "January"; break;
			case 1: month = "February"; break;
			case 2: month = "March"; break;
			case 3: month = "April"; break;
			case 4: month = "May"; break;
			case 5: month = "June"; break;
			case 6: month = "July"; break;
			case 7: month = "August"; break;
			case 8: month = "September"; break;
			case 9: month = "October"; break;
			case 10: month = "November"; break;
			case 11: month = "December"; break;
			default:;
		}
		//获取年份
		var year = today.getFullYear();

		var today_array = new Array();
		today_array.day = day;
		today_array.ordinal = ordinal;
		today_array.week = week;
		today_array.month = month;
		today_array.year = year;

		return today_array;
	}

	//更新时间星期等信息
	$("div.head_date > span.date").text(getToday().day).next().text(getToday().ordinal).next().text(getToday().week);
	$("div.head_date > span.month").text(getToday().month).next().text(getToday().year);
	//显示schedule数据
	function displaySchedule(data_schedule) {
		//先排序 后显示
		sortSchedule(data_schedule);
		saveJsonSchedule();
		//先清空 后显示
		$(".schedule_list ul").empty();
		var schedule_len = data_schedule.length;
		for(var i = 0;i < schedule_len;i++){
			newScheduleLi(data_schedule[i]);
		}

		//将备忘的事件定义在展示函数当中 每次展示新的元素 就会定义好对应的事件
			//删除某一个备忘
		$(".schedule_li").on('click', '.schedule_delete', function(event) {
			var parent_schedule_li = $(this).parent(".schedule_li");
			var schedule_index = parent_schedule_li.index();
			//使用delete 删除json对象时,删除后悔留下逗号 导致报错
			// delete data_schedule[schedule_index];
			//这里把json当做数组处理
			data_schedule.splice(schedule_index,1);
			saveJsonSchedule();
			parent_schedule_li.addClass('animated fadeOutLeft');
			var delete_schedule = setTimeout(function(){
				parent_schedule_li.remove();
				clearTimeout(delete_schedule);
			},1000)
		});
			//完成一个备忘
		$(".schedule_li").on('click', '.schedule_finish', function(event) {
			var parent_schedule_li = $(this).parent(".schedule_li");
			var schedule_index = parent_schedule_li.index();
			data_schedule[schedule_index].is_finished = true;
			saveJsonSchedule();

			parent_schedule_li.addClass('finished');
		});
	}
	displaySchedule(data_schedule);
	//schedule根据时间排序
	function sortSchedule(data_schedule) {
		data_schedule.sort(function(a,b){
			return a.schedule_time.replace(/[:]/g,'') - b.schedule_time.replace(/[:]/g,'');
		})
	}
	//点击添加备忘
		//新建schedule
	var new_schedule = {
			schedule_time: "",
			is_imp: false,
			is_alert: false,
			is_finished:false,
			schedule_content: ""
		}
		//更新新建的schedule函数
	function updateNewSchedule() {
		//默认参数
		var key = arguments[0] ? arguments[0] : "";
   		var value = arguments[1] ? arguments[1] : "";
   		//为空 重置(新建)schedule
		if (key === "" && value === "") {
			new_schedule.schedule_time = "";
			new_schedule.is_imp = false;
			new_schedule.is_alert = false;
			new_schedule.is_finished = false;
			new_schedule.schedule_content = "";
		}else{
		//不为空 赋值
			new_schedule[key] = value;
		}
	}
		//重置actions 和 备忘输入框
	function resetNewSchedule(){
		$(".plus_actions > img").eq(0).attr('src', 'images/star-empty.svg');
		$(".plus_actions > img").eq(1).attr('src', 'images/bell-empty.svg');
		$(".plus_text input").val("");
		$(".plus_text").css('borderBottom', '1px solid #7D9099').removeClass('animated flash');
	}
		//改变actions 和 备忘输入框位置
	function moveNewSchedule(a,b,c,d,e){
		$(".top_plus > .plus_button").css('left', a);
		$(".plus_time").css('top', b).find('input').attr('value', getTimeHM());
		$(".plus_actions").css('top', c);
		$(".plus_text").css('left', d);
		$(".schedule_list").css('marginTop', e);
	}
		//显示或隐藏actions 和 备忘输入框
	var is_new_schedule = false;
	//仅仅的开启或关闭新建schedule
	function toggleNewSchedule(situation) {
		//四种情况四选一
		if(situation == "cancel"){
			//删除编辑操作
			resetNewSchedule();
			moveNewSchedule('50%','-35px','-35px','-100%','0');
			is_new_schedule = false;
		}else if(is_new_schedule && $.trim($(".plus_text input").val()) == ""){
			//添加操作 但内容为空
			is_new_schedule = true;
			$(".plus_text").css('borderBottom', '1px solid red').addClass('animated flash');
		}else if(!is_new_schedule){
			//添加操作 显示新建
			is_new_schedule = true;
			resetNewSchedule();
			moveNewSchedule('8%','2px','2px','12px','70px');
		}else{
			//取消添加 隐藏新建
			is_new_schedule = false;
			moveNewSchedule('50%', '-35px', '-35px', '-100%', '0');
		}
	}
	//判断并选择保存新建的schedule或者关闭
	function saveOrCancelNewSchedule(){
		//判断是否可以关闭
		toggleNewSchedule();
		if ($.trim($(".plus_text input").val()) != "") {
			var _content = $(".plus_text input").val();
			updateNewSchedule("schedule_content", _content);

			var _time = $(".plus_time input").val();
			updateNewSchedule("schedule_time", _time);

			//更新data_schedule
			data_schedule.push(new_schedule);
			saveJsonSchedule();
			displaySchedule(data_schedule);
		}
	}
		// 弹出actions 和 备忘输入框
	$(".top_plus > .plus_button").click(saveOrCancelNewSchedule);
		//添加备忘的时间选择
	$(".clockpicker").clockpicker({
    	placement: 'bottom',
    	align: 'left',
    	donetext: 'Done'
	});
	$(".plus_time input").change(function(event) {
		var _time  = $(this).val();
		updateNewSchedule("schedule_time",_time);
	});
		//添加schedule时添加重要 提醒 或删除
	$(".plus_actions > img").eq(0).click(function(event) {
		var is_imp = false;
		if(!is_imp){
			$(this).attr('src', 'images/star-full.svg');
			is_imp = true;
		}else{
			is_imp = false;
			$(this).attr('src', 'images/star-empty.svg');
		}
		updateNewSchedule("is_imp",is_imp);
	});
	$(".plus_actions > img").eq(1).click(function(event) {
		var is_alert = false;
		if(!is_alert){
			$(this).attr('src', 'images/bell-full.svg');
			is_alert = true;
		}else{
			is_alert = false;
			$(this).attr('src', 'images/bell-empty.svg');
		}
		updateNewSchedule("is_alert",is_alert);
	});
		//新建备忘主体
	$(".plus_text input").change(function(event) {
		var _content = $(this).val();
		updateNewSchedule("schedule_content",_content);
	});
		//回车保存
	$(".plus_text input").keypress(function(event) {
		event = window.event || event;
		var _content = $(this).val();
		if (event.keyCode == "13") {
			saveOrCancelNewSchedule();
		}
	});
		//取消添加备忘
	$(".plus_actions > img").eq(2).click(function(event) {
		resetNewSchedule();
		toggleNewSchedule('cancel');
		updateNewSchedule();//不传参数重置NewSchedule json
	});

	//添加备忘生成卡片函数
	function newScheduleLi(schedule){
		//是否完成
		if(schedule.is_finished){
			//是否重要
			if(schedule.is_imp) 
				var schedule_li = $('<li class="schedule_li finished imp"></li>');
			else
				var schedule_li = $('<li class="schedule_li finished"></li>');
		}else{
			if(schedule.is_imp) 
				var schedule_li = $('<li class="schedule_li imp"></li>');
			else 
				var schedule_li = $('<li class="schedule_li"></li>');
		}
		var schedule_li_html = 
			'<div class="color_point" style="background:' + randomColor(schedule.is_finished,schedule.is_imp) +'"></div>' +
			'<div class="schedule_detail">' +
				'<div class="detail_head">' +
					'<span class="detail_time">' + schedule.schedule_time + '</span>' +
					isScheduleImp(schedule.is_imp) +
					isScheduleAlert(schedule.is_alert) +
				'</div>' +
				'<p class="detail_text">' + schedule.schedule_content + '</p>' +
			'</div>' + 
			'<div class="schedule_delete">' +
				'<img src="images/schedule-delete.svg" alt="lelete">' +
			'</div>' +
			'<div class="schedule_finish">' +
				'<img src="images/schedule-finish.svg" alt="finish">' +
			'</div>'
		schedule_li.html(schedule_li_html);
		schedule_li.appendTo($(".schedule_list ul"));
	}
		//随机颜色
	function randomColor(is_finished,is_imp) {
		if(is_finished) return "gray";
		else if(is_imp) return "#FCDB41";
		else {
			var color = '#';
			var color_array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
			for (var i = 0; i < 6; i++) {
				var color_index = Math.round(Math.random() * 15);
				color += color_array[color_index];
			}
			return color;
		}
	}
		//是否添加星级标识
	function isScheduleImp(is_imp){
		var imp_html = '';
		if(is_imp) {
			imp_html = '<div class="schedule_imp">' +
							'<img src="images/card-star.svg" alt="important">' +
						'</div>';
		}else{
			imp_html = '';
		}
		return imp_html;
	}
		//是否添加提醒标识
	function isScheduleAlert(is_alert){
		var alert_html = '';
		if(is_alert) {
			alert_html = '<div class="schedule_alert">' +
							'<img src="images/card-clock.svg" alt="alert">' +
						 '</div>';
		}else{
			alert_html = '';
		}
		return alert_html;
	}

	//备忘hover时delete finish显示  需定义延时 否则点不到delete finish
	var schedule_timeout;
	var schedule_hover;
	$(".schedule_list ul").on('mouseenter mouseleave', '.schedule_detail', function(event) {
		schedule_hover = $(this);
		if(event.type == "mouseenter"){
			clearTimeout(schedule_timeout);
			schedule_hover.siblings('.schedule_finish,.schedule_delete').css({
				right: '-1px',
				zIndex: '20'
			});
		}else if(event.type == "mouseleave"){
			schedule_timeout = setTimeout(function(){ 
				schedule_hover.siblings('.schedule_finish,.schedule_delete').css({
					right: '28px',
					zIndex: '10'
				});
			},300)
		}
	});
	//过快在schedule之间移动时 计时器并未执行就被清除 在此执行计时器的动作
	$(".schedule_list ul").on('mouseleave', '.schedule_li', function(event) {
		$('.schedule_finish,.schedule_delete').css({right: '28px',zIndex: '10'});
	});
	//delete finish hover时也不隐藏
	var del_fin_hover;
	$(".schedule_list ul").on('mouseenter mouseout', '.schedule_finish,.schedule_delete', function(event) {
		del_fin_hover = $(this);
		if(event.type == "mouseenter"){
			clearTimeout(schedule_timeout);
			del_fin_hover.css({right: '-1px',zIndex: '20'});
		}else if(event.type == "mouseout"){
			schedule_timeout = setTimeout(function(){ 
				$('.schedule_finish,.schedule_delete').css({right: '28px',zIndex: '10'});
			},300)
		}
	});


	//点击添加笔记本
	$(".top_plus > .add_button").click(function(event) {
		$(this).css('left', '8%');
		$(".top_plus > .add_note").css({top: '6px',right: '160px'}).addClass('animated bounce');
		$(".top_plus > .add_notebook").css("right", '10px').addClass('animated bounceInRight');
	});
	//展示所有笔记本hover
	// $(".display_notebook").hover(function() {
	// 	$(this).find('img').attr('src', 'images/notebook-hover.svg');
	// }, function() {
	// 	$(this).find('img').attr('src', 'images/notebook.svg');
	// });
	//选择笔记本
		
		//滚动条
		$(".notes_list_box,.notebooks").mCustomScrollbar({
			theme:"minimal-dark"
		});
		$(".schedule_list").mCustomScrollbar({
			theme:"minimal-dark",
			setLeft:"-15px",
			autoHideScrollbar:false
		});
	//笔记排序规则选择
	$(".order_option_box > div").hover(function() {
		$(this).addClass('active');
	}, function() {
		$(this).removeClass('active');
	});
	
	//笔记标题输入框
	// var title_input = $("<div></div>");
	// title_input.attr('class', 'title_input');
	// $(".notes_detail .edui-toolbar").css('background', 'black');

	//分享按钮 先显示后移动
	var show_share = false;
	$('.share_button').click(function(event) {
		if (!show_share) {
			$(".share_box a").css('display', 'block');
			$(".share_box a#wb").removeClass('wb_hide').addClass('wb');
			$(".share_box a#wx").removeClass('wx_hide').addClass('wx');
			$(".share_box a#qq").removeClass('qq_hide').addClass('qq');
			$(".share_box a#kj").removeClass('kj_hide').addClass('kj');
			show_share = true;
			clearTimeout(share_hide);
		}else{
			//先收缩在隐藏
			$(".share_box a#wb").removeClass('wb').addClass('wb_hide');
			$(".share_box a#wx").removeClass('wx').addClass('wx_hide');
			$(".share_box a#qq").removeClass('qq').addClass('qq_hide');
			$(".share_box a#kj").removeClass('kj').addClass('kj_hide');
			var share_hide = setTimeout(function(){
				$(".share_box a").css('display', 'none');
				clearTimeout(share_hide);
			},250);
			show_share = false;
		}
	});
});