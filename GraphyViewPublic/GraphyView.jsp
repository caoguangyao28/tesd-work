<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../../../../../web.inc"%>
<html style="width:100%;height:100%;">
<head>
<%
  String chartViewId = request.getParameter("chartViewId");
%>
<link type="text/css" href="<%=WebRoot%>skins/default/projectized/zhoushan/css/pagecss/zh_CN/rts/portal/Portal.css" rel="stylesheet">
<link type="text/css" href="<%=WebRoot%>skins/default/css/pagecss/zh_CN/public/portal/PortalPublic.css" rel="stylesheet">
<link type="text/css" href="<%=WebRoot%>skins/default/projectized/zhoushan/css/pagecss/zh_CN/rts/viewer/graphy/GraphyView.css" rel="stylesheet">
<!-- <script type="text/javascript" src="public/portal/ResourcesUtil.js"></script> -->
<script type="text/javascript">
var webroot = "<%=WebRoot%>";
var chartViewId = "<%= chartViewId%>";
//同步
var ServiceUtil ={};
ServiceUtil.runSyncFunction2 = function (param, method, service) {
	if (null == param) {
		param = {};
	}
	if (null == service || "" == service) {
		//这里暂时沿用之前的service，后面统一改成PORTAL_SERVICE_NAME
		service = ServiceUtil.DEFAULT_SERVICE_NAME;//PORTAL_SERVICE_NAME
	}
	param.method = method;
	return callRemoteFunction(service, param);
}

//异步
ServiceUtil.runAsyncFunction2 = function (param, method, service, callback) {
	if (null == param) {
		param = {};
	}
	if (null == service || "" == service) {
		//这里暂时沿用之前的service，后面统一改成PORTAL_SERVICE_NAME
		service = ServiceUtil.DEFAULT_SERVICE_NAME;//PORTAL_SERVICE_NAME
	}
	param.method = method;
	callRemoteFunctionAsync(service, param, null, callback);
}
</script>
</head>
<body style="width:100%;height:100%;">
<div class="graphyView" style="width:100%;height:100%;background-color:#ffffff;">
	<div class="graphypanel-title">
		   <h3>查询统计</h3>
	</div>
    <div id="serachForm" class="graphypanel-body"></div>
    <div id="graphypanelTitle" class="graphypanel-title">
        <h3 id="graphyViewName"></h3>
        <span id="theEndDate"></span>
	</div>
    <div id="graphypanelView" class="graphypanel-body" style="padding: 0;">
        <div style="width: 100%;height: 100%;" id="graphyView">

        </div>
    </div>
</div>
<script type="text/javascript" src="public/common/echarts-all.js"></script>
<script type="text/javascript" src="modules/public/viewer/graphy/bizjs/GraphyView.js"></script>
</body>
</html>