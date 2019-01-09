var App=(function () {
    function App(){};
    App.resize=function(parameter){
        if (App.toResize) {clearTimeout(App.toResize);}
        App.toResize = setTimeout(function(){if(parameter.callback){parameter.callback(parameter);}}, !parameter.time?parameter.time==0?0:300:parameter.time);
    };
    App.timer=function(){
        if(App.toTimer){window.clearInterval(App.toTimer);};
        App.toTimer=window.setInterval(function(){},time);
    };
    App.timerOut=function(parameter){
        if(App.toTimerout){window.clearTimeout(App.toTimerout);};
        App.toTimerout=window.setTimeout(function(){if(parameter.complete)parameter.complete();},parameter.time);
    };
    App.removeTimerOut=function(){if(App.toTimerout){window.clearTimeout(App.toTimerout);};},
    App.stage=function(id,parameter){
        var canvas=document.createElement("canvas");
        document.getElementById(id).appendChild(canvas);
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.setFPS(parameter.FPS||30);
        var stage=new createjs.Stage(canvas);
        // createjs.Touch.enable(stage, true);
        createjs.Touch.enable(stage, false);
        stage.canvas.width=parameter.width;
        stage.canvas.height=parameter.height;
        stage.main=this.creat("dom",{dom:document.getElementById(id)});
        stage.addChild(stage.main);
        return stage;
    },
    App.load=function(manifest,parameter){
        var loaderNum=0;
        var loader=new createjs.LoadQueue(false);
        if(parameter.sound){createjs.Sound.alternateExtensions = ["mp3"];loader.installPlugin(createjs.Sound);}
        loader.addEventListener("complete", function(event){if(parameter.COMPLETE)parameter.COMPLETE(event);if(parameter.ENTER_FRAME){createjs.Ticker.addEventListener("tick", function(event){App.event=event;parameter.ENTER_FRAME(event);});}});
        loader.addEventListener("error", function(event){if(parameter.ERROR)parameter.ERROR(event);});
        loader.addEventListener("fileload", function(event){loaderNum++;event.percent=Math.floor(loaderNum/manifest.length*100);if(parameter.PROGRESS)parameter.PROGRESS(event);});
        if(parameter.file)loader.loadManifest(manifest,true,parameter.file);else loader.loadManifest(manifest);
        this.loader=loader;
        return loader;
    };
    App.creat=function(key,data){
        if(key=="sheet")return new createjs.Sprite(new createjs.SpriteSheet(data));
        if(key=="shape")return new createjs.Shape();
        if(key=="shapeFill"){var shapeFill=new createjs.Shape();shapeFill.graphics.beginBitmapFill(this.loader.getResult(data.img)).drawRect(data.x||0, data.y||0, data.width||this.loader.getResult(data.img).width, data.height||this.loader.getResult(data.img).height); return shapeFill;};
        if(key=="bitmap")return new createjs.Bitmap(data.img);
        if(key=="text")return new createjs.Text(data.text||"", data.font||"20px Arial", data.color||"#000");
        if(key=="container")return new createjs.Container();
        if(key=="dom")return new createjs.DOMElement(data.dom);
        if(key=="textField"){var input=document.createElement("input");if(data.className){input.className=data.className;};document.getElementById(data.content).appendChild(input);input.canvas=this.creat("dom",{dom:input});return input;}
    };
    App.startMove=function(obj,parameter){
       var deltaS = this.event.delta / 1000;
       obj.x = (obj.x - deltaS* parameter.speed) % parameter.width;
    };
    App.angle=function(parameter){
        var stage=parameter.stage,angle=parameter.angle||0,width=$(window).width(),height=$(window).height(),maxWidth=parameter.maxWidth,maxHeight=parameter.maxHeight;
        var rotate=this.setViewport(stage,angle),sacle=0;
        if(rotate){
           sacle=this.getWidthScale(width,height,maxWidth,maxHeight);
           stage.main.x=(width-maxWidth*sacle)/2;
           stage.main.y=0;
       }else{
           sacle=this.getHeightScale(width,height,maxWidth,maxHeight);
           stage.main.x=(width-maxHeight*sacle)/2;
           stage.main.y=(maxWidth*sacle-height)/2+height;
       }
       stage.main.scaleX = stage.main.scaleY =sacle;
       return {scale:sacle,width:maxWidth*sacle,height:maxHeight*sacle,x:stage.main.x,y:stage.main.y};
    };
    App.setViewport=function(stage,angle){
        var deg=angle==0?-90:0;
        if(!this.getViewport()){deg=angle==0?0:-90;}
        stage.main.rotation=deg;
        if(angle==0){return deg!=0?false:true;}else{return deg<0?false:true;}
    };
    App.getViewport=function(){
        return $(window).width()>$(window).height();
    };
    App.getWidthScale=function(width,height,maxWidth,maxHeight){
        console.log(width+"---"+maxWidth+"---"+height+"---"+maxHeight);
        return Math.max(width/maxWidth,height/maxHeight);
    };
    App.getHeightScale=function(width,height,maxWidth,maxHeight){
        return Math.max(height/maxWidth,width/maxHeight);
    };
    return App;
})();