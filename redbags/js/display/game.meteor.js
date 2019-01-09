(function($) {
    $.meteor= function(option) {
        var $meteor ={},movieclip=null,captureContainers=[],num=50;
        $meteor.init=function(){
            movieclip=App.creat("container");
            option.stage.addChildAt(movieclip,0);
            return this;
        };
        $meteor.start=function(){
            for(var i=0;i<num;i++){
                var meteor=App.creat("shape").set({rotation:-40,graphics:new createjs.Graphics().beginLinearGradientFill([createjs.Graphics.getHSL(Math.random()*360,100,50), createjs.Graphics.getHSL(Math.random()*360,100,50,Math.random()*1)], [0, 1], 0, 0, 350, 0).drawRoundRect(0,0,350,20,10,10)});
                this.style(meteor);
                movieclip.addChild(meteor);
            }
            this.tween();
            return this;
        };
        $meteor.style=function(shape){
            shape.rotation=-50+($(window).width()/150);
            shape.x=Math.random()*($(window).width()+500)+$(window).width()+500;
            shape.y=-1200+Math.random()*($(window).height()+500);
            shape.scaleX=shape.scaleY=.3+Math.random()*.6;
        };
        $meteor.tween=function(){
            for(var i=0;i<num;i++){
                var target=movieclip.getChildAt(i);
                createjs.Tween.get(target, {loop: true}).wait(i*200+Math.random()*1000).to({x:-(500+Math.random()*500),y:target.y+2000},($(window).width()/50)+1000+Math.random()*600);
            }
        };
        return $meteor;
    };
})(jQuery);