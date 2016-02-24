/**
 * Created by cao.gy on 2015/5/6.
 */
var testObj = {
    "name":"caoguangyao",
    "age":"25"
}

$(function () {
    testObj.setAge();
});

testObj.setAge = function(){
    alert(111);
}