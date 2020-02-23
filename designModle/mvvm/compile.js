class Compile{
    constructor(el,vm){
        this.el = this.isElementNode(el)?el:document.querySelector(el);// dom 对象
        this.vm = vm;
        if(this.el){
            // 1,真实dom移入内存中 fragment
            let fragement = this.node2fragment(this.el);
            // 2，编译 提取想要的元素节点 和文本节点
            this.compile(fragement);
            // 3, 把编译好的Fragement 在塞回到页面里去
            this.el.appendChild(fragement);
        }
    }
    /* 辅助方法 */
    isElementNode(node){
        return node.nodeType === 1;
    }
    node2fragment(el){
        let fragement = document.createDocumentFragment();
        let firstChild;
        while(firstChild = el.firstChild){
            // fragement.appendChild 具有 move 功能 每次移动 第一个元素
            fragement.appendChild(firstChild)
        }
        return fragement;
    }
    isDirective(name){
        return name.includes('v-');
    }
    /** 核心方法 */
    compileElement(node){
        // 有没有指令 v-model
        let attrs = node.attributes;
        // console.log(attrs);
        Array.from(attrs).forEach(attr => {
            // console.log(attr);
            let attrName = attr.name;
            if(this.isDirective(attrName)){
                // 取到对应节点的值
                let expr = attr.value;
                let [,type] = attrName.split('-'); // attrName.slice(2);
                console.log(type);
                // node vm.$data expr  v-model  v-text v-html
                CompileUtil['model'](node,this.vm,expr);
            }
        });
    }
    compileText(node){
        // {{abd}}
        let expr = node.textContent;
        const reg = /\{\{([^}]+)\}\}/g; // {{a}} {{b}} {{c}}
        if(reg.test(expr)){
            // node  this.vm.$data text
            CompileUtil['text'](node,this.vm,expr);
        }
    }
    compile(fragement){
        // 需要递归
        let childNodes = fragement.childNodes;
        Array.from(childNodes).forEach(node => {
            if(this.isElementNode(node)){
                // 元素节点
                this.compileElement(node);
                this.compile(node);
            }else{// 文本节点
                this.compileText(node);
            }
        })
    }

}

CompileUtil = {
    getVal(vm,expr){
        expr = expr.split('.'); // [a,b,c,d]
        // reduce 用法
        return expr.reduce((prev,next) => {
           return prev[next];
        },vm.$data);
    },
    getTextVal(vm,expr){
        return expr.replace(/\{\{([^}]+)\}\}/g,(...arguments)=>{
            return this.getVal(vm,arguments[1]);
        })
    },
    text(node,vm,expr){ // 
    
        // console.log(RegExp.$1);
        let updateFn = this.updater['textUpdater'];
        // {{message.a}} => 先取 message ，再取 a => [message,a]
        let value = this.getTextVal(vm,expr);
        // 分别添加 watch
        expr.replace(/\{\{([^}]+)\}\}/g,(...arguments)=>{
            new Watch(vm,arguments[1],(newValue) => {
                updateFn && updateFn(node,this.getTextVal(vm,expr));
            });
            // return this.getVal(vm,arguments[1]);
        })
        updateFn && updateFn(node,value);
    },
    setVal(vm,expr,value){
        expr = expr.split('.');
        return expr.reduce((prev,next,currentIndex)=>{
            if(currentIndex === expr.length - 1){
                return prev[next] = value;
            }
            return prev[next];
        },vm.$data);
    },
    model(node,vm,expr){// 输入框处理
        let updateFn = this.updater['modleUpdater'];
        // 加数据 watch
        new Watch(vm,expr,(newValue) => {
            updateFn && updateFn(node,this.getVal(vm,expr))
        });
        node.addEventListener('input',(e)=>{
            let newValue = e.target.value;
            this.setVal(vm,expr,newValue);
        })
        updateFn && updateFn(node,this.getVal(vm,expr))
    },
    updater: {
        textUpdater(node, value){// 文本更新
            console.log(value);
            node.textContent = value;
        },
        modleUpdater(node, value){ // 节点更新
            // console.log(value);
            node.value = value;
        }
    }
}