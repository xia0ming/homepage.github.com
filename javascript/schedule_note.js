//备忘提醒js
   //获取本地数据
    var data_schedule = jQuery.parseJSON(store.get("data_schedule"));
    if (!data_schedule)
        data_schedule = [{
            schedule_time: "17:35",
            is_imp: true,
            is_alert: true,
            is_finished: false,
            schedule_content: "The day to come wants you to get up early today !"
        }, {
            schedule_time: "17:30",
            is_imp: false,
            is_alert: false,
            is_finished: false,
            schedule_content: "welcome !"
        }]
    //载入提示声音文件
    // $('<audio id="noteAudio"><source src="musics/notify.mp3" type="audio/mpeg"><source src="musics/notify.wav" type="audio/wav"><source src="musics/notify.ogg" type="audio/ogg"></audio>').appendTo('body');
    //每5秒检测是否需要提醒
    var schedule_note = setInterval("checkNote(data_schedule)",5000);
    //是否已经在提醒
    var alerting = false;

    function checkNote(data_schedule) {
        data_schedule = jQuery.parseJSON(store.get("data_schedule"));

        var schedule_len = data_schedule.length;
        var time_now = getTimeHM();
        for(var i = 0;i < schedule_len;i++){
            //是否是设置了提醒的事项
            if(data_schedule[i].is_alert){
                var time_schedule = data_schedule[i].schedule_time;
                if(time_now == time_schedule) {
                    //已经在提醒则不重复调用scheduleNote() 
                    if(alerting) continue;
                    else{
                        alerting = true;
                        scheduleNote(data_schedule[i]);
                        voiceAlerting();
                    }
                }
            }            
        }
    }
    //声音提醒
    var note_voice = null;
    function voiceAlerting(){
        note_voice = setInterval(function(){
            $('#noteAudio')[0].play();
        },3000);
    }
    function stopAlerting(){
        clearInterval(note_voice);
    }

    //标题闪烁持续30秒
    function scheduleNote(schedule){
        flashTitle(schedule.schedule_time + "  " + schedule.schedule_content);
        var last_time = setTimeout(function(){  
                clearTimeout(last_time);
                stopFlash();
                stopAlerting();
        },30000);//60秒
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

    var flashTitlePlayer = {
        start: function(msg) {
            this.title = document.title;
            //IE下document.title是只读的 强行赋值会报错 使用try,catch
            if (!this.action) {
                try {
                    this.element = document.getElementsByTagName('title')[0];
                    this.element.innerHTML = this.title;
                    this.action = function(ttl) {
                        this.element.innerHTML = ttl;
                    };
                } catch (e) {
                    this.action = function(ttl) {
                        document.title = ttl;
                    }
                    delete this.element;
                }
                this.toggleTitle = function() {
                    //将title在 【msg】 与 【   】之间进行切换 打到闪烁的效果
                    this.action('[' + this.messages[this.index = this.index == 0 ? 1 : 0] + ']');
                };
            }
            this.messages = [msg];
            var n = msg.length;
            var s = '';
            if (this.element) {
                var num = msg.match(/\w/g);
                if (num != null) {
                    var n2 = num.length;
                    n -= n2;
                    while (n2 > 0) {
                        s += "&nbsp;";
                        n2--;
                    }
                }
            }
            while (n > 0) {
                s += '　';
                n--;
            };
            this.messages.push(s);
            this.index = 0;
            this.timer = setInterval(function() {
                flashTitlePlayer.toggleTitle();
            }, 1000);
        },
        stop: function() {
            if (this.timer) {
                clearInterval(this.timer);
                this.action(this.title);
                delete this.timer;
                delete this.messages;
                this.action('xia0ming');
            }
        }
    };

    function flashTitle(msg) {
        flashTitlePlayer.start(msg);
    }

    function stopFlash() {
        alerting = false;
        flashTitlePlayer.stop();
    }