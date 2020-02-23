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
            //数据劫持 对象的所有属性  get set
            new Observer(this.$data);
            this.proxyData(this.$data);
            // 编译模板
            new Compile(this.$el,this);
        }

    }
    proxyData(data){
        Object.keys(data).forEach(key => {
            Object.defineProperty(this,key,{
                enumerable:true,
                get(){
                    return data[key]
                },
                set(newValue){
                    data[key] = newValue
                }
            })
        })
    }
}