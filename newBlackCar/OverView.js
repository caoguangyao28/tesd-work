/**
 * Created by machenike on 2016/3/11.
 */
var OverView = function () {


    return {
        init: function () {
            //初始化时 图像模块高度
            var parentH = $('#blackCarChar1').parent().height();

            console.log(parentH - 30);
        }
    }
}();
$(function () {
    OverView.init();
})