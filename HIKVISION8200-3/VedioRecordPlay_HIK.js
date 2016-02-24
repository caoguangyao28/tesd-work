/**
 * Created by cao.gy on 2015/10/8.
 */
/**
 * 离开页面时，销毁插件
 */
$(window).unload(function(){
    LoginCenter.loginOut();
});
var CameraRecord ={
    playerArray : new Map(),//记录窗口状态 信息
    nPBType:0, //回放 模式 0：常规回放  1：分段回放 2，事件回放
    nSessionNum:4, //回放段数
    getPlayer : function() {
        return document.getElementById("playBackOcx");
    },
    /**
     * 设置回放界面为一画面
     * @param {Object} value
     */
    setPlayWndOne : function() {
        var player = CameraRecord.getPlayer();
        player.SetPlayWndOne();
    },
    /**
     * 设置 回放参数[默认回放模式]
     *
     */
    setConfig: function (tfId) {
        var playerObj = {};
        var winNum = CameraRecord.getSelectedWindow();
        playerObj.tfId = tfId; //设施ID
        playerObj.isPlaying = true; //正在播放
        CameraRecord.playerArray.put(winNum, playerObj);

        var configN = CameraRecord.getRecordPlayXml(tfId);
        var player = CameraRecord.getPlayer();
        player.SetPlayBackParam(configN);
    },
    /**
     * 后台获取 回放参数
     *
     */
    getRecordPlayXml: function (tfId,startTime,endTime) {
        var winNum = CameraRecord.getSelectedWindow();
        var resultXml = '<?xml version="1.0" encoding="UTF-8"?><Message>' +
            '<Window index='+winNum+' ></Window>'+
            '<Camera><id>' +
            '</id><IndexCode>' +
            '</IndexCode><Name>' +
            '</Name><DevYype>' +
            '</DevYype><Location>' +
            '</Location>1</Camera>' + //
            '<Query><ZoneId>' +
            '</ZoneId><Vrm id="10.64.61.96" ></Query>'+
            '<Cascade><Id>' +
            '</Id><Protocol>' +
            '</Protocol><Addr id="10.64.51.50" port=7210 >' +
            '<DecodeTag>hikvision</DecodeTag><SubPlat>0</SubPlat></Cascade>'+
            '<Privilege>3</Privilege>';
        if(CameraRecord.nPBType == 1){
            resultXml += "<Time><Begin>"+
                startTime+"</Begin><End>"+endTime+"</End></Time>";
        }

        resultXml += '</Message>';

        return resultXml;
    },
    /**
     *开始搜索 回放[默认回放模式]
     * @param stsrtTime endTime
     */
    startQueryRecord: function (startTime, endTime) {
        //录像类型1-计划录像2-移动录像4-报警录像16-手动录像23-全部录像
        var strXML = "<?xml version='1.0'?><Message><Time><Begin>"+
            startTime+"</Begin><End>"+endTime+"</End></Time><RecType>"+23+"</RecType></Message>";
        var player = CameraRecord.getPlayer();
        player.StartQueryRecord(strXML);
    },
    /**
     * 获取选中窗口号
     */
    getSelectedWindow : function() {
        var player = CameraRecord.getPlayer();
        var winNum = player.GetFocusWndIndex();
        if (-1 == winNum) {
            winNum = 0;
        }
        return winNum;
    },
    /**
     * 获取窗口数
     */
    getWndNum: function () {
        var player = CameraRecord.getPlayer();
        var wndNum = player.GetCurWndNum();
        if(wndNum != -1){
            return wndNum;
        }else{
            alert("获取窗口数失败！");
        }
    },
    /**
    *停止回放
     */
    stopPlayBack: function () {
        var player = CameraRecord.getPlayer();
        var winNum = CameraRecord.getSelectedWindow();//当前选中窗口
        //当前窗口 是否在回放
        var obj = CameraRecord.playerArray.get(winNum);
        if (obj && obj.isPlaying) {
            obj.tfId = null;
            obj.isPlaying = false;
            CameraRecord.playerArray.remove(winNum);

            player.StopPlayBack(winNum);
        }
    },
    /**
     *停止所有回放
     */
    stopAllPlayBack: function () {
        var player = CameraRecord.getPlayer();
        player.StopAllPlayBack();

        //清空录像播放信息
        for (var i=0;i<CameraRecord.getWndNum();i++) {
            var playObj = CameraRecord.playerArray.get(i);
            if (playObj) {
                playObj.tfId = null;
                playObj.isPlaying = false;
                CameraRecord.playerArray.remove(i);
            }
        }
    },
    /**
     * 设置回放类型
     * nPBType 回放模式： 0：常规回放  1：分段回放 2，事件回放
     * nSessionNum 回放段数
     * */
    setPlayBackType: function (nPBType,nSectionNum) {
        var player = CameraRecord.getPlayer();
        player.SetPlayBackType(nPBType,nSectionNum);
        CameraRecord.nPBType = nPBType;
    },
    /**
     * 设置分段数
     * */
    changeSectionNum: function (num) {
        var player = CameraRecord.getPlayer();
        player.ChangeSectionNum(num);
    },
    /**
     * 分段查询
     *
     * */
    startSectionQuery: function (tfId,startTime,endTime) {
        var player = CameraRecord.getPlayer();
        var configN = CameraRecord.getRecordPlayXml(tfId,startTime,endTime);
        player.StartSectionQuery(configN);

        var playerObj = {};
        var winNum = CameraRecord.getSelectedWindow();
        playerObj.tfId = tfId; //设施ID
        playerObj.isPlaying = true; //正在播放
        CameraRecord.playerArray.put(winNum, playerObj);
    },
    /**
     * 设置本地参数
     * 回放参数，抓图格式，路径
     * */
    setLocalParam: function () {
        var configXml = '<?xml version="1.0" encoding="UTF-8"?>'+
                '<Config><CapPic><Mode>' + 0 +//0-jpg 1-bmp
            '</Mode><Path>' + 'c://picDir'+
            '</Path></CapPic>'+'<CutVideo><Path>' + 'c://videoDir'+
            '</Path></CutVideo></Config>';
        var player = CameraRecord.getPlayer();
        player.SetLocalParam(configXml);
    },
    /**
     * 清空回放参数
     * */
    clearPlayBackParam: function () {
        var player = CameraRecord.getPlayer();
        player.ClearPlayBackParam();
    }
};
var LoginCenter = {
    isLogin : false, //是否已经登录
    playerClass : null, //player的样式

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
     * 登录插件 历史录像回放
     * @param {Object} player
     */
    loginPlug : function(config) {
        if (LoginCenter.isLogin == true) {
            LoginCenter.loginOut();
        }

        var player = CameraRecord.getPlayer();
        if(player.object == null) {
            alert(getJsRes("PLUGIN_UNINSTALL").PLUGIN_UNINSTALL);
        }else{
            LoginCenter.isLogin = true;
            //player.SetOcxMode(0);
        }
    },

    /**
     * 是否安装插件
     */
    isInstallActiveX : function () {
        try{
            var comActiveX = new ActiveXObject("PLAYBACK_OCX.PlayBack_OCXCtrl.1");
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
        var playerHtml = "<OBJECT id='playBackOcx' style='width: 100%;height: 100%;' CLASSID='clsid:5DEF5889-AD46-4FC0-AEBE-B54E6CD71C96'></OBJECT>";
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
    }
};