(function ($) {
    $.common = function () {
        var $common = {}, stage = null, loading = null, maxWidth = 750, maxHeight = 1334;
        $common.methods = {
            init: function () {
                this.run();
            },
            run: function () {
                //初始化canvas舞台 创建canvas 且填充到hmtl id 容器中 并创建 create stage 舞台
                stage = App.stage("game", {width: maxWidth, height: maxHeight});
                //初始事件
                $common.methods.resize(0);
                $(window).bind("resize", function () {
                    $common.methods.resize(0);
                });
                //初始化背景素材
                this.load({
                    config: bgMaterial, complete: function (event, loader) {
                        loading = new $.text({loader: loader}).loading();
                        stage.addChild(loading.movieclip);
                        loader = null;
                        $common.methods.load({
                            config: material, sound: true, progress: function (num) {
                                loading.text.text = num;
                            }, complete: function (event, loader) {
                                createjs.Tween.get(loading.movieclip).to({
                                    alpha: 0,
                                    y: loading.movieclip.y + 50
                                }, 500, createjs.Ease.sineInOut)
                                    .call(function () {
                                        //删除loading
                                        stage.removeChild(loading.movieclip);
                                        loading = null;
                                        //定义舞台对象
                                        new $.stage(document, {
                                            stage: stage,
                                            loader: loader,
                                            width: maxWidth,
                                            height: maxHeight
                                        }).init();//初始化舞台
                                    });
                            }
                        });
                    }, enterFrame: function (event) {
                        //更新舞台
                        stage.update(event);
                    }
                });
            },
            //加载所有资源 ，可包含img,js,以及xml,json等数据格式
            load: function (option) {
                var loader = App.load(option.config, {
                    //是否配置音乐， 目前creatjs音乐对iphone不自动播放
                    sound: option.sound || false,
                    //素材文件路径
                    file: file,
                    //加载完成
                    COMPLETE: function (event) {
                        if (option.complete) option.complete(event, loader);
                        return;
                    },
                    //加载中...
                    PROGRESS: function (event) {
                        if (option.progress) option.progress(event.percent);
                    },
                    //加载完成后，循环执行
                    ENTER_FRAME: function (event) {
                        if (option.enterFrame) option.enterFrame(event);
                    },
                    //加载失败
                    ERROR: function (event) {
                    }
                });
            },
            //窗口变化监听
            resize: function () {
                App.angle({stage: stage, angle: 0, maxWidth: maxWidth, maxHeight: maxHeight});
            }
        };
        //接口
        $common.dev = {
            //获取中奖结果
            getLottery: function (callback) {
                var result = [{num: 0, key: "notLottery"}, {
                    num: 1 + Math.floor(Math.random() * 99998),
                    key: "lottery"
                }];
                var resultObj = result[Math.floor(Math.random() * result.length)];
                try {
                    getLottery(result, callback);
                } catch (e) {
                    callback({num: resultObj.num, type: resultObj.type, key: resultObj.key});
                }
                ;
            }
        };
        return $common;
    };
})(jQuery);
var $common = null;
$(function () {
    $common = new $.common();
    $common.methods.init();
});