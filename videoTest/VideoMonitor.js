var haoTianVideo ={
    isLogin : false, //是否已经登录
    isMultiScreen : false, //是否加载多屏(用于js分屏，如果有多屏幕，需要手动指定该值)
    playerArray : new Map(),
    /**
     * 登录
     */
    login : function (){
        if (!haoTianVideo.isLogin) { //未登录则初始化插件并且登录
            var result = haoTianVideo.initPlug();
            if (result) {
                var configIp = haoTianVideoHelp.getServerIp();//临时数据
                this.loginPlug(configIp);
            }
        }
    },

    /**
     * 登录插件
     * @param {Object} player
     */
    loginPlug : function(config) {
        var player = haoTianVideo.getPlayer();
        haoTianVideo.isLogin = true;
    },

    /**
     * 是否安装插件
     */
    isInstallActiveX : function () {
        var np = navigator.plugins;
        if(window.ActiveXObject){
            //ie
            try{
                var comActiveX = new ActiveXObject("Htisoft.UMS.MediaPlayer.1");
            }
            catch(e){
                return false;
            }
        }else if(np && np.length){
            var pluginName = 'umsplayer';
            // 非IE
            for ( var i = 0; i < np.length; i++) {
                if (np[i].name.toLowerCase().indexOf(pluginName.toLowerCase()) != -1)
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
        if(haoTianVideo.isInstallActiveX()){
            result = true;
        }else{
        	var msg = '请点击：';
        	var down = '皓天平台视频控件下载';
        	showConfirm(msg+"<a style='color: red' href='repository/plugins/MONITOR_PLUGIN_HOTAN.zip'>"+down+"</a>",function(){
        			window.location.reload();
        		},function(){
        			//window.close();
        		});
            //return result;
        }

        $("#players").empty();
        var playerHtml = "";
        if (!haoTianVideo.isMultiScreen) {//控件只有一个
            playerHtml = "<OBJECT id='playerObjPlug' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'" +
                " style='width: 100%; height: 100%;'></OBJECT>";
        } else { //CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'
            playerHtml += "<div id='s1'><OBJECT id='playerObjPlug' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB' ></OBJECT></div>";
            playerHtml += "<div id='s2'><OBJECT id='playerObjPlug1' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'></OBJECT></div>";
            playerHtml += "<div id='s3'><OBJECT id='playerObjPlug2' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'></OBJECT></div>";
            playerHtml += "<div id='s4'><OBJECT id='playerObjPlug3' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'></OBJECT></div>";
            playerHtml += "<div id='s5'><OBJECT id='playerObjPlug4' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'></OBJECT></div>"+
            "<div id='s6'><OBJECT id='playerObjPlug5' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'></OBJECT></div>"+
            "<div id='s7'><OBJECT id='playerObjPlug6' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'></OBJECT></div>"+
            "<div id='s8'><OBJECT id='playerObjPlug7' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'></OBJECT></div>"+
            "<div id='s9'><OBJECT id='playerObjPlug8' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'></OBJECT></div>"+
            "<div id='s10'><OBJECT id='playerObjPlug9' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'></OBJECT></div>"+
            "<div id='s11'><OBJECT id='playerObjPlug10' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'></OBJECT></div>"+
            "<div id='s12'><OBJECT id='playerObjPlug11' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'></OBJECT></div>"+
            "<div id='s13'><OBJECT id='playerObjPlug12' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'></OBJECT></div>"+
            "<div id='s14'><OBJECT id='playerObjPlug13' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'></OBJECT></div>"+
            "<div id='s15'><OBJECT id='playerObjPlug14' CLASSID='CLSID:A1C6E4C8-BD77-4781-99DD-C7C86D9F7FBB'></OBJECT></div>";
        }
        $("#players").append(playerHtml);
        return result;
    },

    /**
     * 注销插件
     */
    loginOut : function() {
        var player = haoTianVideo.getPlayer();
        if (null != player) {
            try {
                player.Stop();
                haoTianVideo.isLogin = false;
            } catch (e) {
            	
            }
        }
    },
    playHotanVideo : function(tfCode,winNum){
        var p = this.getPlayer();
        var config = haoTianVideoHelp.getServerIp();
		if (null == winNum) {
			winNum = haoTianVideo.getSelectedWindow();
		}
		haoTianVideo.stopVideo(winNum);
        p.UseMediaServer(config);
        p.UseTCP();//视频传输方式
        p.UseLiveAlias(tfCode);//设置要播放的视频编号
        p.KeepAspectRatio(false);//屏幕自适应
//        p.EnableContextMenu(true);//控制栏 没效果
//        p.EnableFlowControl(true,true);//拖到工具
        p.Play();
		//播放视频
		var playerObj = {};
		playerObj.tfCode = tfCode; //设施编码
		playerObj.isPlaying = true; //正在播放
		haoTianVideo.playerArray.put(winNum, playerObj);
    },
    stopVideo:function(winNum){//关闭一个
		if(null == winNum) {
			winNum = haoTianVideo.getSelectedWindow();
		}
		var player = haoTianVideo.getPlayer(winNum);
		if(!this.isPlaying()) { //判断当前选中窗口是否有视频播放
			return;
		}
		player.Stop();
		var playObj = haoTianVideo.playerArray.get(winNum);
		if (playObj) {
			playObj.tfCode = null;
			playObj.isPlaying = false;
			haoTianVideo.playerArray.remove(winNum);
		}

    },
	/**
	 * 判断当前选中窗口的摄像头是否正在播放
	 */
	isPlaying : function(winNum) {
		if (null == winNum) {
			winNum = haoTianVideo.getSelectedWindow();
		}
		var obj = haoTianVideo.playerArray.get(winNum);
		if (obj) {
			return obj.isPlaying;
		}
		return false;
	},
    closeAllPlayer : function() {
        var player = null;
        var obj = null;
        for(var i = 0; i < 16; i++) { //最多16个屏
            obj = haoTianVideo.playerArray.get(i);
            if (obj) {
                if (obj.isPlaying) {
                    try{
                        player = haoTianVideo.getPlayer(i);
                        player.Stop();
                    } catch (e) {
                    	
                    }
                }
                obj.tfCode = null;
                obj.isPlaying = false;
                haoTianVideo.playerArray.remove(i);
            }
        }
    },
    getPlayer : function(winNum) {
        var playerId = null;
        if(this.isMultiScreen) { //多屏幕
            if (null == winNum || "undefined" == winNum) { //如果未指定窗口号
                winNum = haoTianVideo.getSelectedWindow();
            }
            if (0 == winNum) {
                playerId = "playerObjPlug";
            } else {
                playerId = "playerObjPlug" + winNum;
            }
        } else { //单屏幕
            playerId = "playerObjPlug";
        }
        return document.getElementById(playerId);
    },
    pauseVideo:function(){
        var p = this.getPlayer();
        p.Pause();//手动暂停
    },
    playOneFile:function(fileUrl){//点播模式：单个资源
        var p = this.getPlayer();
        p.UseTCP();
        p.UseFile(fileUrl);//资源名称，包括虚拟目录路径
        p.Play();
    },
    playDirFile:function(fileDir){//点播模式：播放列表
        var p = this.getPlayer();
        p.UseTCP();
        p.UseFilePlayList(fileDir)//虚拟目录名称
        p.Play();
        p.ViewPlayListControl();//显示列表视图
    },
    startRecord:function(recodDir){//录像
        var p = this.getPlayer();
        p.StartRecord("C://cgy/");
    },
    stopRecord: function () {
        var p = this.getPlayer();
        p.StopRecord();
    },
    localPicture: function (picDir) {
        var p = this.getPlayer();
        p.LiveVideoSnapshot();//保存到控件默认目录
    },
    /**
     * 获取选中窗口号（默认返回第一个）
     */
    getSelectedWindow : function() {
        if(haoTianVideo.isMultiScreen){
            return multiscreen.CurrIndex;
        } else {
            return 0;
        }
    },
    viewFullSize:function(){
        var p = this.getPlayer();
//        p.ViewHalfSize();//无效
//        p.ViewDoubleSize();//无效
          p.ViewFullScreenSize();
    },
    getVideoExist: function () {
        var p = this.getPlayer();
        var res = p.get_VideoExist(pVal);//不支持
        console.log(res);
    },
    dialogClosed: function() {
    	alert(11);
    	haoTianVideo.loginOut();
   }
}
var haoTianVideoHelp = {
	getTfCode:function(tfId){//获取设备拓展信息
		return null;
	},
	getVideoServerInfo:function(){
		
	},
    setPicDir: function () {
        return "c://ums/picDir/";
    },
    getServerIp: function () {
        var inParam = {};
        inParam.method = 'qryCameraServerId';
        return '115.236.100.146';//后期改为数据库查询
    }
}
//监测本身页面使用;
var VideoMonitor = {
	    dialogClosed: function() {
	    	haoTianVideo.loginOut();
	   }	
}

var MultiScreenVideo = {
	   dialogClosed: function() {//关闭所有视频播放
	    	haoTianVideo.loginOut();
	   }	
}