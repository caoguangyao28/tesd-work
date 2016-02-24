$(function(){
	if (GloableConfig.CAMERA_GLOBAL_CONFIG == null) {
		GloableConfig.CAMERA_GLOBAL_CONFIG = new Array();
		GloableConfig.queryCameraConfig();
		//加载Map
		GloableConfig.loadScriptToJsp(g_GlobalInfo.WebRoot + "modules/traffic-management/video/monitor/utils/JSMap.js");
		
		//如果是力维，则需要加载多屏js+导入工具JS
		if ("ZNV" == GloableConfig.DEFAULT_VENDOR) {
			GloableConfig.loadScriptToJsp(g_GlobalInfo.WebRoot + "modules/traffic-management/video/monitor/utils/MultiScreen.js");
		}else if("HOTAN" == GloableConfig.DEFAULT_VENDOR){
			GloableConfig.loadScriptToJsp(g_GlobalInfo.WebRoot + "modules/traffic-management/video/monitor/monitor_hotan/js/MultiScreen.js");
		}
		//加载控件js
		var vendor = GloableConfig.getVendorScript(GloableConfig.DEFAULT_VENDOR);
		GloableConfig.loadScriptToJsp(vendor);
	}
});

/**
 * 查询厂家服务配置信息
 */
var GloableConfig = {
	/**
	 * 默认视屏厂家，该参数支持配置或者系统自动设定该参数
	 */
	DEFAULT_VENDOR : null,
	
	DEFAULT_SERVER : null, //默认的厂家所有配置对象
	
	/**
	 * 摄像头全局配置信息数组
	 */
	CAMERA_GLOBAL_CONFIG : null,
	
	/**
	 * 各厂家对应的js文件脚本路径
	 */
	VENDOR_SCRIPT : {
		GLOBAL_EYE : g_GlobalInfo.WebRoot + "modules/sts/infrastructure/integration/camera/monitor_globaleye/js/VedioPlayer_GLOBALEYE.js",
		ZNV : g_GlobalInfo.WebRoot + "modules/sts/infrastructure/integration/camera/monitor_znv/js/VideoPlayer_ZNV.js",
		ZTESOFT: "",
		HIK : g_GlobalInfo.WebRoot + "modules/sts/infrastructure/integration/camera/monitor_hik/js/VedioPlayer_HIK.js",
		HIK8200 : g_GlobalInfo.WebRoot + "modules/sts/infrastructure/integration/camera/monitor_hik8200/js/VedioPlayer_HIK.js",
		UNIVIEW: g_GlobalInfo.WebRoot + "modules/sts/infrastructure/integration/camera/monitor_uniview/js/VedioPlayer_UNIVIEW.js",
		HOTAN: g_GlobalInfo.WebRoot + "modules/traffic-management/video/monitor/monitor_hotan/js/VedioPlayer_HOTAN.js",
		DAHUA: g_GlobalInfo.WebRoot + "modules/traffic-management/video/monitor/monitor_dahua/bizjs/VideoPlayer_DAHUA.js",
		ZANGYU: g_GlobalInfo.WebRoot + "modules/traffic-management/video/monitor/monitor_zangyu/bizjs/VideoPlayer_ZANGYU.js",
		HIK_HGT: g_GlobalInfo.WebRoot + "modules/traffic-management/video/monitor/monitor_hikhgt/VedioPlayer_HIK.js"
	},
	
	/**
	 * 查询摄像头厂家服务器配置信息
	 * VENDOR/HOST/PORT/USER_NAME/PASSWORD/ATTRIBUTES
	 */
	queryCameraConfig : function() {
		var inParam = {};
		inParam.method = "qryDeviceHostConfig";
		inParam.sysconfiKey = "IMCP.CAMERA.CAMERA_ACCESS_CONFIG";
		var result = callRemoteFunction("TrafficMgrByVideoService", inParam);
		if (result && result.DEVICE_HOSE_CONFIG) {
			for(var i=0; i<result.DEVICE_HOSE_CONFIG.length; i++) {
				var cameraConfig = result.DEVICE_HOSE_CONFIG[i];
				this.CAMERA_GLOBAL_CONFIG.push(cameraConfig);
				if (cameraConfig.DEFAULT == "true") {
					GloableConfig.DEFAULT_SERVER = cameraConfig; //当前默认的Server
					GloableConfig.DEFAULT_VENDOR = GloableConfig.DEFAULT_SERVER.VENDOR;
					break;
				}
			}
		}
	},
	
	/**
	 * 获取各厂家值
	 */
	getDefaultVendorValue : function() {
		return GloableConfig.DEFAULT_SERVER.VENDORID;
		
	},
	
	/**
	 * 获取厂家名称
	 * @param {Object} value
	 */
	getOrgVenderName : function(value) {
		if (!value) { //如果未指定厂商名，则取默认厂商
			value = GloableConfig.DEFAULT_SERVER.VENDORID;
		}
		for(var i = 0; i < GloableConfig.CAMERA_GLOBAL_CONFIG.length; i++) {
			if (value == GloableConfig.CAMERA_GLOBAL_CONFIG[i].VENDORID) {
				return GloableConfig.CAMERA_GLOBAL_CONFIG[i].VENDORNAME;
			}
		}
	},
	
	/**
	 * 获取不同视频厂家js
	 */
	getVendorScript : function(vendor) {
		if (null == vendor) { //如果未指定厂家，则获取默认配置厂家
			vendor = GloableConfig.DEFAULT_VENDOR;
		}
		if ("GLOBAL_EYE" == vendor) {
			return this.VENDOR_SCRIPT.GLOBAL_EYE;
		} else if ("ZNV" == vendor) {
			return this.VENDOR_SCRIPT.ZNV;	
		} else if ("ZTESOFT" == vendor) {
			return this.VENDOR_SCRIPT.ZTESOFT;
		} else if ("HIK" == vendor) {
			return this.VENDOR_SCRIPT.HIK;
		} else if ("EQUIP" == vendor) {
			return null;
		} else if("UNIVIEW" == vendor) {
			return this.VENDOR_SCRIPT.UNIVIEW;
		} else if("HOTAN" == vendor) {
			return this.VENDOR_SCRIPT.HOTAN;
		} else if("HIK8200" == vendor) {
			return this.VENDOR_SCRIPT.HIK8200;
		} else if("DAHUA" == vendor) {
			return this.VENDOR_SCRIPT.DAHUA;
		} else if("ZANGYU" == vendor) {
			return this.VENDOR_SCRIPT.ZANGYU;
		} else if("HIK_HGT" == vendor) {
			return this.VENDOR_SCRIPT.HIK_HGT;
		}
		
	},
	
	/**
	 * 动态加载js到jsp文件中
	 * @param {Object} url
	 */
	loadScriptToJsp : function(url) {
		if (url && url.length > 0) {
			var s = document.createElement("script");
			s.type = "text/javascript";
			s.async = true;
			s.src = url;
			$(s).insertAfter("title");
		}
	},
	
	/**
	 * 根据厂家获取服务器配置信息
	 * @param {Object} vendor
	 */
	getHostByVendor : function(vendor) {
		for(var i=0; i<this.CAMERA_GLOBAL_CONFIG.length; i++) {
			var config = this.CAMERA_GLOBAL_CONFIG[i];
			if (vendor == config.VENDOR) {
				return config;
			}
		}
	}
};
