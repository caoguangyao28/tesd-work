(function($) {
    $.redBag= function(option) {
        var $redBag ={},movieclipBag=null,captureContainers=[],numBag=120;
        $redBag.init=function(){
             movieclipBag=App.creat("container");
            option.stage.addChildAt(movieclipBag,option.stage.numChildren-1);
            return this;
        };
        $redBag.start=function(){
            for(var j=0;j<numBag;j++){
                var bag=App.creat("bitmap",{img:option.loader.getResult("smallbag")});
                this.styleBag(bag);
                movieclipBag.addChild(bag);
            }
            this.tween();
            return this;
        };
        $redBag.styleBag=function(shape){
            shape.x=Math.random()*($(window).width()+1000)+$(window).width()+500;
            shape.y=-1200+Math.random()*($(window).height()+500);
            shape.scaleX=shape.scaleY=.3+Math.random()*.6;
        };
        $redBag.tween=function(){
            for(var j=0;j<numBag;j++){
                var target=movieclipBag.getChildAt(j);
                createjs.Tween.get(target, {loop: true}).wait(j*200+Math.random()*10000).to({x:-(500+Math.random()*500),y:target.y+2000},($(window).width()/50)+5000+Math.random()*600);
            }
        };
        return $redBag;
    };
})(jQuery);