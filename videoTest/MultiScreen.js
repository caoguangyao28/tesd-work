//多画面的一个窗口
function ScreenObj(p, i, aDiv, aObj) {
    //MultiScreen对象
    this.Parent = p;
    //窗口号
    this.ScreenIndex = i;
    //父DIV对象
    this.ScreenDiv = aDiv;
    //Screen对象ID字段
    this.Id = aObj.id;
    //当前的设备ID
    this.CurrId = '';
    //当前的设备名称
    this.CurrName = '';

    //Screen对象
    this.ScreenObject = aObj;
    //MultiScreen对象
    this.ScreenObject.Parent = p;
    //窗口号
    this.ScreenObject.ScreenIndex = i;
    //焦点事件
    this.ScreenObject.oncontextmenu = function() {
        this.Parent.ChangeEvent(this.ScreenIndex);
    }
    this.ScreenObject.onclick = function(x, y) {
        //window.multiscreen.ChangeEvent(window.event.srcElement.ScreenIndex);
        if(0==this.ScreenIndex)
            window.multiscreen.ChangeEvent(this.ScreenIndex);
    }
    //this.ScreenObject.attachEvent("LButtonUp", this.ScreenObject.onclick);

    //当前窗口是否可以执行操作
    this.IsValid = function() {
        //TODO 需要自己根据需求来实现
        //比如，在多个视频窗口中放一个地图，地图窗口无法播放视频，所以该窗口必须被排除掉，返回false。
        if("map" == this.Id)
            return false;
        else
            return true;
    };
    //当前窗口是否已经使用
    this.IsUsed = function(AId) {
        if (typeof AId == 'undefined' || !AId) {
            return this.CurrId != null && this.CurrId != '';
        } else {
            return this.CurrId != null && this.CurrId == AId;
        }
    };
    //开始执行操作
    this.StartDo = function(AId, AName) {
        this.CurrId = AId;
        this.CurrName = AName;
        return 0;
    };
    //停止执行操作
    this.StopDo = function() {
        this.CurrId = '';
        this.CurrName = '';
        return 0;
    };
};
var BorderWidth = 1;
//多画面对象
function MultiScreen() {
    //顶层DIV的ID
    this.strDiv = '';
    //父DIV节点选择字符串
    this.pSelector = '';
    //子DIV节点选择字符串
    this.cSelector = '';
    //子DIV节点选择字符串
    this.oSelector = '';

    //最小起始索引
    this.MinCount = 0;
    //最大结束索引
    this.MaxCount = 16;
    //当前焦点索引
    this.CurrIndex = 0;
    //当前多画面数
    this.CurrCount = 4;
    //多画面数组
    this.ScreenArray = [];

    //初始化方法。需要如下的页面布局：<div id="aDiv"><div><object/></div><div><object/></div>...</div>
    this.Init = function(aDiv) {
        this.strDiv = aDiv;
        this.pSelector = '#' + this.strDiv;
        this.cSelector = this.pSelector + ' > div';
        this.oSelector = this.cSelector + ' > object';

        //顶层DIV
        var mainDiv = $(this.pSelector);
        mainDiv.show();
        mainDiv.css('border', '1px solid #FF0000');

        //父DIV节点数组 
        var screenDivs = $(this.cSelector);
        var screenObjs = $(this.oSelector);
        //最大同时画面数
        this.MaxCount = screenDivs.length;
        //最小同时画面数        
        this.MinCount = 0;

        var screenNode = null;
        var screenObj = null;
        for (var i = 0; i < this.MaxCount; i++) {
            $(screenDivs[i]).css({"border": BorderWidth + "px solid #C0C0C0"});
            if (screenObjs.length >= i) {
                screenNode = screenObjs[i];
            } else {
                screenNode = screenDivs[i].childNodes[0];
            }
            $(screenNode).css({"width":"100%", "height":"100%", "border-width": "0px"});
            screenObj = new ScreenObj(this, i, screenDivs[i], screenNode);
            this.ScreenArray[i] = screenObj;
        }

        //让第1个窗口选中
        this.SelectScreenByIndex(0);
    };
    //执行选择事件    
    this.OnChangeEvent = function(ms, index){
        return function(){
            ms.ChangeEvent(index);
        }
    };
    //选择事件
    this.ChangeEvent = function(index) {
        var cDivs = $(this.cSelector);
        var ms = this;
        cDivs.each(function(i){
            if (i == index) {
                if (ms.GetScreenByIndex(index).IsUsed()) {
                    $(this).css({"border": BorderWidth + "px solid #0000FF"});
                } else {
                    $(this).css({"border": BorderWidth + "px solid #0000FF"});
                }
            } else {
                $(this).css({"border": BorderWidth + "px solid #C0C0C0"});
            }
        });
        this.CurrIndex = index;
    };
    //设置多画面
    this.SetScreen = function(screenno) {
        //如果参数不正确，则直接返回
        if (typeof screenno == 'undefined' || !screenno || screenno <= this.MinCount) {
            screenno = this.CurrCount;
        }
        //如果参数大于最大画面，则等于最大画面
        if (screenno > this.MaxCount) {
            screenno = this.MaxCount;
        }

        var pDiv = $(this.pSelector);
        var cDivs = $(this.cSelector);
        cDivs.each(function(i) {
            $(this).hide();
            //15屏引入了margin，所以在切换时先移除margin modified by ding.hongyu@2013-12-27 13:53:56
            $(this).css({"margin":"0px"});
        });

        var intWidth = 1;
        var intHeight = 1;
        var intAWidth = 1;
        var intAHeight = 1;
        var intDivParam = 1;
        switch (parseInt(screenno)) {
            case 1:
                screenno = 1;
                intDivParam = 1;
                intWidth = pDiv.width() - intDivParam * 2;
                intHeight = pDiv.height() - intDivParam * 2;
                intAWidth = intWidth / intDivParam;
                intAHeight = intHeight / intDivParam;
                break;
            case 2:
            case 3:
            case 4:
                screenno = 4;
                intDivParam = 2;
                intWidth = pDiv.width() - intDivParam * 2;
                intHeight = pDiv.height() - intDivParam * 2;
                intAWidth = intWidth / intDivParam;
                intAHeight = intHeight / intDivParam;
                break;
            case 5:
                screenno = 5;
                intDivParam = 4;
                intWidth = pDiv.width() - intDivParam * 2;
                intHeight = pDiv.height() - intDivParam * 2;
                intAWidth = intWidth / intDivParam;
                intAHeight = intHeight / intDivParam;
                cDivs.each(function(i) {
                    if (i == 0) {
                        $(this).show();
                        $(this).css({"width": (intAWidth * 4 + BorderWidth * 6) + "px", "height": (intAHeight * 3 + BorderWidth * 4) + "px"});
                    } else if (i < screenno) {
                        $(this).show();
                        $(this).css({"width": intAWidth + "px", "height": intAHeight + "px"});
                    }
                });
                this.CurrCount = screenno;
                return;
            case 6:
                screenno = 6;
                intDivParam = 1;
                intWidth = (pDiv.width() - intDivParam * 6) / 2;
                intHeight = (pDiv.height() - intDivParam * 4) / 3;
                cDivs.each(function(i) {
                    if (i < screenno) {
                        $(this).show();
                        $(this).css({"width": intWidth + "px", "height": intHeight + "px"});
                    }
                });
                this.CurrCount = screenno;
                return;
            case 7:
            case 8:
                screenno = 8;
                intDivParam = 4;
                intWidth = pDiv.width() - intDivParam * 2;
                intHeight = pDiv.height() - intDivParam;
                intAWidth = intWidth / intDivParam;
                intAHeight = (intHeight * 2) / intDivParam;
                cDivs.each(function(i) {
                    /*if (i == 0) {
                     $(this).show();
                     $(this).css({"width": (intAWidth * 3 + BorderWidth * 4) + "px", "height": (intAHeight * 3 + BorderWidth * 3) + "px"});
                     } else*/ if (i < screenno) {
                        $(this).show();
                        $(this).css({"width": intAWidth + "px", "height": intAHeight + "px"});
                    }
                });
                this.CurrCount = screenno;
                return;
            case 9:
                screenno = 9;
                intDivParam = 3;
                intWidth = pDiv.width() - intDivParam * 2;
                intHeight = pDiv.height() - intDivParam * 2;
                intAWidth = intWidth / intDivParam;
                intAHeight = intHeight / intDivParam;
                break;
            case 10:
            case 11:
            case 12:
            case 13:
                screenno = 13;
                intDivParam = 4;
                intWidth = pDiv.width() - intDivParam * 2;
                intHeight = pDiv.height() - intDivParam * 2;
                intAWidth = intWidth / intDivParam;
                intAHeight = intHeight / intDivParam;
                cDivs.each(function(i) {
                    if (i == 0) {
                        $(this).show();
                        $(this).css({"width": (intAWidth * 2 + BorderWidth * 2) + "px", "height": (intAHeight * 2 + BorderWidth * 1.5) + "px"});
                    } else if (i < screenno) {

                        $(this).show();
                        $(this).css({"width": intAWidth + "px", "height": intAHeight + "px"});
                    }
                });
                this.CurrCount = screenno;
                return;
            case 14:
            case 15://implemented by ding.hongyu@2013-12-27 13:53:56
                screenno = 15;
                intDivParam = 1;
                var offsetw = pDiv.width();
                intWidth = (offsetw -2*intDivParam )  / 2;
                intHeight = (pDiv.height() -2*intDivParam )/ 3;
                intAWidth = (intWidth - 4*intDivParam ) / 2;
                intAHeight = (intHeight - 4*intDivParam )  / 2;
                var left2Offset = -(3*intAWidth + 6*intDivParam);

                var index = 0;
                cDivs.each(function(i) {
                    index = i+1;
                    switch(index){
                        case 1:
                        case 2:
                            $(this).show();
                            $(this).css({"width": intAWidth + "px", "height": intAHeight + "px"});
                            break;
                        case 3:
                            $(this).show();
                            $(this).css({"width": (intWidth - 2*intDivParam) + "px", "height": (intHeight - 2*intDivParam) + "px"});
                            break;
                        case 4:
                            $(this).show();
                            $(this).css({"width": intAWidth + "px", "height": intAHeight + "px", "margin-top": (intAHeight+2*intDivParam)+"px","margin-left":(-offsetw+intDivParam)+"px"});
                            break;
                        case 5:
                            $(this).show();
                            $(this).css({"width": intAWidth + "px", "height": intAHeight + "px", "margin-top": (intAHeight+2*intDivParam)+"px","margin-left":left2Offset+"px"});
                            break;
                        case 6:
                            $(this).show();
                            $(this).css({"width": intAWidth + "px", "height": intAHeight + "px", "margin-top": 2*(intAHeight+2*intDivParam)+"px","margin-left":(-offsetw+intDivParam)+"px"});
                            break;
                        case 7:
                            $(this).show();
                            $(this).css({"width": intAWidth + "px", "height": intAHeight + "px", "margin-top": 2*(intAHeight+2*intDivParam)+"px","margin-left":left2Offset+"px"});
                            break;
                        case 8:
                            $(this).show();
                            $(this).css({"width": (intWidth - 2*intDivParam) + "px", "height": (intHeight - 2*intDivParam) + "px", "margin-top": 2*(intAHeight+2*intDivParam)+"px","margin-left":-2*(intAWidth+2*intDivParam)+"px"});
                            break;
                        case 9:
                            $(this).show();
                            $(this).css({"width": intAWidth + "px", "height": intAHeight + "px", "margin-top": 3*(intAHeight+2*intDivParam)+"px","margin-left":(-offsetw+intDivParam)+"px"});
                            break;
                        case 10:
                            $(this).show();
                            $(this).css({"width": intAWidth + "px", "height": intAHeight + "px", "margin-top": 3*(intAHeight+2*intDivParam)+"px","margin-left":left2Offset+"px"});
                            break;
                        case 11:
                            $(this).show();
                            $(this).css({"width": intAWidth + "px", "height": intAHeight + "px", "margin-top": 4*(intAHeight+2*intDivParam)+"px","margin-left":(-offsetw+intDivParam)+"px"});
                            break;
                        case 12:
                            $(this).show();
                            $(this).css({"width": intAWidth + "px", "height": intAHeight + "px", "margin-top": 4*(intAHeight+2*intDivParam)+"px","margin-left":left2Offset+"px"});
                            break;
                        case 13:
                            $(this).show();
                            $(this).css({"width": (intWidth - 2*intDivParam) + "px", "height": (intHeight - 2*intDivParam) + "px", "margin-top": 4*(intAHeight+2*intDivParam)+"px","margin-left":-2*(intAWidth+2*intDivParam)+"px"});
                            break;
                        case 14:
                            $(this).show();
                            $(this).css({"width": intAWidth + "px", "height": intAHeight + "px", "margin-top": 5*(intAHeight+2*intDivParam)+"px","margin-left":-offsetw+"px"});
                            break;
                        case 15:
                            $(this).show();
                            $(this).css({"width": intAWidth + "px", "height": intAHeight + "px", "margin-top": 5*(intAHeight+2*intDivParam)+"px","margin-left":left2Offset+"px"});
                            break;
                        default:break;
                    }
                });
                this.CurrCount = screenno;
                return;
            case 16:
                screenno = 16;
                intDivParam = 4;
                intWidth = pDiv.width() - intDivParam * 2;
                intHeight = pDiv.height() - intDivParam * 2;
                intAWidth = intWidth / intDivParam;
                intAHeight = intHeight / intDivParam;
                break;
        }
        var ms = this;
        cDivs.each(function(i){
            //单画面时显示正在播放的焦点视频
            if (screenno == 1 && ms.ActiveScreen().IsUsed()) {
                if (i == ms.CurrIndex) {
                    $(this).show();
                    $(this).css({"width": intAWidth + "px", "height": intAHeight + "px"});
                }
            } else {
                if (i < screenno) {
                    $(this).show();
                    $(this).css({"width": intAWidth + "px", "height": intAHeight + "px"});
                }
            }
        });
        this.CurrCount = screenno;
    };

    //全屏显示
    this.FullScreen = function() {
        //未实现
        return false;
    };
    //************************获取窗口*********************
    //根据序号获取窗口
    this.GetScreenByIndex = function(index) {
        if (index < this.MinCount || index >= this.MaxCount) {
            index = this.CurrIndex;
        }
        return this.ScreenArray[index];
    };
    //根据序号选择窗口
    this.SelectScreenByIndex = function(index) {
        if (index < this.MinCount || index >= this.MaxCount) {
            index = this.CurrIndex;
        }
        this.ChangeEvent(index);
        this.CheckScreen();
    };
    //根据设备ID获取窗口
    this.GetScreenById = function(AId) {
        var screenObj = null;
        for (var i = 0; i < this.MaxCount; i++) {
            screenObj = this.ScreenArray[i];
            if (screenObj.IsUsed(AId)) {
                return screenObj;
            }
        }
        return null;
    };
    //获取焦点窗口
    this.ActiveScreen = function() {
        return this.ScreenArray[this.CurrIndex];
    };
    //获取没有使用的窗口
    this.GetNoUsedScreen = function() {
        var screenObj = this.ActiveScreen();
        //如果焦点没有使用，则返回焦点窗口
        if (screenObj.IsValid() && !screenObj.IsUsed()) {
            return screenObj;
        }
        //焦点已经使用，则按顺序返回第一个没有使用的窗口
        for (var i = 0; i < this.MaxCount; i++) {
            screenObj = this.ScreenArray[i];
            if (screenObj.IsValid() && !screenObj.IsUsed()) {
                return screenObj;
            }
        }
        //如果都已经使用，则返回焦点窗口
        screenObj = this.ActiveScreen();
        if (screenObj.IsValid()) {
            return screenObj;
        }
        //如果焦点不可用，则按顺序返回第一个可用的窗口
        for (var i = 0; i < this.MaxCount; i++) {
            screenObj = this.ScreenArray[i];
            if (screenObj.IsValid()) {
                return screenObj;
            }
        }
    };
    //检查焦点窗口是否大于当前多画面数，否则，切换多画面
    this.CheckScreen = function() {
        if (this.CurrIndex >= this.CurrCount) {
            this.SetScreen(this.CurrIndex + 1);
        }
    };
};
//多画面注册到window上
if (!window.multiscreen) {
    window.multiscreen = new MultiScreen();
}

