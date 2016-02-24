/**
 * Created by cao.gy on 2016/2/2.
 * 页面需存在 必须的 dom元素布局 #endTime #startTime
 */
var GraphyViewPublic = function ($) {
    var dateType = 'D';
    function _changeDateDefault () {
        var curDate = _getCurDate ();
        var _startObj = $('#startTime');
        var _endObj = $('#endTime');
        _endObj.parent().show();
        _startObj.parent().find('label').text('开始时间：');
        _startObj.show();
        if (dateType == '') {
            _endObj.val("");
            _startObj.val("");
        }
        if (dateType == 'D') {
            //近 7 天
            var endDate = curDate.substring(0, 10);
            _endObj.val(endDate);
            var startDate = DateSubDay(endDate, 6);
            startDate = startDate.getFullYear() + "-" + addZero(startDate.getMonth() + 1) + "-" + addZero(startDate.getDate());
            _startObj.val(startDate);
        }
        if (dateType == 'M') {
            //近 12 个月
            var curmonth = curDate.substring(0, 7);
            var startDateM = DateSubMonth(curmonth, 11);
            var startMonth = startDateM.getFullYear() + "-" + addZero(startDateM.getMonth() + 1);
            _endObj.val(curmonth);
            _startObj.val(startMonth);

        }
        if (dateType == 'Y') {
            //近 5 年
            var curYear = curDate.substring(0, 4);
            var startYear = parseInt(curYear) - 4;
            _endObj.val(curYear);
            _startObj.val(startYear);
        }
        if (dateType == 'H') { //精确到时
            var endDateH = curDate.substring(0, 10);
            _endObj.val(endDateH);
            _startObj.parent().find('label').text('统计日期：');
            _startObj.val(endDateH);
            _endObj.parent().hide();
        }
    }

    function _getCurDate () {
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

    //function DateAddDay(sdate, dayNum) {
    //    var aDate = sdate.split('-');
    //    var a = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    //    a.setDate(a.getDate() + dayNum);
    //    a = new Date(a);
    //    return a;
    //}

    function DateSubDay(sdate, dayNum) {
        var aDate = sdate.split('-');
        var a = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        a.setDate(a.getDate() - dayNum);
        a = new Date(a);
        return a;
    }

    function DateSubMonth(sdate, monthNum) {
        var aDate = sdate.split('-');
        var a = new Date(aDate[1] + '-' + '01' + '-' + aDate[0]);
        a.setMonth(a.getMonth() - monthNum);
        a = new Date(a);
        return a;
    }

    //function DateAddMonth(sdate, monthNum) {
    //    var aDate = sdate.split('-');
    //    var a = new Date(aDate[1] + '-' + '01' + '-' + aDate[0]);
    //    a.setMonth(a.getMonth() + monthNum);
    //    a = new Date(a);
    //    return a;
    //}

    function _createDatePicker (e) {
        var dateFmt;
        if (dateType == 'D') {
            dateFmt = "yyyy-MM-dd";
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

    return {
        getCurDate: _getCurDate ,
        changeDateDefault: _changeDateDefault ,
        createDatePicker: _createDatePicker //时间控件 创建
    }

}(jQuery);