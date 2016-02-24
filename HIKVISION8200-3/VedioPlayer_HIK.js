/**
 * 离开页面时，销毁插件
 */
$(window).unload(function(){
	LoginCenter.loginOut();
});

var Camera = {
	currentStep : 3, //当前步长，默认值为1
	playerArray : new Map(), //记录每个窗口状态(播放状态、tfID、tfCode)
	recoredArray : new Array(), //记录每个窗口录像状态
	IS_PZT_CONTROLLABLE: true, //主窗口必须明确指定云台不可控，默认为可控
	/**
	 * 获取选中的播放器
	 */
	getPlayer : function() {
		return document.getElementById("playerObjPlug");
	},
	
	/**
	 * 分屏
	 * @param {Object} value
	 */
	setDivMode : function(value) {
		var player = Camera.getPlayer();
		player.SetWndNum(value);
	},

	/**
	 * 获取分屏数（窗口分割数）
	 * @retrun {Object} value
	 */
	getWndNum: function () {
		var player = Camera.getPlayer();
		player.GetWndNum();
	},
	/**
	 * 设置选中 窗口
	 * @param {Object} num
	 */
	selWindow: function (num) {
		var player = Camera.getPlayer();
		player.SelWindow(num);
	},
	
	/**
	 * 获取选中窗口号（默认返回第一个）
	 */
	getSelectedWindow : function() {
		var player = Camera.getPlayer();
		var winNum = 0;
		if ("MONITOR" == vedioType) {
			winNum = player.GetSelWnd();
		} else if ("RECORD" == vedioType) {//录像回放获取方法不同
			winNum = player.GetFocusWndIndex();	
		}
		if (-1 == winNum) { //未选中默认取第一个空闲窗口
			winNum = player.GetFreePreviewWnd();
		}
		if (-1 == winNum) {
			winNum = 0;
		}
		return winNum;
	},
	
	/**
	 * 获取选中窗口的TFcode，巡逻时需要用到
	 * @param {Object} winNum
	 */
	getSelectedWinTfCode : function(winNum) {
		var obj = Camera.playerArray.get(winNum);
		if (obj) {
			return obj.guid;
		}
		return null;
	},
	/**
	 * 视频播放统一入口 有ajax 后台查询 相关参数操作
	 */
	play : function(tfId) {
		var inParam = {};
		inParam.method = "qryDeviceDetailById";
		inParam.deviceId = tfId;
		var result = callRemoteFunction("TrafficMgrByVideoService", inParam).DEVICE_DETAIL;
		if (null == result || result.length <= 0) {
			alert(getJsRes("DEVICE_UNAVAILABLE").DEVICE_UNAVAILABLE); //没有匹配的摄像头信息
			return;
		}
		Camera.devicePlay(result.TF_CODE, tfId);
	},
	
	/**
	 * 播放视频 控件调用
	 * @param {Object} tfCode
	 */
	devicePlay : function(tfCode, tfId, winNum) {
		var player = Camera.getPlayer();
		if (null == winNum || "undefiend" == winNum) {
			winNum = Camera.getSelectedWindow();
		} else {
			player.SelWindow(winNum); //设置为选中窗口
		}
		//首先关闭窗口视频
		Camera.closePlayer(winNum);
		
		//播放视频
		var playerObj = {};
		playerObj.tfId = tfId; //设施ID
		//playerObj.guid = tfCode; //设施编码
		playerObj.isPlaying = true; //正在播放
		Camera.playerArray.put(winNum, playerObj);
	
		var playxml = Camera.getCameraPlayXml(tfId);
		player.StartTask_Preview_InWnd(playxml, winNum);
		
		//Camera.pztStatus();//设置页面 云台按钮是否可用
	},
	
	getCameraPlayXml : function(tfId) {
		var inParam = {};
		inParam.method = "qryHGTCameraAttrByTfId";
		inParam.TF_ID = tfId;
		inParam.TF_STATE = 'A';
		inParam.ORG_VENDOR = GloableConfig.getDefaultVendorValue();
		inParam.TF_TYPE = '14';
		var result = callRemoteFunction("TrafficMgrByVideoService", inParam).CAMERA_ATTR;
		if (result && "undefiled" != result) {
			return '<?xml version="1.0" encoding="UTF-8"?><Message><Camera>' + 
					'<Id>' + result.CAMERA_ID + '</Id><IndexCode>' + result.INDEX_CODE + '</IndexCode><Name>' +
					result.TF_NAME + '</Name><ChanNo>' + result.CHANEL_NUM +
					'</ChanNo><Matrix Code="0" Id="0" /></Camera><Dev regtype="' +
					result.REG_TYPE + '" devtype="'+ result.DEV_TYPE +'"><Id>'+
					result.DEVICE_ID +'</Id><IndexCode>'+
					result.DEVICE_CODE +'</IndexCode><Name>'+ result.DEVICE_NAME +'</Name><Addr IP="'+
					result.DEVICE_IP +'" Port="'+
					result.DEVICE_PORT +'" /><Auth User="'+ result.USER_NAME +'" Pwd="'+ 
					result.USER_PWD +'" /></Dev><Vag IP="172.17.10.101" Port="7302" />' +
					'<Voice><Encode>0</Encode></Voice>' +
					'<Media Protocol="0" Stream="0"><Vtdu IP="'+
					result.STREAM_IP +'" Port="'+ result.STREAM_PORT +'" /></Media>' +
					'<Privilege Priority="50" Code="0" /><Option><Talk>0</Talk><PreviewType>0</PreviewType></Option></Message>';
		}
		
		return null;
	},
	
	
	/**
	 * 云台是否可控
	 * @param {Object} tfCode
	 * @param {Object} player
	 */
	pztStatus : function() {
		if(!Camera.IS_PZT_CONTROLLABLE) { //不可控
			$(".control").attr("disabled", "disabled");
			$(".controllink").addClass("img-filter");
			$(".linkTop").attr("disabled", "disabled");
			$(".linkLeft").attr("disabled", "disabled");
			$(".linkMiddleon").attr("disabled", "disabled");
			$(".linkRight").attr("disabled", "disabled");
			$(".linkBottom").attr("disabled", "disabled");
			$(".huagan").addClass("img-filter");
			$(".huagan > span").attr("disabled", "disabled");
			$("#guangquan_zoomin").attr("disabled", "disabled");
			$("#guangquan_zoomin > img").addClass("img-filter");
			$("#guangquan_zoomout").attr("disabled", "disabled");
			$("#guangquan_zoomout > img").addClass("img-filter");
			$("#jiaoju_zoomin").attr("disabled", "disabled");
			$("#jiaoju_zoomin > img").addClass("img-filter");
			$("#jiaoju_zoomout").attr("disabled", "disabled");
			$("#jiaoju_zoomout > img").addClass("img-filter");
			$("#jujiao_zoomin").attr("disabled", "disabled");
			$("#jujiao_zoomin > img").addClass("img-filter");
			$("#jujiao_zoomout").attr("disabled", "disabled");
			$("#jujiao_zoomout > img").addClass("img-filter");
		} else {
			if($(".control").attr("disabled") == "disabled") {
				$(".control").removeAttr("disabled");
				$(".controllink").removeClass("img-filter");
				$(".linkTop").removeAttr("disabled");
				$(".linkLeft").removeAttr("disabled");
				$(".linkMiddleon").removeAttr("disabled");
				$(".linkRight").removeAttr("disabled");
				$(".linkBottom").removeAttr("disabled");
				$(".huagan").removeClass("img-filter");
				$(".huagan > span").removeAttr("disabled");
				$("#guangquan_zoomin").removeAttr("disabled");
				$("#guangquan_zoomin > img").removeClass("img-filter");
				$("#guangquan_zoomout").removeAttr("disabled");
				$("#guangquan_zoomout > img").removeClass("img-filter");
				$("#jiaoju_zoomin").removeAttr("disabled");
				$("#jiaoju_zoomin > img").removeClass("img-filter");
				$("#jiaoju_zoomout").removeAttr("disabled");
				$("#jiaoju_zoomout > img").removeClass("img-filter");
				$("#jujiao_zoomin").removeAttr("disabled");
				$("#jujiao_zoomin > img").removeClass("img-filter");
				$("#jujiao_zoomout").removeAttr("disabled");
				$("#jujiao_zoomout > img").removeClass("img-filter");
			}
		}
	},
	
	/**
	 * 选择窗口进行播放
	 * @param {Object} tfCode
	 * @param {Object} windowNum
	 */
	openSelectedWindowStream : function(tfCode, windowNum, tfId) {
		Camera.devicePlay(tfCode, tfId, windowNum);
	},
	
	/**
	 * 获取选中屏幕摄像头的guid
	 */
	getCameraGuid : function() {
		var obj = Camera.playerArray.get(Camera.getSelectedWindow());
		if (obj) {
			return obj.guid;
		}
		return null;
	},
	
	/**
	 * 判断当前选中窗口的摄像头是否正在播放
	 */
	isPlaying : function(winNum) {
		if (null == winNum) {
			winNum = Camera.getSelectedWindow();
		}
		var obj = Camera.playerArray.get(winNum);
		if (obj) {
			return obj.isPlaying;
		}
		return false;
	},
	
	/**
	 * 设置步长
	 * @param {Object} value
	 */
	setPTZStep : function(value) {
		Camera.currentStep = value;
	},
    /**
     * 设置云台转速
     * @param {Object} value 值范围 1-7 ，0 表示 无带速接口控制云台
     */
    setPtzSpeed: function (value) {
        var player = Camera.getPlayer();
        player.SetPtzSpeed(value);
    },
    /**
     * 获取云台转速
     * @retrun {Object} value 值范围 1-7 ，0 表示 无带速接口控制云台
     */
    getPtzSpeed: function () {
      var player = Camera.getPlayer();
      return player.GetPtzSpeed();
    },
    /**
     * 云镜控制 for html event use (指令翻译 成 数字)
     * @command 指令
     * @mouseEvent 鼠标动作
     */
    PTZControlO : function(command, mouseEvent) {
        var cmdHIK = null;
        if("TOP_LEFT" == command){//左上
            cmdHIK = 25;
        }else if("TOP_RIG" == command){//右上
            cmdHIK = 26;
        }else if("DOWN_LEFT" == command){//左下
            cmdHIK = 27;
        }else if("DOWN_RIG" == command){//右下
            cmdHIK = 28;
        } else if ("UP" == command) { //向上
            cmdHIK = 21;
        } else if ("DOWN" == command) { //向下
            cmdHIK = 22;
        }else if ("LEFT" == command) { //向左
            cmdHIK = 23;
        } else if ("RIGHT" == command) { //向右
            cmdHIK = 24;
        } else if ("LOCK" == command) { //锁定
            cmdHIK = 29; //海康锁定变为自动转动

        } else if ("GUANGQUAN_ZOOMIN" == command) { //光圈放大
            cmdHIK = 15;
        } else if ("GUANGQUAN_ZOOMOUT" == command) { //光圈缩小

            cmdHIK = 16;

        } else if ("JIAOJU_ZOOMIN" ==command) { //焦距放大

            cmdHIK = 11;

        } else if ("JIAOJU_ZOOMOUT" == command) { //焦距缩小

            cmdHIK = 12;

        } else if ("JUJIAO_ZOOMIN" == command) { //聚焦放大

            cmdHIK = 13;

        } else if ("JUJIAO_ZOOMOUT" == command) { //聚焦缩小

            cmdHIK = 14;

        }

        Camera.PTZControl(cmdHIK, mouseEvent);
    },


	/**
	 * 云镜控制 base
	 * @param command 指令
	 * @param speed 转速
	 * @param mouseEvent 鼠标按下、鼠标弹上
	 */
	PTZControl : function(command, mouseEvent) {
        if (command) {
            var step = Camera.currentStep;
            var player = Camera.getPlayer();
            if ("MOUSE_DOWN" == mouseEvent) {
                player.StartTask_PTZ(command, step);
            } else if ("MOUSE_UP" == mouseEvent) {
                player.StartTask_PTZ(-command,step);
            }
        }
	},
	
	/**
	 * 关闭摄像头（即停止播放-- 实时播放）
	 */
	closePlayer : function(winNum) {
		var player = Camera.getPlayer();
		if(!this.isPlaying()) { //判断当前选中窗口是否有视频播放
			return;
		}

		if(null == winNum) {
			winNum = Camera.getSelectedWindow();
		}


        //海康提供方法 判断当前选中窗口是否有视频播放
        //var t = player.IsWndPreview(winNum);//正在预览 返回0
        //if(t != '0' && t != 0){
        //    return;
        //}
		
		try {
			player.StopRealPlay(winNum);
		} catch(e) {
			
		}
		var playObj = Camera.playerArray.get(winNum);
		if (playObj) {
			playObj.guid = null;
			playObj.tfId = null;
			playObj.isPlaying = false;
			Camera.playerArray.remove(winNum);
		}
	},
	
	/**
	 * 海康控件内部停止视频，清除播放记录
	 * @param {Object} winNum
	 */
	cleanWinPlayer : function(winNum) {
		var playObj = Camera.playerArray.get(winNum);
		if (playObj) {
			playObj.guid = null;
			playObj.tfId = null;
			playObj.isPlaying = false;
			Camera.playerArray.remove(winNum);
		}
	},
	
	/**
	 * 关闭所有摄像头
	 */
	closeAllPlayer : function() {
		var player = Camera.getPlayer();
		
		try {
			player.StopAllPreview();
		} catch(e) {
			
		}
		//清空录像播放信息
		for (var i=0;i<Camera.getWndNum();i++) {
			var playObj = Camera.playerArray.get(i);
			if (playObj) {
				playObj.guid = null;
				playObj.tfId = null;
				playObj.isPlaying = false;
				Camera.playerArray.remove(i);
			}
		}
	},
	
	/**
	 * 本地快照
	 */
	localCapPic : function() {
		
	},
	
	/**
	 * 设定本地录像、抓拍保存路径.
	 */
	setSavePath : function() {//录像 或抓拍 前 手动触发 或者代码中 触发一下！！
		var player = Camera.getPlayer();
		player.SetCapturParam("c:\\hikvision",0);//0:jpg  1:bmp
		
		player.SetRecordParam("c:\\hikvision",4); //设置录像文件大小为1024M
	},
	
	/**
	 * 获取抓拍，本地录像存储路径
	 */
	getSavePath : function() {
		return "c:\\hikvision";
	},
	
	/**
	 * 获取默认存储路径.
	 */
	getRecordDownSavePath : function() {
		return "c:\\hikvision";
	},
	
	/**
	 * 本地录像
	 * @param opType 0: 开始录像；1: 停止录像
	 */
	localRecord : function(opType) {
		var player = Camera.getPlayer();
		var winNum = Camera.getSelectedWindow();
		var obj = null;
		if ("START_RECORD" == opType) {

		} else if ("STOP_RECORD" == opType) { //暂停

		}
	},
	
	/**
	 * 判断当前选中窗格是否正在录像
	 */
	getSelectWinRecordState : function(winNum) {
	},

	/**
	 * 查询摄像头网络录像.
	 */
	queryRemoteRecord : function(tfCode, startTime, endTime, isPlay, isDownload) {
	},
	
	/**
	 * 设置网络录像下载存放路径
	 */
	/**setRemoteRecordDownloadSavePath : function() {
	},*/
	
	/**
	 * 设置云台预置位
	 * @param {Object} num 预置位编号
	 */
	preSetCamera : function(num) {
		var player = Camera.getPlayer();
		var ret = player.PTZCtrlSetPreset(num);
		console.log("result:"+ret);
	},

	/**
	 * 调用云台预置位
	 * @param {Object} num 预置位编号
	 */
	preGetCamera: function (num) {
		var player = Camera.getPlayer();
		var ret = player.PTZCtrlGotoPreset(num);
		console.log("result:"+ret);
	},
	/**
	 * 释放资源接口
	 */
	destroy: function () {
		var player = Camera.getPlayer();
		player.Destroy();
	},
	/**
	 * 录像回放OCX接口调用
	 * @param {Object} girdRow
	 */
	recordRePlay : function(gridRow) {
	},
	
	/**
	 * 录像回放OCX停止接口调用
	 */
	recordRePlayStop : function(gridRow) {
	},
	
	/**
	 * 录像回放OCX暂停接口
	 * @param {Object} gridRow
	 */
	recordRePlayPause : function(gridRow) {
	},
	
	/**
	 * 录像回放OCX继续回放
	 * @param {Object} gridRow
	 */
	recordRePlayResume : function(gridRow) {
	},
	
	/**
	 * 设置录像回放速度
	 * @param {Object} value
	 */
	recordRePlaySpeedSet : function(value) {
	},
	
	/**
	 * 获取录像文件回放的进度（0-100之间）
	 */
	getRePlayPos : function() {
		var player = Camera.getPlayer();
		return player.DPSDK_GetPlaybackPosByWndNo(Camera.PRI_WIN_ID, Camera.getSelectedWindow());
	}
};

var LoginCenter = {
	isLogin : false, //是否已经登录
	playerClass : null, //player的样式
	isMultiScreen : false, //是否加载多屏(用于js分屏，如果有多屏幕，需要手动指定该值)
	
	/**
	 * 登录
	 */
	login : function (){
		if (!this.isLogin) { //未登录则初始化插件并且登录
			var result = LoginCenter.initPlug();
			if (result) {
				var config ="";// GloableConfig.getHostByVendor(GloableConfig.DEFAULT_VENDOR);
				this.loginPlug(config);
			}
		}
	},
	
	/**
	 * 登录插件 实时预览
	 * @param {Object} player
	 */
	loginPlug : function(config) {
		if (LoginCenter.isLogin == true) {
			LoginCenter.loginOut();
		}
		
		var player = Camera.getPlayer();
		if(player.object == null) {
			alert(getJsRes("PLUGIN_UNINSTALL").PLUGIN_UNINSTALL);
        }else{
        	LoginCenter.isLogin = true;
			player.SetOcxMode(0);
        } 
	},
	
	/**
	 * 是否安装插件
	 */
	isInstallActiveX : function () {
		try{
			var comActiveX = new ActiveXObject("PLAYVIEW_OCX.PlayView_OCXCtrl.1");
		}
		catch(e){
			if(navigator.plugins["NPPlayer Dynamic Link Library"]) //检查非IE
			{
				return true;
			}
			return false;
		}
		return true;
	},
	
	/**
	 * 初始化插件
	 */
	initPlug : function() {
		var result = false;
		//是否安装插件
    	if(LoginCenter.isInstallActiveX()){
      		result = true;
    	}else{
			var msg = getJspRes("PLUGIN_MESSAGE").PLUGIN_MESSAGE;
			var down = getJspRes("PLUGIN_MESSAGE_DOWN").PLUGIN_MESSAGE_DOWN;
			showConfirm(msg + "<a style='color: red' href='repository/plugins/MONITOR_PLUGIN_HIK_HGT.rar'>" + down+"</a>", function(){
				window.location.reload();
			}, function(){
				window.close();
			});
			return result;
		}

		$("#players").empty();
		var playerHtml = "<OBJECT id='playerObjPlug' style='width: 100%;height: 100%;' CLASSID='clsid:04DE0049-8359-486E-9BE7-1144BA270F6A'></OBJECT>";
		$("#players").append(playerHtml);
		if (LoginCenter.playerClass) {
			$("#players").addClass(LoginCenter.playerClass);
		}
	  	return result;
	},
	
	/**
	 * 注销插件
	 */
	loginOut : function() {
		this.isLogin = false;
		Camera.closeAllPlayer();
		Camera.destroy();
	}
};
