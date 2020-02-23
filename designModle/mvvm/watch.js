// 观察者的目的  就是给需要变化的那个元素添加一个观察者，当数据变化之后，执行相关的方法
class Watch{
    constructor(vm,expr,cb){
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        // 先获取老的值
        this.value = this.get();
    }
    getVal(vm,expr){
        expr = expr.split('.');
        return expr.reduce((prev,next) => {
            return prev[next];
        },vm.$data);
    }
    get(){
        Dep.target = this;
        let value = this.getVal(this.vm,this.expr);
        Dep.target = null;
        return value;
    }
    update(){
        let newValue = this.getVal(this.vm,this.expr);
        let oldValue = this.oldValue;
        if(newValue != oldValue){
            this.cb(newValue); // 调用 callbacck
        }

    }

}