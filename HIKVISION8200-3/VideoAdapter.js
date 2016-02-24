/**
 * 摄像头接口适配器，接口调用统一入口
 * <插件的登入、销毁、装载都应该在各实现类js中完成，该文件只对页面功能挂钩的进行适配>
 */
var Vedio = {
	
	/**
	 * 分屏
	 * @param {Object} val
	 */
	setScreen : function(val) {
		Camera.setDivMode(val);
	},
	
	/**
	 * 视频播放统一入口
	 */
	play : function(tfId) {
		var inParam = {};
		inParam.method = "qryDeviceDetailById";
		inParam.deviceId = tfId;
		var vendor = GloableConfig.getHostByVendor(GloableConfig.DEFAULT_VENDOR);
		inParam.vendor = vendor.VENDORID;
		var result = callRemoteFunction("TrafficMgrByVideoService", inParam).DEVICE_DETAIL;
		if (null == result || result.length <= 0) {
			alert(getJsRes("DEVICE_UNAVAILABLE").DEVICE_UNAVAILABLE); //没有匹配的摄像头信息
			return;
		}
		//Vedio.setAttributes();
		Camera.devicePlay(result.TF_CODE, tfId);
	},
	
	hideToolBar: function(commond) {
		Camera.hideToolBar(commond);
	},
	
	setAttributes : function() {
		LoginCenter.isMultiScreen = false;//海康不需要 手工创建多屏
		Camera.IS_PZT_CONTROLLABLE = true;
		//if ("HOTAN" == GloableConfig.DEFAULT_VENDOR) {
		//	LoginCenter.isMultiScreen = true;
		//}else  { //海康等不需要多屏
		//	LoginCenter.isMultiScreen = false;
		//}
		//
		//if ("HOTAN" == GloableConfig.DEFAULT_VENDOR) { //浩天不支持云台
		//	Camera.IS_PZT_CONTROLLABLE = false;
		//} else {
		//	Camera.IS_PZT_CONTROLLABLE = true;
		//}
	},
	
	/**
	 * 选择窗口进行播放
	 * @param {Object} guid
	 * @param {Object} windowNum
	 */
	seletedWindowToPlay : function(guid, windowNum, tfId) {
		Camera.openSelectedWindowStream(guid, windowNum, tfId);
	},
	
	getSelectedWindow : function() {
		return Camera.getSelectedWindow();
	},
	
	getSelectedWinTfCode : function(winNum) {
		return Camera.getSelectedWinTfCode(winNum); 
	},
	
	getSelectedWinTFId : function(winNum) {
		return Camera.getSelectedWinTFId(winNum); 
	},
	
	/**
	 * 初始化云镜步长
	 * @param opType 0:初始化；1：增大；-1：减小
	 */
	optPTZStep : function(opType) {
		var currentStep = 0; //记录当前步长
		var oneTenthOfInterval = 0; //十分之一的间隔
		var maxInterval = 0; //最大步长
		if ("GLOBAL_EYE" == GloableConfig.DEFAULT_VENDOR) {
			currentStep = Camera.getPZTStep(); //全球眼默认是150
			maxInterval = 255;
			oneTenthOfInterval = 20; //每小格增长量为20，则最大支持步长为20 * 10
		} else if ("ZNV" == GloableConfig.DEFAULT_VENDOR) {
			currentStep = Camera.currentStep; //获取力维摄像头当前步长
			maxInterval = 100;
			oneTenthOfInterval = 10; //每小格增长量为10，则最大支持步长为10 * 10
		}else if("HOTAN" == GloableConfig.DEFAULT_VENDOR) {
		 	currentStep = 5;
			maxInterval = 10;
			oneTenthOfInterval = 1; //每小格增长量为10，则最大支持步长为10 * 10
		}else if ("HIK" == GloableConfig.DEFAULT_VENDOR || 
					"HIK8200" == GloableConfig.DEFAULT_VENDOR) {
			currentStep = Camera.getPZTStep(); //获取海康当前步长
			if (null == currentStep || "undefined" == currentStep) {
				currentStep = 3; //默认为3
			}
			maxInterval = 7;
			oneTenthOfInterval = 1;
		} else if ("UNIVIEW" == GloableConfig.DEFAULT_VENDOR) {
			currentStep = Camera.getPZTStep(); //获取宇世科技当前步长
			if (null == currentStep || "undefined" == currentStep) {
				currentStep = 3; //默认为3
			}
			maxInterval = 9;
			oneTenthOfInterval = 1;
		} else if("DAHUA" == GloableConfig.DEFAULT_VENDOR) {
			currentStep = Camera.currentStep; //获取大华，默认为1
			maxInterval = 8;
			oneTenthOfInterval = 1; //每小格增长量为10，则最大支持步长为10 * 10
		} else if("ZANGYU" == GloableConfig.DEFAULT_VENDOR) {
			currentStep = Camera.currentStep; //默认为4
			maxInterval = 6;
			oneTenthOfInterval = 1; //每小格增长量为10，则最大支持步长为10 * 10
		}
		
		var n = Math.round(currentStep / oneTenthOfInterval); //四舍五入
		var m = n;
		if (1 == opType && n < 10) { //放大
			n = 9 - n;//页面上横条向上，而值是要增
			m += opType;
		} else if (-1 == opType && n > 1) { //缩小
			n = 10 - n + 1; //横条向下，值要减
			m += opType; //opType-1
		} else if (n == 10){
			n = 0;
		} else if (n == 1) {
			n = 9;
		} else if (0 == opType) { //初始化，如果n越大，则横条要向上
			n = 10 - n;			
		} else {
			return;
		}
		$("#divInterval li").each(function(index) {
			if ($(this).hasClass("on")) {
				$(this).removeClass("on");//避免初始化的时候存在该样式
			}
			if (n == index) {
				$(this).addClass("on");
			}
		});
		Camera.setPTZStep(m * oneTenthOfInterval);//全球眼、力维都是调同一名称
	},
	
	/**
	 * 云镜控制 use
	 * @command 指令
	 * @mouseEvent 鼠标动作
	 */
	PZTControl : function(command, mouseEvent) {
		var cmdGlobalEye = null;
		var cmdZNV = null;
		var cmdHIK = null;
		var cmdUNIVIEW = null;
		var cmdDAHUA = null;
		var cmdZANGYU = null;
		if("TOP_LEFT" == command){//左上
			cmdDAHUA = 5;
		}else if("TOP_RIG" == command){//右上
			cmdDAHUA = 7;
		}else if("DOWN_LEFT" == command){//左下
			cmdDAHUA = 6;
		}else if("DOWN_RIG" == command){//右下
			cmdDAHUA = 8;
		} else if ("UP" == command) { //向上
			cmdGlobalEye = 3;
			cmdZNV = 21;
			cmdHIK = 21;
			cmdUNIVIEW = 0x0402;
			cmdDAHUA = 1;
			cmdZANGYU = 0x01;
		} else if ("DOWN" == command) { //向下
			cmdGlobalEye = 4;
			cmdZNV = 22;
			cmdHIK = 22;
			cmdUNIVIEW = 0x0404;
			cmdDAHUA = 2;
			cmdZANGYU = 0x05;
		}else if ("LEFT" == command) { //向左
			cmdGlobalEye = 1;
			cmdZNV = 23;
			cmdHIK = 23;
			cmdUNIVIEW = 0x0504;
			cmdDAHUA = 3;
			cmdZANGYU = 0x02;
		} else if ("RIGHT" == command) { //向右
			cmdGlobalEye = 2;
			cmdZNV = 24;
			cmdHIK = 24;
			cmdUNIVIEW = 0x0502;
			cmdDAHUA = 4;
			cmdZANGYU = 0x04;
		} else if ("LOCK" == command) { //锁定
			cmdGlobalEye = 11;
			cmdZNV = 29;//力维锁定变为自动转动
			cmdHIK = 29; //海康锁定变为自动转动
			cmdZANGYU = 0x03; //藏愚为自动转动
			if("UNIVIEW" == GloableConfig.DEFAULT_VENDOR) {
				Camera.PZTLock("", "LOCK");
			} else if ("DAHUA" == GloableConfig.DEFAULT_VENDOR) {
				cmdDAHUA = -1;//大华不做任何动作(停止在鼠标弹起时已做)
			}
		} else if ("GUANGQUAN_ZOOMIN" == command) { //光圈放大
			cmdGlobalEye = 7;
			cmdZNV = 15;
			cmdHIK = 15;
			cmdUNIVIEW = 0x0104;
			cmdDAHUA = 2;
			cmdZANGYU = 0x0B;
		} else if ("GUANGQUAN_ZOOMOUT" == command) { //光圈缩小
			cmdGlobalEye = 8;
			cmdZNV = 16;
			cmdHIK = 16;
			cmdUNIVIEW = 0x0102;
			cmdDAHUA = 5;
			cmdZANGYU = 0x0C;
		} else if ("JIAOJU_ZOOMIN" ==command) { //焦距放大
			cmdGlobalEye = 5;
			cmdZNV = 11;
			cmdHIK = 11;
			cmdUNIVIEW = 0x0302;
			cmdDAHUA = 0;
			cmdZANGYU = 0x0A;
		} else if ("JIAOJU_ZOOMOUT" == command) { //焦距缩小
			cmdGlobalEye = 6;
			cmdZNV = 12;
			cmdHIK = 12;
			cmdUNIVIEW = 0x0304;
			cmdDAHUA = 3;
			cmdZANGYU = 0x06;
		} else if ("JUJIAO_ZOOMIN" == command) { //聚焦放大
			cmdGlobalEye = 9;
			cmdZNV = 13;
			cmdHIK = 13;
			cmdUNIVIEW = 0x0202;
			cmdDAHUA = 1;
			cmdZANGYU = 0x07;
		} else if ("JUJIAO_ZOOMOUT" == command) { //聚焦缩小
			cmdGlobalEye = 10;
			cmdZNV = 14;
			cmdHIK = 14;
			cmdUNIVIEW = 0x0204;
			cmdDAHUA = 4;
			cmdZANGYU = 0x09;
		}
		if ("GLOBAL_EYE" == GloableConfig.DEFAULT_VENDOR) {
			Camera.PZTControl('', cmdGlobalEye);
		} else if ("ZNV" == GloableConfig.DEFAULT_VENDOR) {
			Camera.PZTControl('', cmdZNV, mouseEvent);
		} else if ("HIK" == GloableConfig.DEFAULT_VENDOR || "HIK8200" == GloableConfig.DEFAULT_VENDOR) {
			Camera.PZTControl('', cmdHIK, mouseEvent);
		} else if ("UNIVIEW" == GloableConfig.DEFAULT_VENDOR) {
			Camera.PZTControl('', cmdUNIVIEW, mouseEvent);
		} else if ("DAHUA" == GloableConfig.DEFAULT_VENDOR) {
			if (command.indexOf("ZOOM") > -1) { //焦距操作
			    Camera.LensControl('', cmdDAHUA, mouseEvent);
			} else {
			    Camera.PZTControl('', cmdDAHUA, mouseEvent);
			}
		} else if("ZANGYU" == GloableConfig.DEFAULT_VENDOR) {
			Camera.PZTControl('', cmdZANGYU, mouseEvent);
		}
	},
	
	/**
	 * 关闭摄像头
	 */
	closePlayer : function() {
		Camera.closePlayer();
		//还原录像状态
		$("#startRecord").css("display", "block");
		$("#stopRecord").css("display", "none");
	},
	
	/**
	 * 控件内部关闭预览时需清空预览记录
	 * @param {Object} winNum
	 */
	cleanWinPlayer : function(winNum) {
		//还原录像状态
		Camera.cleanWinPlayer(winNum);
		$("#startRecord").css("display", "block");
		$("#stopRecord").css("display", "none");
	},
	
	/**
	 * 关闭所有摄像头
	 */
	closeAllPlayer : function() {
		Camera.closeAllPlayer();
		//还原录像状态
		$("#startRecord").css("display", "block");
		$("#stopRecord").css("display", "none");
	},
	
	/**
	 * 抓拍
	 */
	localCapPic : function() {
		Camera.localCapPic(); //全球眼、力维都是调同一名称
	},
	
	/**
	 * 设置窗口
	 */
	settings : function() {
		if ("GLOBAL_EYE" == GloableConfig.DEFAULT_VENDOR) {
			//全球眼只设定录像文件保存地址
			Camera.setRecordLocalPath();
		} else if ("ZNV" == GloableConfig.DEFAULT_VENDOR) {
			//中兴力维设定录像和抓拍保存路径
			Camera.setSavePath();
		}
	},
	
	setRecordState : function(winNum) {
		var recordState = Camera.getSelectWinRecordState(winNum);
		if (recordState) { //正在录像
			$("#startRecord").css("display", "none");
			$("#stopRecord").css("display", "block");
		} else {
			$("#startRecord").css("display", "block");
			$("#stopRecord").css("display", "none");
		}
	},
	
	/**
	 * 本地录像
	 * @param {Object} opType
	 */
	localRecord : function(opType) {
		if(!Camera.isPlaying()) {
			alert(getJsRes("UNSELECTED_DEVICE").UNSELECTED_DEVICE);
			return false;
		}
		//更新"录像/停止"按钮
		if ("START_RECORD" == opType) {
			$("#startRecord").css("display", "none");
			$("#stopRecord").css("display", "block");
		}else {
			$("#startRecord").css("display", "block");
			$("#stopRecord").css("display", "none");
		}
		//调用对应本地录像
		var res = Camera.localRecord(opType);
	},
	
	/**
	 * 查询网络录像文件
	 * @param {Object} tfCode 摄像头编码
	 * @param {Object} begintime 开始时间 yyyy-MM-dd hh:mm:ss
	 * @param {Object} endtime 结束时间 yyyy-MM-dd hh:mm:ss
	 */
	queryRemoteRecord : function(tfId, tfCode, begintime, endtime, isPlay, isDownload) {
		//记录查询数据，可以在后期补充分页查询
		Grid.tfCode = tfCode;
		Grid.tfId = tfId;
		Grid.startTime = begintime;
		Grid.endTime = endtime;
		Grid.isPlay = isPlay;
		Grid.isDownload = isDownload;
		if ("GLOBAL_EYE" == GloableConfig.DEFAULT_VENDOR) {
			Camera.queryRemoteRecord(tfCode, "0", begintime, endtime, 1);
		} else {
			Camera.queryRemoteRecord(tfCode, begintime, endtime, isPlay, isDownload);
		}
	},
	
	/**
	 * 设置远程录像文件下载存放路径
	 */
	setRemoteRecordDownloadSavePath : function() {
		Camera.setRemoteRecordDownloadSavePath();
	},
	
	/**
	 * 批量下载录像文件
	 */
	/**downloadSelectedRecord : function() {
		if ("GLOBAL_EYE" == GloableConfig.DEFAULT_VENDOR) {
			RecordDownHelper.downloadSelectedRecord();
		} else if ("ZNV" == GloableConfig.DEFAULT_VENDOR) {
			RecordDownHelper.downloadSelectedRecord();
		}
	},*/
	
	/**
	 * 预置位
	 * @param {Object} cameraId 摄像头编号
	 * @param {Object} type 类型set:设置;delete:删除;call:调用
	 * @param {Object} num 预置位编号
	 */
	preSetCamera : function(cameraId, type, num) {
		if ("GLOBAL_EYE" == GloableConfig.DEFAULT_VENDOR) {
			if("call" == type) {
				Camera.PZTControl(cameraId, 2); //模拟摄像头移动
			}
		} else if ("ZNV" == GloableConfig.DEFAULT_VENDOR) {
			var command = null;
			//8:设置;9:删除;39:调用
			if ("set" == type) {
				command = 8;
			} else if ("delete" == type) {
				command = 9;
			} else if ("call" == type) {
				command = 39;
			} else {
				alert("预置位指令错误!");
				return;
			}
			Camera.preSetCamera(cameraId, command, num); //预置位接口调用
		} else if ("HIK" == GloableConfig.DEFAULT_VENDOR) {
			Camera.preSetCamera(type, num);
		} else if ("UNIVIEW" == GloableConfig.DEFAULT_VENDOR) {
			Camera.preSetCamera(cameraId, type, num);
		} else if("DAHUA" == GloableConfig.DEFAULT_VENDOR) {
			var command = null;
			//2:设置;3:删除;1:调用
			if ("set" == type) {
				command = 2;
			} else if ("delete" == type) {
				command = 3;
			} else if ("call" == type) {
				command = 1;
			}
			Camera.preSetCamera(cameraId, command, num); //预置位接口调用
		} else if ("ZANGYU" == GloableConfig.DEFAULT_VENDOR) {
			var command = null;
			//2:设置;3:删除;1:调用
			if ("set" == type) {
				command = 0;
			} else if ("delete" == type) {
				command = 1;
			} else if ("call" == type) {
				command = 2;
			}
			Camera.preSetCamera(cameraId, command, num); //预置位接口调用
		}
	},
	
	/**
	 * 开始网络录像
	 * @param {Object} time
	 */
	/**startRemoteRecord: function(time) {
		if ("GLOBAL_EYE" == GloableConfig.DEFAULT_VENDOR) {
			Camera.startRemoteRecord(60);
			$("#stopRecord").css("display", "block");
			$("#stopRecord").attr("disabled", "disabled");
			$("#startRecord").css("display", "none");
			setTimeout(function() { //60秒后可以暂停
				$("#stopRecord").removeAttr("disabled");
			}, 60000);
		} else if ("ZNV" == GloableConfig.DEFAULT_VENDOR) {
			alert(getJsRes("UNSUPPORT").UNSUPPORT); //力维不支持网络录像
		} else if ("HIK" == GloableConfig.DEFAULT_VENDOR) {
			
		} else if("UNIVIEW" == GloableConfig.DEFAULT_VENDOR) {
			Camera.optRemoteRecord(0);
			$("#stopRecord").css("display", "block");
			$("#startRecord").css("display", "none");
		}
	},*/
	
	
	/**
	 * 停止网络录像
	 */
	/**stopRemoteRecord : function() {
		if ("GLOBAL_EYE" == GloableConfig.DEFAULT_VENDOR) {
			Camera.optRemoteRecord(1);
		} else if ("ZNV" == GloableConfig.DEFAULT_VENDOR) {
			alert(getJsRes("UNSUPPORT").UNSUPPORT);
		} else if ("UNIVIEW" == GloableConfig.DEFAULT_VENDOR) {
			Camera.optRemoteRecord(1);
		}
		$("#stopRecord").css("display", "none");
		$("#startRecord").css("display", "block");
	},*/

	/*******************视频巡视**************************/
	
	/**
	 * 获取在视频巡逻时选中的录像文件名
	 * @param {Object} rows
	 */
	getSelectedFiles: function(rows){
		return Grid.getSelectedFiles(rows); //统一调用该接口
	},
	/**
	 * 获取在视频巡逻时选中的录像文件其他属性
	 * @param {Object} rows
	 */
	getSelectedFilesAttr : function(rows, tfId, userId) {
		return Grid.getSelectedFilesAttr(rows, tfId, userId);//统一调用该接口
	},
	
	/**
	 * 获取网络录像文件
	 * @param {Object} res
	 */
	getRecordFiles : function(res) {
		return Grid.getRecordFiles(res, true, true);
	},
	
	/**
	 * 显示下载完成的百分比
	 */
	showRecordDownloadPercent : function(percent) {
		RecordDownHelper.showRecordDownloadPercent(percent);
	},
	
	/**
	 * 录像回放
	 * @param {Object} param
	 */
	recordRePlay : function(param){
		Camera.recordRePlay(param);
	},
	
	/**
	 * 停止录像回放
	 * @param {Object} param
	 */
	recordRePlayStop : function(param) {
		Camera.recordRePlayStop(param);
	},
	
	/**
	 * 录像继续暂停
	 * @param {Object} param
	 */
	recordRePlayPause : function(param) {
		Camera.recordRePlayPause(param);
	},
	
	/**
	 * 录像继续回放
	 * @param {Object} param
	 */
	recordRePlayResume : function(param) {
		Camera.recordRePlayResume(param);
	},
	
	recordRePlaySpeedSet : function(speedValue) {
		var value = null;
		switch(speedValue) {
			case 0:
				if ("DAHUA" == GloableConfig.DEFAULT_VENDOR) {
					value = 1;
				} else if("ZANGYU" == GloableConfig.DEFAULT_VENDOR) {
					value = -2; //藏愚1/8和1/4为等值
				}
				break;
			case 1:
				if ("DAHUA" == GloableConfig.DEFAULT_VENDOR) {
					value = 2;
				} else if("ZANGYU" == GloableConfig.DEFAULT_VENDOR) {
					value = -2; //藏愚1/8和1/4为等值
				}
				break;
			case 2:
				if ("DAHUA" == GloableConfig.DEFAULT_VENDOR) {
					value = 4;
				} else if("ZANGYU" == GloableConfig.DEFAULT_VENDOR) {
					value = -1;
				}
				break;
			case 3:
				if ("DAHUA" == GloableConfig.DEFAULT_VENDOR) {
					value = 8;
				} else if("ZANGYU" == GloableConfig.DEFAULT_VENDOR) {
					value = 0;
				}
				break;
			case 4:
				if ("DAHUA" == GloableConfig.DEFAULT_VENDOR) {
					value = 16;
				} else if("ZANGYU" == GloableConfig.DEFAULT_VENDOR) {
					value = 1;
				}
				break;
			case 5:
				if ("DAHUA" == GloableConfig.DEFAULT_VENDOR) {
					value = 32;
				} else if("ZANGYU" == GloableConfig.DEFAULT_VENDOR) {
					value = 2;//藏愚4和8为等值
				}
				break;
			case 6:
				if ("DAHUA" == GloableConfig.DEFAULT_VENDOR) {
					value = 64;
				} else if("ZANGYU" == GloableConfig.DEFAULT_VENDOR) {
					value = 2;//藏愚4和8为等值
				}
				break;
		}
		Camera.recordRePlaySpeedSet(value);
	}
}
