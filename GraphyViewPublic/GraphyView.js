var GraphyView = function($) {

    var moduleClass = "graphyView";
    var serviceName = "GraphyViewSevice";
    var dateType = 'D';
    var viewObj;
    var statisticalClassSelect;
    var restXdata = [];
    var dynamicCondition = [];

    // 选择器自动加模块class前缀
    function $4(selector) {
        return $("." + moduleClass + " " + selector);
    }

    function initMustCondition(viewObj) {
        var selectTye = '';
        if (viewObj.CHART_VIEW_TYPE == 2) {
            selectTye += '<div class="input-group floatLeft"><label>统计分类：</label>' +
                '<select id="statisticalClass"  style="height:25px;width:190px;"></select></div>';
        }
        var tempHtml = selectTye + '<div id="statisticalCycleGroup" class="input-group floatLeft"><label>统计周期：</label>' +
            '<select id="statisticalCycle"  style="height:25px;width:190px;"></select></div>' +
            '<div class="input-group floatLeft"><label>开始时间：</label>' +
            '<input type="text" id="startTime" style="height: 25px; width: 190px;" onfocus="GraphyView.createDatePicker(this);" class="Wdate"></div>' +
            '<div class="input-group floatLeft"><label>结束时间：</label>' +
            '<input type="text" id="endTime" style="height: 25px; width: 190px;" onfocus="GraphyView.createDatePicker(this);" class="Wdate">' +
            '</div>';


        tempHtml += '<div class="input-group floatLeft"><a class="p-button" style="margin:0;" href="javascript:;" onclick="GraphyView.qryGraphyView()">查询</a></div>';

        $4('#serachForm').append(tempHtml);


        // 初始化 统计周期 默认 时间
        $4('#statisticalCycle').combobox({
            valueField: 'STAT_PERI',
            textField: 'STAT_PERI_NAME',
            panelHeight: 100,
            data: [],
            onSelect: function(record) {
                //初始化 时间框的 默认值
                dateType = record.STAT_PERI;
                changeDateDefault();
            },
            onLoadSuccess: function() { //加载完成后,设置选中第一项
                var tempData = $4('#statisticalCycle').combobox("getData");
                if (tempData != '') {
                    $(this).combobox("select", tempData[0].STAT_PERI);
                }
            }
        });

        //手动初始化 下拉选择控件
        if (viewObj.CHART_VIEW_TYPE == 2) {
            //统计分类下拉
            var chartViewId = viewObj.CHART_VIEW_ID;
            $4('#statisticalClass').combobox({
                valueField: 'IDX_CAT_ID',
                textField: 'BIZ_DATA_NAME',
                panelHeight: 100,
                data: getStatisticalClass(chartViewId),
                onSelect: function(record) {
                    statisticalClassSelect = record;
                    //console.log(record);
                    //改变统计周期的 数据
                    var newData = getStatisticalCycle();
                    $4('#statisticalCycle').combobox('clear');
                    $4('#statisticalCycle').combobox('loadData', newData);
                    if (newData.length < 1) {
                        dateType = "";
                        changeDateDefault();
                    }
                },
                onLoadSuccess: function() { //加载完成后,设置选中第一项
                    var tempData = $4('#statisticalClass').combobox("getData");
                    if (tempData != '') {
                        $(this).combobox("select", tempData[0].IDX_CAT_ID);
                    }
                }
            });
        }


        $4('#serachForm').ready(function() {
            _qryGraphyView();
        });
    }

    function changeDateDefault() {
        var curDate = getCurDate();
        $4('#endTime').parent().show();
        $4('#startTime').parent().find('label').text('开始时间：');
        $4('#startTime').show();
        if (dateType == '') {
            $4('#endTime').val("");
            $4('#startTime').val("");
        }
        if (dateType == 'D') {
            //近 7 天
            var endDate = curDate.substring(0, 10);
            $4('#endTime').val(endDate);
            var startDate = DateSubDay(curDate, 6);
            startDate = startDate.getFullYear() + "-" + addZero(startDate.getMonth() + 1) + "-" + addZero(startDate.getDate());
            $4('#startTime').val(startDate);
        }
        if (dateType == 'M') {
            //近 12 个月
            var curmonth = curDate.substring(0, 7);
            var startDate = DateSubMonth(curDate, 11);
            var startMonth = startDate.getFullYear() + "-" + addZero(startDate.getMonth() + 1);
            $4('#endTime').val(curmonth);
            $4('#startTime').val(startMonth);

        }
        if (dateType == 'Y') {
            //近 5 年
            var curYear = curDate.substring(0, 4);
            var startYear = parseInt(curYear) - 4;
            $4('#endTime').val(curYear);
            $4('#startTime').val(startYear);
        }
        if (dateType == 'H') { //精确到时
            var endDate = curDate.substring(0, 10);
            $4('#endTime').val(endDate);
            $4('#startTime').parent().find('label').text('统计日期：');
            $4('#startTime').val(endDate);
            $4('#endTime').parent().hide();
        }
    }

    function getCurDate() {
        var curDate = new Date();
        var curYear = curDate.getFullYear();
        var curMonth = curDate.getMonth() + 1;
        var curDay = curDate.getDate();

        var hh = curDate.getHours(); //时
        var mm = curDate.getMinutes(); //分

        if (curMonth < 10) {
            curMonth = '0' + curMonth;
        }
        if (curDay < 10) {
            curDay = '0' + curDay;
        }
        if (hh < 10) {
            hh = '0' + hh;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return curYear + '-' + curMonth + '-' + curDay + ' ' + hh + ':' + mm;
    }

    function addZero(d) {
        if (d < 10) {
            d = '0' + d;
        }
        return d;
    }

    function DateAddDay(sdate, dayNum) {
        var aDate = sdate.split('-');
        var a = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        a.setDate(a.getDate() + dayNum);
        a = new Date(a);
        return a;
    }

    function DateSubDay(sdate, dayNum) {
        var aDate = sdate.split('-');
        var a = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        a.setDate(a.getDate() - dayNum);
        a = new Date(a);
        return a;
    }

    function DateSubMonth(sdate, monthNum) {
        var aDate = sdate.split('-');
        var a = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        a.setMonth(a.getMonth() - monthNum);
        a = new Date(a);
        return a;
    }

    function DateAddMonth(sdate, monthNum) {
        var aDate = sdate.split('-');
        var a = new Date(aDate[1] + '-' + '01' + '-' + aDate[0]);
        a.setMonth(a.getMonth() + monthNum);
        a = new Date(a);
        return a;
    }

    function createDatePicker(e) {
        var dateFmt;
        if (dateType == 'D') {
            dateFmt = "yyyy-MM-dd";
            //new WdatePicker({dateFmt:"yyyy"});
        }
        if (dateType == 'M') {
            dateFmt = "yyyy-MM";
        }
        if (dateType == 'Y') {
            dateFmt = "yyyy";
        }
        if (dateType == 'H') {
            dateFmt = "yyyy-MM-dd"
        }
        new WdatePicker({
            dateFmt: dateFmt
        });
    }

    function getStatisticalCycle() {
        //viewObj,statisticalClassSelect
        var param = {};
        param.CHART_VIEW_ID = viewObj.CHART_VIEW_ID;
        if (viewObj.CHART_VIEW_TYPE == 2 && statisticalClassSelect) {
            param.BIZ_ID = statisticalClassSelect.BIZ_ID;
            param.BIZ_DATA_VALUE = statisticalClassSelect.BIZ_DATA_VALUE;
        }
        var cycleList = ServiceUtil.runSyncFunction2(param, "getStatisticalCycle", serviceName).list;
        if (cycleList) {
            return cycleList;
        } else {
            return [];
        }

    }

    function _qryGraphyView() {
        var idxCatId;

        var statPeri = $4('#statisticalCycle').combobox('getValue');

        var startTime = $4('#startTime').val();
        var endTime = $4('#endTime').val();

        if (viewObj.CHART_VIEW_TYPE == 2 && statisticalClassSelect) {

            idxCatId = statisticalClassSelect.IDX_CAT_ID;

        } else {
            idxCatId = viewObj.IDX_CAT_ID;
        }

        if(!statPeri || statPeri == ""){

            return;
        }

        if (startTime == "" || endTime == "" ) {
            // showMessage('开始时间不可大于结束时间');
            return;
        }

        if (startTime != "" && endTime != "" && endTime < startTime) {
            showMessage('开始时间不可大于结束时间');
            return;
        }



        startTime = startTime.replace(/-/g, '');
        endTime = endTime.replace(/-/g, '');

        if (statPeri == "H") {
            startTime += '00';
            endTime += '23';
        }


        param = {
            idxCatId: idxCatId,
            statPeri: statPeri,
            startTime: startTime,
            endTime: endTime
        };

        //动态条件部分
        if (dynamicCondition.length > 0) { //有
            param.dynamicConLength = dynamicCondition.length;
            for (var i = 0; i < dynamicCondition.length; i++) {
                var tempObj = dynamicCondition[i];
                var conditionId = "bizId" + tempObj.SORT_SEQ; //动态组件的 id
                var conditinType = tempObj.DISPLAY_MODE; //动态组件 类型 select input····
                if (conditinType == 3) { //input
                    param[conditionId] = $4(conditionId).val();
                } else { // select 多选 或 单选
                    param[conditionId] = $4(conditionId).combobox('getValue');
                }
            }
        }

        if (viewObj.DISPLAY_MODE == 1) {
            ServiceUtil.runAsyncFunction2(param, "getChareData", serviceName, function(ret) {
                changeGraphyTitleInfo(viewObj);
                if (ret.retList) {
                    var charData = ret.retList;
                    loadView(charData);
                } else {
//                    showMessage('没有相关图形数据~');
                    $4('#graphyView').html('没有相关图形数据');
                }
            });
        }

        if (viewObj.DISPLAY_MODE == 2) {
            ServiceUtil.runAsyncFunction2(param, "getChareDataDouble", serviceName, function(ret) {
                changeGraphyTitleInfo(viewObj);
                if (ret.retObj.dataList0) {
                    var charData = ret.retObj;
                    //console.log(charData);
                    loadView(charData);
                } else {
                    showMessage('没有相关图形数据~');
                    $4('#graphyView').empty();
                }
            });

        }



    }

    function getStatisticalClass(chartViewId) {
        var typeList = ServiceUtil.runSyncFunction2({
            CHART_VIEW_ID: chartViewId
        }, "getStatisticalClass", serviceName).list;
        var typeListAll = [];
        if (typeList) {
            for (var i = 0; i < typeList.length; i++) {
                typeListAll.push(typeList[i]);
            }
        }
        // console.log(typeListAll);
        return typeListAll;
    }



    function getChartView(ChartViewId) {
        ServiceUtil.runAsyncFunction2({
            ChartViewId: ChartViewId
        }, 'getChartView', serviceName, function(ret) {

            if (ret.viewObj) { //图形构成信息
                //  加载搜所条件
                viewObj = ret.viewObj;
            } else {
                viewObj = null;

            }
            loadSerachForm(viewObj);

        });
    }

    function loadSerachForm(chartViewObj) {
        if (chartViewObj) {
            ServiceUtil.runAsyncFunction2(chartViewObj, 'getSerachForm', serviceName, function(ret) {
                initMustCondition(chartViewObj);
                if (ret.serachObj) { //是否有 动态条件
                    //dynamicCondition = ret.serachObj;//动态条件 
                    // loadCondition(dynamicCondition);
                }

                //显示条件
                $4('#serachForm div').show();
            });
        } else {
            $4('#serachForm div').show();
        }
        changeGraphyTitleInfo(chartViewObj);


    }

    function loadCondition(dataList) {
        var tempHtml = '';
        var length = dataList.length;
        for (var i = 0; i < length; i++) {
            var tempObj = dataList[i];
            // console.log(tempObj);
            if (tempObj.DISPLAY_MODE == 1 || tempObj.DISPLAY_MODE == 2) {
                tempHtml += '<div class="input-group floatLeft"><label>' + tempObj.BIZ_NAME + ':</label>' +
                    '<select id="bizId' + tempObj.SORT_SEQ + '"  style="height:25px;width:190px;"></select></div>';
            }
            if (tempObj.DISPLAY_MODE == 3) {
                tempHtml += '<div class="input-group floatLeft"><label>' + tempObj.BIZ_NAME + ':</label>' +
                    '<input type="text" id="bizId' + tempObj.SORT_SEQ + '" style="height: 25px; width: 190px;"></div>';
            }

        }
        $4('#statisticalCycleGroup').before(tempHtml);

        //初始化控件
        for (var j = 0; j < length; j++) {
            var tempObj = dataList[j];
            var idSele = '#bizId' + tempObj.SORT_SEQ;
            if (tempObj.DISPLAY_MODE == 1 || tempObj.DISPLAY_MODE == 2) {
                $4(idSele).combobox({
                    valueField: 'BIZ_DATA_VALUE',
                    textField: 'BIZ_DATA_NAME',
                    panelHeight: 100,
                    data: getSelectData(tempObj.BIZ_ID),
                    onSelect: function(record) {
                        //statisticalClassSelect = record;
                        // console.log(record);
                    },
                    onLoadSuccess: function() { //加载完成后,设置选中第一项
                        var tempData = $4(idSele).combobox("getData");
                        if (tempData != '') {
                            $(this).combobox("select", tempData[0].BIZ_DATA_VALUE);
                        }
                    }
                });
            }


        }

    }

    function getSelectData(bizId) { //bizId 业务 id
        var retData = [];
        try {
            var retObj = ServiceUtil.runSyncFunction2({
                bizId: bizId
            }, "getSelectDataByBizId", serviceName);
            if (retObj && retObj.dataList) {
                retData = retObj.dataList;
            }
        } catch (e) {
            showMessage("查询异常！");
            return;
        }
        return retData;
    }

    function changeGraphyTitleInfo(viewObj) {
        var tempObj;
        if (viewObj) {
            tempObj = viewObj;
        } else {
            tempObj = {
                TITLE_NAME: '无视图数据'
            };
        }

        $4('#graphyViewName').text(tempObj.TITLE_NAME);
        var endtimeTishi = $4('#endTime').val();
        if(endtimeTishi == "undefined" || endtimeTishi == null || endtimeTishi == undefined ){
        	endtimeTishi = '';
        }
        $4('#theEndDate').text("截止日期：" + endtimeTishi);
    }

    function createXaxisData() {
        var type = $4('#statisticalCycle').combobox('getValue');
        var startTime = $4('#startTime').val();
        var endTime = $4('#endTime').val();
        var arrayLenth;
        restXdata = [];
        if (type == 'D') {
            arrayLenth = DateDiff(startTime, endTime);
            for (var i = 0; i < arrayLenth; i++) {
                if (i == 0) {
                    restXdata.push(startTime);
                } else {
                    var nextDate = DateAddDay(startTime, i);
                    nextDate = nextDate.getFullYear() + "-" + addZero(nextDate.getMonth() + 1) + "-" + addZero(nextDate.getDate());
                    restXdata.push(nextDate);
                }
            }
        }
        if (type == 'M') {
            arrayLenth = DateDiffMonth(startTime, endTime);
            for (var i = 0; i < arrayLenth; i++) {
                if (i == 0) {
                    restXdata.push(startTime);
                } else {
                    var nextDate = DateAddMonth(startTime, i);
                    nextDate = nextDate.getFullYear() + "-" + addZero(nextDate.getMonth() + 1);
                    restXdata.push(nextDate);
                }
            }
        }
        if (type == 'Y') {
            arrayLenth = parseInt(endTime) - parseInt(startTime) + 1;
            for (var i = 0; i < arrayLenth; i++) {
                if (i == 0) {
                    restXdata.push(startTime);
                } else {
                    var nextDate = parseInt(startTime) + i + '';
                    restXdata.push(nextDate);
                }
            }
        }

        if (type == 'H') {
            arrayLenth = 24;
            for (var i = 0; i < arrayLenth; i++) {
                restXdata.push(startTime + ' ' + addZero(i));
            }
        }
        return restXdata;
    }

    //计算天数差的函数，通用
    function DateDiff(sDate1, sDate2) {
        aDate = sDate1.split("-");
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        aDate = sDate2.split("-");
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) + 1;
        return iDays;
    }

    //计算月数差的函数，通用
    function DateDiffMonth(sDate1, sDate2) {
        var start = sDate1.split('-');
        var end = sDate2.split('-');
        var date1 = parseInt(start[0]) * 12 + parseInt(start[1]);
        var date2 = parseInt(end[0]) * 12 + parseInt(end[1]);
        var m = Math.abs(date1 - date2) + 1;
        return m;
    }

    function changeToSeriesData(xAxisData, retData) {
        var retArray = [];
        var seriesDataModeBar = {};
        var seriesDataModeLine = {};

        if (viewObj.DISPLAY_MODE == 1) {
            seriesDataModeBar.type = 'line';
            seriesDataModeBar.name = '总量';
            seriesDataModeBar.markPoint = {
                data: [{
                    type: 'max',
                    name: '最大值'
                }, {
                    type: 'min',
                    name: '最小值'
                }]
            };
        } else {
            seriesDataModeBar.type = 'bar';
            seriesDataModeBar.name = '总量';
            seriesDataModeBar.markPoint = {
                data: [{
                    type: 'max',
                    name: '最大值'
                }, {
                    type: 'min',
                    name: '最小值'
                }]
            };
            seriesDataModeLine.type = 'line';
            seriesDataModeLine.name = '增量';
            seriesDataModeLine.markPoint = {
                data: [{
                    type: 'max',
                    name: '最大值'
                }, {
                    type: 'min',
                    name: '最小值'
                }]
            };
            seriesDataModeLine.yAxisIndex = 1;
        }

        if (viewObj.DISPLAY_MODE == 1) {
            var dataArray = new Array(xAxisData.length);

            for (var j = 0; j < xAxisData.length; j++) {
                dataArray[j] = 0;
            }

            for (var i = 0; i < retData.length; i++) {
                var tempObj = retData[i];
                var theKey = tempObj.STAT_TIME;
                var theIndex = getIndex(theKey, xAxisData);
                if (theIndex != -1) {
                    dataArray[theIndex] = tempObj.IDX_DATA_VALUE;
                }
            }
            seriesDataModeBar.data = dataArray;
            retArray.push(seriesDataModeBar);
        } else {

            var dataArray = new Array(xAxisData.length);
            var dataArray2 = new Array(xAxisData.length);

            for (var j = 0; j < xAxisData.length; j++) {
                dataArray[j] = 0;
                dataArray2[j] = 0;
            }
            for (var m = 0; m < 2; m++) {
                var retDataTemp = retData['dataList' + m];

                for (var i = 0; i < retDataTemp.length; i++) {
                    var tempObj = retDataTemp[i];
                    var theKey = tempObj.STAT_TIME;
                    var theIndex = getIndex(theKey, xAxisData);
                    if (theIndex != -1) {
                        if (m == 0) {
                            dataArray[theIndex] = tempObj.IDX_DATA_VALUE;
                        } else {
                            dataArray2[theIndex] = tempObj.IDX_DATA_VALUE;
                        }

                    }

                }
            }
            seriesDataModeBar.data = dataArray;
            seriesDataModeLine.data = dataArray2;
            retArray.push(seriesDataModeBar);
            retArray.push(seriesDataModeLine);

            //console.log(retArray);

        }
        return retArray;
    }

    function getIndex(theKey, xAxisData) {
        var arrayLenth = xAxisData.length;
        var retIndex = -1;
        for (var i = 0; i < arrayLenth; i++) {
            var arrayValue = xAxisData[i];
            arrayValue = arrayValue.replace(/-/g, '').replace(" ", '');
            if (theKey == arrayValue) {
                retIndex = i;
            }
        }
        return retIndex;
    }

    function loadView(charData) {
    	$('#graphyView').empty();
        var viewYModle = viewObj.DISPLAY_MODE; // 1 单指标 曲线图 2双指标 左柱形 右曲线

        var legendArray = ['总量'];
        var yAxisArray = [{
            type: 'value',
            name: '数量'
        }];

        var xAxisData = createXaxisData();


        var SeriesData = changeToSeriesData(xAxisData, charData);



        if (viewYModle == 2) {
            legendArray.push("增量");
            var temp = {
                type: 'value',
                name: '增量',
                axisLabel: {
                    formatter: '{value}%'
                }

            };
            yAxisArray.push(temp);

        }
        // console.log(yAxisArray);
        var height1 = $('.graphyView').height() - $4('#serachForm').height() - 80;
        $4('#graphypanelView').height(height1);
        //console.log(yAxisArray);
        //console.log(SeriesData);
        $4('#graphypanelView').ready(function() {
            var myChart = echarts.init(document.getElementById('graphyView'));
            var option = {
                grid: {
                    x: 35,
                    y: 35,
                    x2: 35,
                    y2: 35
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: legendArray
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        magicType: {
                            show: true,
                            type: ['line', 'bar']
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                calculable: true,
                xAxis: [{
                    type: 'category',
                    data: xAxisData
                }],
                yAxis: yAxisArray,
                series: SeriesData
            };
            myChart.setOption(option);
        });
    }

    return {
        init: function() {

            if (chartViewId && chartViewId != 'undefined' && chartViewId != 'null') {
                chartViewId = chartViewId.replace(/(^\s*)|(\s*$)/g, "");
                getChartView(chartViewId);
            } else {
//                showMessage('没有传入参数');
            	$('#graphyView').html('没有传入正确参数');
            }

        },

        qryGraphyView: _qryGraphyView,
        createDatePicker: createDatePicker
    };
}(jQuery);

$(function() {
    GraphyView.init();
});