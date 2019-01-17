(function($) {
    $.stage= function(elem,option) {
        var $stage = {},status=0,isShare=0,isLottery=0,lottery=null,bag=null,bagOpen=null,
        valueArr=[],homeArr=[],homeTicketArr=[],gameInArr=[],gameOutArr=[],resultArr=[],ticketArr=[],
        textClass=null,popupClass=null,shaker=null,bgSound=null,shakerSound=null,
        isPass=false;
        $stage.methods = {
            init: function() {
                //初始化音乐
                // bgSound=new $.audio({id:"bgSound",loop:"loop",mp3:file+"bg.mp3"});
                // shakerSound=new $.audio({id:"shakerSound",mp3:file+"shaker.mp3"});
                //播放背景音乐
                // bgSound.play();
                //初始化摇一摇
                // shaker=new $.shaker();
                //初始化文本对象
                // textClass=new $.text({loader:option.loader,stage:option.stage});
                //创建优惠券
                // $stage.ticket();
                //创建红包
                // $stage.bag();
                //创建静态素材
                // $stage.static();
                //创建按钮素材
                // $stage.button();
                //初始化流星
                // new $.meteor({stage:option.stage,loader:option.loader}).init().start();
                 //初始化红包雨动效
                new $.redBag({stage:option.stage,loader:option.loader}).init().start();
                //初始化背景元素
                //option.stage.addChildAt(new $.text({loader:option.loader}).bg().movieclip,0);
                var bg=App.creat("bitmap",{img:option.loader.getResult("bg1")}).set({alpha:0});
                option.stage.addChildAt(bg,0);
                createjs.Tween.get(bg).to({alpha:1},1000,createjs.Ease.linear);
                //开始进场
                // $stage.methods.play(true);
            },
            play:function(isIn,pass){
                isPass=pass||false;
                if(status==0&&!isIn){
                    status=1;
                    //首页出场动画
                    $stage.tween.start(isIn,homeTicketArr);
                    App.timerOut({time:bagOPenData.delayOut,complete:function(){
                        bagOpen.gotoAndPlay(3);
                        bag.setChildIndex(bagOpen.movieClip,bag.numChildren-1);
                        App.timerOut({time:100,complete:function(){
                            $stage.tween.start(isIn,homeArr);
                            App.timerOut({time:bagOPenData.delayOut+400,complete:function(){
                               $stage.methods.play(true);
                           }});
                       }});
                   }});
                }else if(status==0&&isIn){
                    $stage.tween.start(isIn,homeArr);
                }else if(status==1&&isIn){
                    //关闭背景音乐
                    bgSound.stop();
                    //进入抽奖界面
                    $stage.tween.start(isIn,gameInArr);
                    App.removeTimerOut();//清除所有timeout
                    App.timerOut({time:1000,complete:function(){
                        var curTime=new Date().getTime();
                        //初始化摇一摇
                        shaker.setNew({complete:function(){
                            if(new Date().getTime()-curTime<1000)return false;
                            shaker.removeSet();
                            $stage.methods.play(false,true);
                            return;
                        }});
                        return;
                    }});
                }else if(status==1&&!isIn){
                    if(!isPass)return false;
                    //开始抽奖
                    var isTime=false,isResult=false;
                    lottery=null;
                    $common.dev.getLottery(function(data){
                        lottery=data;
                        if(isTime&&!isResult){isResult=true;$stage.methods.result(lottery);}
                    });
                    $stage.tween.start(isIn,gameOutArr);
                    App.timerOut({time:300,complete:function(){
                        shakerSound.play();
                        var x=bag.x,y=bag.y;
                        createjs.Tween.get(bag).to({rotation:10,x:x+80},50,createjs.Ease.linear).to({rotation:0,x:x},50,createjs.Ease.linear).to({rotation:-10,x:x-60,y:y+100},50,createjs.Ease.linear).to({rotation:0,x:x,y:y},50,createjs.Ease.linear)
                        .to({rotation:10,x:x+80},50,createjs.Ease.linear).to({rotation:0,x:x},50,createjs.Ease.linear).to({rotation:-10,x:x-60,y:y+100},50,createjs.Ease.linear).to({rotation:0,x:x,y:y},50,createjs.Ease.linear)
                        .wait(200).to({rotation:10,x:x+80},50,createjs.Ease.linear).to({rotation:0,x:x},50,createjs.Ease.linear).to({rotation:-10,x:x-60,y:y+100},50,createjs.Ease.linear).to({rotation:0,x:x,y:y},50,createjs.Ease.linear)
                        .wait(100).to({x:-17.5,scaleX:1,scaleY:1,y:560,alpha:1},500,createjs.Ease.sineInOut);
                         App.timerOut({time:900,complete:function(){
                             isTime=true;
                              if(lottery&&!isResult){isResult=true; $stage.methods.result(lottery);};
                         }});
                    }});
                }else if(status==2&&isIn){
                    //抽奖完成后动画
                    $stage.tween.start(isIn,resultArr);
                }
            },
            //抽奖结果
            result:function(obj){
                bag.setChildIndex(bagOpen.movieClip,0);
                status=2;
                bagOpen.gotoAndPlay(2);
                var ticket=$stage.count.getMovieClip(obj.key,ticketArr);
                if(obj.key!="notLottery"){
                    ticket.text.text=obj.num;
                    var ticketTextBounds=ticket.text.getBounds();
                    ticket.text.x=(750-ticketTextBounds.width)/2+10;
                    ticket.money.x=ticket.text.x-90;
                }
                var shapeX=obj.key=="notLottery"?170:45;
                var shapeX_r=obj.key=="notLottery"?200:105;
                var shapeY=obj.key=="notLottery"?-250:-50;
                ticket.shape.set({x:shapeX_r,alpha:0,y:220,rotation:0,scaleX:.8,scaleY:.8});
                App.timerOut({time:300,complete:function(){
                    bag.setChildIndex(bagOpen.movieClip,0);
                    createjs.Tween.get(ticket.shape).to({alpha:1,y:shapeY},500).to({scaleX:1,scaleY:1,x:shapeX},300,createjs.Ease.bounceOut);
                    App.timerOut({time:500,complete:function(){
                        bag.setChildIndex(ticket.shape,bag.numChildren-1);
                    }});
                    if(obj.key=="notLottery"){
                        //未中奖显示
                        var notRt=App.creat("text",{text:textData.resultNotText.des,font:"34px 微软雅黑",color:"#ffeb78"}).set({textAlign:"center"});
                        option.stage.addChild(notRt);
                        resultArr.push({key:"notRt",shape:notRt,alpha:0,data:{x:370,y:900,oY:800,delayIn:400}});
                    }else{
                        //中奖显示
                        var text=App.creat("container");
                        var str=obj.type=="online"?textData.result.des[0]:textData.result.des[1];
                        var rt1=App.creat("text",{text:textData.resultText.des1,font:"60px 微软雅黑",color:"#fff"});
                        var rt2=App.creat("text",{text:obj.num,font:"bold 60px 微软雅黑",color:"#f9d509"});
                        var rt3=App.creat("text",{text:textData.resultText.des2,font:"60px 微软雅黑",color:"#fff"});
                        text.addChild(rt1,rt2,rt3);
                        var rt1Bounds=rt1.getBounds();
                        rt2.x=rt1Bounds.x+rt1Bounds.width+5;
                        var rt2Bounds=rt2.getBounds();
                        rt3.x=rt1Bounds.x+rt1Bounds.width+5+rt2Bounds.width+5;
                        option.stage.addChild(text);
                        var textBounds=text.getBounds();
                        resultArr.push({key:"text",shape:text,alpha:0,data:{x:(750-textBounds.width)/2,y:950,oY:800,delayIn:300}});
                    }
                    $stage.methods.play(true);
                }});
                bag.addChildAt(ticket.shape,2);
            },
            //没有抽奖次数
            notNum:function(){
                popupClass.addNotLottery({remove:function(){
                    var btnStart=$stage.count.getMovieClip("btnStart",homeArr);
                    btnStart.el.setClick(true);
                }});
            },
            //活动规则
            action:function(){
                popupClass.addAction({remove:function(){
                    var btnAction=$stage.count.getMovieClip("btnAction",homeArr);
                    btnAction.el.isClick=true;
                }});
            },
            //分享引导
            share:function(){
                 popupClass.addShare({isShare:isShare,key:lottery.key,remove:function(){
                    var btnSahre=$stage.count.getMovieClip("btnSahre",resultArr);
                    btnSahre.el.setClick(true);
                }});
            }
        };
        
        //红包
        $stage.bag=function(){
            bag=App.creat("container").set({y:630});
            var shape= App.creat("bitmap",{img:option.loader.getResult("bag")}).set({y:30});
            bagOpen=new $.sheet('<a></a>',{loader:option.loader,data:bagOPenData});
            var bagOpenShape=bagOpen.creat();
            bagOpen.init();
            option.stage.addChildAt(bag,1);
            var hand=new $.sheet('<a></a>',{loader:option.loader,data:staticData});
            bag.addChild(hand.creat(),shape,bagOpenShape);
            hand.init().setDirection(staticData.point[4]).gotoAndStop("hand");  
            App.timerOut({time:bagOPenData.delayIn,complete:function(){
                bagOpen.gotoAndPlay(2);
                App.timerOut({time:400,complete:function(){
                    bag.setChildIndex(bagOpenShape,0);
                    var x=staticData.point[4].x,y=staticData.point[4].y;
                    hand.movieClip.regX =250;
                    hand.movieClip.regY =682;
                    App.timerOut({time:600,complete:function(){
                        createjs.Tween.get(hand.movieClip).to({rotation:-20},80).to({rotation:0},80).to({rotation:20},80).to({rotation:0},80)
                        .to({rotation:-20},80).to({rotation:0},80).to({rotation:20},80).to({rotation:0},80);
                    }});
               }});
            }});
            gameInArr.push({key:"bag",shape:bag,alpha:1,easeIn:createjs.Ease.bounceOut,data:{scale:.8,x:55,y:240,oY:-1500,delayIn:300,delayOut:0}});
            homeTicketArr.push({key:"hand",shape:hand.movieClip,alpha:1,data:staticData.point[4]});
            homeArr.push({key:"bag",shape:bag,alpha:1,data:{x:-17.5,y:630,oY:1590,delayIn:300,delayOut:0}},{key:"hand",shape:hand.movieClip,alpha:1,data:staticData.point[4]});
        };
        //静态素材
        $stage.static=function(){
          var logo=new $.sheet('<a></a>',{loader:option.loader,data:staticData});
          var slogan=new $.sheet('<a></a>',{loader:option.loader,data:staticData});
          var tel=new $.sheet('<a></a>',{loader:option.loader,data:staticData});
          var gameText1=new $.sheet('<a></a>',{loader:option.loader,data:staticData});
          option.stage.addChildAt(logo.creat(),slogan.creat(),tel.creat(),gameText1.creat(),2);
          logo.init().setDirection(staticData.point[0]).gotoAndStop("logo");
          slogan.init().setDirection(staticData.point[1]).gotoAndStop("slogan");
          tel.init().setDirection(staticData.point[5]).alpha(0).gotoAndStop("tel").tween();
          gameText1.init().setDirection(staticData.point[6]).setClick(true).event().alpha(0).gotoAndStop("gameText1");
          gameOutArr.push({key:"tel",shape:tel.movieClip,data:{oY:staticData.point[2].oY,delayOut:0}},{key:"gameText1",shape:gameText1.movieClip,data:{oY:staticData.point[3].oY,delayOut:150}});
          gameInArr.push({key:"logo",shape:logo.movieClip,data:staticData.point[0]},{key:"tel",shape:tel.movieClip,data:staticData.point[2]},{key:"gameText1",shape:gameText1.movieClip,data:staticData.point[3]});
          homeArr.push({key:"logo",shape:logo.movieClip,data:staticData.point[0]},{key:"slogan",shape:slogan.movieClip,easeIn:createjs.Ease.bounceOut,data:staticData.point[1]});
          gameText1.bind("click",function(e,obj){$stage.methods.play(false,true);});//测试用
        };
        //按钮素材
        $stage.button=function(){
            var btnStart=new $.sheet('<a></a>',{loader:option.loader,data:buttonData});
            option.stage.addChildAt(btnStart.creat(),3);
            btnStart.init().setDirection(buttonData.point[0]).setClick(true).event().gotoAndStop("btnStart"); 
            homeArr.push({key:"btnStart",el:btnStart,shape:btnStart.movieClip,data:buttonData.point[0]}); 
            btnStart.bind("click",function(e,obj){
                btnStart.setClick(false);
                $stage.methods.play(false);
            });
        };
        //优惠券
        $stage.ticket=function(){
            var ticketContainer=App.creat("container");
            var ticket=new $.sheet('<a></a>',{id:0,loader:option.loader,data:ticketData});
            var ticketSpane=ticket.creat();
            ticket.init().setDirection(ticketData.home[0]).gotoAndStop("lottery");
            
            var money=App.creat("bitmap",{img:option.loader.getResult("money")}).set({y:48});
            var text=App.creat("text",{text:"",font:"bold 150px Arial",color:"#e5002b"});
            ticketContainer.addChild(ticketSpane,money,text);
            
            var notTicket=new $.sheet('<a></a>',{id:0,loader:option.loader,data:ticketNotData});
            var notTicketSpane=notTicket.creat();
            notTicket.init().setDirection(ticketNotData.home[0]).gotoAndPlay(1);
            ticketArr.push({index:1001,key:ticketSpane.currentAnimation,shape:ticketContainer,obj:ticket,money:money,text:text,data:ticketData.home[0]},{index:1000,key:notTicketSpane.currentAnimation,shape:notTicketSpane,obj:notTicket,data:ticketNotData.home[0]});
        };
        //动画
        $stage.tween={
            start:function(isIn,arr){
                for(var i=0;i<arr.length;i++){this.speed(arr[i].key,isIn,arr);}
            },
            speed:function(key,isIn,arr){
                var obj=$stage.count.getMovieClip(key,arr),ease=createjs.Ease.sineInOut,time=500,alpha=0,rota=0,scale=1;
                if(isIn){
                    if(obj.easeIn){ease=obj.easeIn;};
                    if(obj.alpha){alpha=obj.alpha;}
                    if(obj.data.rota){rota=obj.data.rota;}
                    if(obj.data.scale){scale=obj.data.scale;}
                    obj.shape.set({x:obj.data.x||obj.shape.x,alpha:alpha,y:obj.data.oY,rotation:rota,scaleX:scale,scaleY:scale});
                    createjs.Tween.get(obj.shape).wait(obj.data.delayIn).to({y:obj.data.y,alpha:1},time,ease);
                }else{
                    if(obj.easeOut){ease=obj.easeOut;time=500;}
                    if(obj.alpha){alpha=obj.alpha;}
                    if(obj.data.scale){scale=obj.data.scale;}
                    createjs.Tween.get(obj.shape).wait(obj.data.delayOut).to({x:obj.data.x||obj.shape.x,scaleX:scale,scaleY:scale,y:obj.data.oY,alpha:alpha},time,ease);
                }
            }
        };
        //舞台运算
        $stage.count={
            getMovieClip:function(key,arr){
                for(var i=0;i<arr.length;i++){
                    if(key==arr[i].key){return arr[i];}
                }
                return null;
            }
        };
        return $stage.methods;
    };
})(jQuery);