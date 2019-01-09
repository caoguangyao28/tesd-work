(function($) {
    $.popup= function(option) {
        var $popup={},movieclip=null,isClick=false;
        $popup.addNotLottery=function(pra){
            movieclip=App.creat("container").set({alpha:0,x:0,y:-400});
            var bg=App.creat("shape").set({alpha:.8,graphics:new createjs.Graphics().beginFill("#000").drawRect(0,0,750,3030)});
            var content=App.creat("container").set({x:50,y:600,alpha:0});
            var bitmap=App.creat("bitmap",{img:option.loader.getResult("notLottery")});
            var btn=new $.sheet('<a></a>',{loader:option.loader,data:buttonData});
            content.addChild(bitmap,btn.creat());
            btn.init().setDirection(buttonData.point[4]).setClick(true).event().gotoAndStop("btnNot"); 
            movieclip.addChild(bg,content);
            btn.bind("click",function(e,obj){$popup.removePopup(content,pra);});
            option.stage.addChildAt(movieclip,option.stage.numChildren);
            $popup.tween(content);
        };
        $popup.addShare=function(pra){
            movieclip=App.creat("container").set({alpha:0,x:0,y:-370});
            var bg=App.creat("shape").set({alpha:.8,graphics:new createjs.Graphics().beginFill("#000").drawRect(0,0,750,3030)});
            var content=App.creat("container").set({x:120,y:340,alpha:0});
            var lotteryShare=App.creat("bitmap",{img:option.loader.getResult("lotteryShare")});
            var notLotteryShare=App.creat("bitmap",{img:option.loader.getResult("notLotteryShare")});
            var share_img=App.creat("bitmap",{img:option.loader.getResult("share_img")}).set({x:110,y:420});
            var share_text=App.creat("bitmap",{img:option.loader.getResult("share_text")}).set({y:610});
            var btn=new $.text().closeShare({data:{stroke:"#fff",width:260,height:70}});
            if(pra.isShare==0){share_text.visible=false;btn.movieclip.y=650;}
            if(pra.key=="notLottery"){lotteryShare.visible=false;notLotteryShare.x=-60;}else{notLotteryShare.visible=false;}
            content.addChild(lotteryShare,notLotteryShare,share_img,share_text,btn.movieclip);
            movieclip.addChild(bg,content);
            btn.movieclip.addEventListener("mousedown",function(){$popup.removePopup(content,pra);});
            bg.addEventListener("mousedown",function(){$popup.removePopup(content,pra);});
            option.stage.addChildAt(movieclip,option.stage.numChildren);
            $popup.tween(content);
        };
        $popup.addAction=function(pra){
            movieclip=App.creat("container").set({alpha:0,x:0,y:-340});
            var bg=App.creat("shape").set({alpha:.8,graphics:new createjs.Graphics().beginFill("#000").drawRect(0,0,750,3030)});
            var content=App.creat("container").set({x:50,y:350,alpha:0,width:654,height:1154});
            var actionBg=App.creat("bitmap",{img:option.loader.getResult("action")});
            var actionContent=App.creat("shape").set({y:100,alpha:1,graphics:new createjs.Graphics().drawRect(0,0,629,870)});
            var actionText=App.creat("bitmap",{img:option.loader.getResult("actionText")}).set({x:8,y:100});
            var close=new $.text().close({data:{stroke:"#f9d509",width:100,height:45}});
            content.addChild(actionBg,actionContent,actionText,close.movieclip);
            movieclip.addChild(bg,content);
            close.movieclip.addEventListener("mousedown",function(){$popup.removePopup(content,pra);return;});
            option.stage.addChildAt(movieclip,option.stage.numChildren);
            actionText.mask=actionContent;
            isClick=true;
            new $popup.scroll({el:actionText,maxHeight:870,space:100,content:content});
            $popup.tween(content);
        };
        $popup.removePopup=function(content,pra){
            createjs.Tween.get(content).to({alpha:0,y:content.y+50},500,createjs.Ease.sineInOut);
            createjs.Tween.get(movieclip).wait(400).to({alpha:0},500,createjs.Ease.sineInOut)
            .call(function(){
                option.stage.removeChild(movieclip);
                if(movieclip)movieclip=null;
                if(pra.remove)pra.remove();
            });
        };
        $popup.scroll=function(pra){
            var start=0,num=0;
            var max=pra.el.getBounds();
            var move=function(e){
                if(e.stageY>start){num=40;}else{num=-40;};
                pra.el.y=pra.el.y+num;
                if(pra.el.y>pra.space){pra.el.y=pra.space;};
                if(pra.el.y<-(max.height-pra.maxHeight)){pra.el.y=-(max.height-pra.maxHeight);};
                start=e.stageY;
            };
            var up=function(){
                pra.el.isDown=false;
                option.stage.removeEventListener("pressmove",move);
                option.stage.removeEventListener("pressup",up);
            };
            pra.content.addEventListener("mousedown",function(e){
                if(pra.el.isDown)return;
                pra.el.isDown=true;
                start=e.stageY;
                option.stage.addEventListener("pressmove",move);
                option.stage.addEventListener("pressup",up);
                
            }); 
        };
        $popup.tween=function(content){
            createjs.Tween.get(movieclip).to({alpha:1},500,createjs.Ease.sineInOut);
            createjs.Tween.get(content).wait(300).to({alpha:1,y:content.y+50},500,createjs.Ease.sineInOut);
        };
        return $popup;
    };
})(jQuery);