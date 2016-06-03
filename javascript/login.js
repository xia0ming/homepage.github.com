jQuery(document).ready(function($) {
	//注册验证提示
	$.fn.showState = function(state){
		if (state == 'success') {
			this.after('<img src="images/happy.svg" alt="valid">');
		}else if(state == 'fail'){
			this.after('<img src="images/sad.svg" alt="valid">');
		}
		return this;
	}
	//用户名验证
	$("#user_name").blur(function(event) {
		$(this).nextAll().remove();
		var _value = $(this).val();
		if($.trim(_value).length == 0){
			//长度为空
			$(this).showState('fail');
			$("#errormsg").text("Username can't be blank");
		}else if(!/[a-zA-Z0-9]{3,8}/.test(_value)){
			//数字 字母 下划线 短横线
			$(this).showState('fail');
			$("#errormsg").text("Username is not valid");
		}else if(_value == 'xia0ming'){
			//已经存在
			$(this).showState('fail');
			$("#errormsg").text("username has already been taken");
		}
	});
	//邮箱
	$("#email").blur(function(event) {
		$(this).nextAll().remove();
		var _value = $(this).val();
		if($.trim(_value).length == 0){
			//长度为空
			$(this).showState('fail');
			$("#errormsg").text("email can't be blank");
		}else if(!isValidEmail(_value)){
			//数字 字母 下划线 短横线
			$(this).showState('fail');
			$("#errormsg").text("email is not valid");
		}else if(_value == 'xia0ming@foxmail.com'){
			//已经存在
			$(this).showState('fail');
			$("#errormsg").text("email has already been taken");
		}
	});
	//邮箱验证函数
	function isValidEmail(emailAddress) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test(emailAddress);
    };
    //密码
    //  '/^[a-z0-9_-]{6,18}$/'
    //重复密码
    $("#confirm_password").blur(function(event) {
		$(this).nextAll().remove();
		var _confirm_password = $(this).val();
		var _password = $("#password").val();
		if(_confirm_password != _password){
			$(this).showState('fail');
			$("#errormsg").text("Not same password");
		}
	});
	//验证码图片点击刷新
	$(".login_content img.img_verify,.signUp_content li img").click(function(event) {
		$(this).attr('src', 'verify.php?r='+ Math.random());
	});
	//点击注册
	$("span.span_signup").click(function(event) {
		$("div.login_box").css('left', '-100%');
		$("div.signUp_box").css('left', '0');
	});
	//注册填写hover focus效果
	$(".signUp_content li > div.input_box").hover(function() {
		$(this).prev().css('color', 'rgb(236,236,236)');
	}, function() {
		$(this).prev().css('color', 'rgb(118,118,118)');
	});
	$(".signUp_content li > div > input").focus(function(event) {
		$(this).parent().css('color', 'rgb(236,236,236)').prev().css('color', 'rgb(236,236,236)');;
	});
	//注册右侧hover更改图片
	$(".head_png img").mouseover(function(event) {
		$(this).attr('src', 'images/head-hover.png');
	}).mouseout(function(event) {
		$(this).attr('src', 'images/head.png');
	});
	//注册页面返回登录
	$(".backtologin").click(function(event) {
		$("div.login_box").css('left', '0');
		$("div.signUp_box").css('left', '100%');
	}).mouseover(function(event) {
		$(this).find('img').attr('src', 'images/signback-hover.svg');
	}).mouseout(function(event) {
		$(this).find('img').attr('src', 'images/signback.svg');
	});
	//点击登录
	$(".login_submit").click(function(event) {
		var code_num = $('.login_verify').val();
		$.post("login.php?act=num",{verifycode:code_num},function(msg){ 
            if(msg == '1'){ 
                alert("验证码正确！"); 
            }else{ 
                $(".login_error").text('Verification code is not correct');
                alert("验证码错误！");
            } 
        }); 
	});
})