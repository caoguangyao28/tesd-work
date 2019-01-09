(function($) {
    $.sheet= function(elem,option) {
        var $sheet =$(elem),spane=null,level=0,aniKey=[],isClick=false;
        $sheet.init=function(){
            this.setDirection();
            aniKey=$sheet.count.getAniAniKey(option.data.animations);
            return this;
        };
        $sheet.creat=function(){
            this.movieClip=App.creat("sheet",{framerate:30,  images:[option.loader.getResult(option.data.id)],frames:option.data.frames,animations:option.data.animations});
            return this.movieClip;
        };
        $sheet.setDirection=function(obj){
            var x=obj?obj.x:option.data.x;
            var y=obj?obj.y:option.data.y;
            this.movieClip.x=x;
            this.movieClip.y=y;
            return this;
        };
        $sheet.event=function(){
           this.movieClip.addEventListener("mousedown",function(){$sheet.click();});
           return this;
        };
        $sheet.click=function(){
            if(isClick)this.trigger("click",[{el:this,obj:aniKey,option:option}]);
        };
        $sheet.setClick=function(click){isClick=click;return this;};
        $sheet.gotoAndStop=function(key){this.movieClip.gotoAndStop(key);return this;};
        $sheet.gotoAndPlay=function(index,obj){
            var _index=index?index:index==0?0:level+1;
            this.movieClip.gotoAndPlay(aniKey[_index].key);
            var data=aniKey[_index].obj;
            if(option.isComplete)App.timerOut({time:data[data.length-1]*(data[1]-data[0])*1000,complete:function(){$sheet.trigger("aniComplete",[obj]);}});
            return this;
        };
        $sheet.getKeyIndex=function(key){
            for(var i=0;i<aniKey.length;i++){
                if(aniKey[i].key==key){return i;}
            }
            return -1;
        };
        $sheet.show=function(){
            this.movieClip.visible=true;
        };
        $sheet.hide=function(){
            this.movieClip.visible=false;
            return this;
        };
        $sheet.alpha=function(alpha){
            this.movieClip.alpha=alpha;
            return this;
        };
        $sheet.getAniKey=function(index){return aniKey[index];};
        $sheet.count={
            getAniAniKey:function(obj){var arr=[];for(var i in obj){arr.push({key:i,obj:obj[i]});}return arr;}
        };
        $sheet.tween=function(){
           // TweenMax.to(this.movieClip,2.5,{rotation:"+=360",repeat:-1, ease:Linear.easeNone});
           //createjs.Tween.get(this.movieClip, {loop: true}).to({rotation:70},200);
            return this;
        };
        return $sheet;
    };
})(jQuery);