class Observer {
    constructor(data){
        this.observe(data);
    }
    observe(data){ // 有且是 对象
        if(!data || typeof data !== 'object'){
            return;
        }
        // 将数据一一劫持 先获取到 data 的key 和 value
        Object.keys(data).forEach(key => {
            // 劫持
            this.defineReactive(data,key,data[key]);
            // 深度劫持
            this.observe(data[key]);
        });
    }
    // 定义响应式
    defineReactive(obj,key,value){
        // obj.key = value
        let that = this;
        let dep = new Dep();// 每个变化的数据都会对应一个数组，存放所有更新的操作
        Object.defineProperty(obj,key,{
            enumerable: true,
            configurable: true,
            get(){
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set(newValue){
                if(newValue != value){
                    that.observe(newValue);//如果是对象继续 劫持
                    value = newValue;
                    dep.notify();// 通知所有人 数据更新了
                }
            }
        })
    }

}

class Dep{
    constructor(){
        // 订阅数组
        this.subs = []
    }
    addSub(watcher){
        this.subs.push(watcher);
    }
    notify(){
        this.subs.forEach(watcher => watcher.update())
    }
}