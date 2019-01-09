(function($) {
    $.text= function(option) {
        var $text ={};
        $text.loading=function(){
            var movieclip=App.creat("container").set({alpha:0,x:296,y:450});
            var loading=App.creat("bitmap",{img:option.loader.getResult("loading")});
            var text=App.creat("text",{text:"0",font:"20px Arial",color:"#fff"}).set({x:77,y:120,textAlign:"center"});
            var starArr=[{scale:.7,x:-5,y:0},{scale:.5,x:40,y:-30},{scale:1,x:100,y:-35},{scale:.7,x:140,y:-35},{scale:.5,x:160,y:35}];
            for(var i=0;i<starArr.length;i++){
                var star=App.creat("bitmap",{img:option.loader.getResult("star")}).set({alpha:0,x:starArr[i].x,y:starArr[i].y,scaleX:starArr[i].scale,scaleY:starArr[i].scale});
                movieclip.addChild(star);
                createjs.Tween.get(star,{loop:true}).wait(Math.random()*800).to({alpha:1},300+Math.random()*400, createjs.Ease.sineInOut).to({alpha:0},300+Math.random()*400,createjs.Ease.sineInOut);
            }
             movieclip.addChild(loading,text);
            createjs.Tween.get(movieclip).to({alpha:1},500,createjs.Ease.sineInOut);
            return {text:text,movieclip:movieclip};
        };
        $text.bg=function(obj){
            var movieclip=App.creat("container").set({x:-300,y:-300});
            for(var i=0;i<30;i++){
                var scale=.4+Math.random()*.6;
                var round=App.creat("bitmap",{img:option.loader.getResult("bg")}).set({x:Math.random()*1200,y:Math.random()*1800,scaleX:scale,scaleY:scale});
                movieclip.addChild(round);
            }
            return {movieclip:movieclip};
        };
        return $text;
    };
})(jQuery);