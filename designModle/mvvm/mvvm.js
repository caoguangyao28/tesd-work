class MVVM{
    constructor(options){
        //挂载实例属性
        // this.$el = options.el;
        // this.$data = options.data;
        // 换种写法
        const {el,data} = options;
        this.$el = el;
        this.$data = data;

        if(this.$el){
            new Compile(this.$el,this);
        }

    }
}