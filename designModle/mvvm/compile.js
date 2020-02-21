class Compile{
    constructor(el,vm){
        this.el = this.isElementNode(el)?el:document.querySelector(el);// dom 对象
        this.vm = vm;
        if(this.el){
            // 1,真实dom移入内存中 fragment
            let fragement = this.node2fragment(this.el);
            // 2，编译 提取想要的元素节点 和文本节点
            this.compile(fragement);
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
            fragement.appendChild(firstChild)
        }
        return fragement;
    }
    isDirective(name){
        return name.includes('v-');
    }
    compileElement(node){
        // 有没有指令 v-model
        let attrs = node.attributes;
        // console.log(attrs);
        Array.from(attrs).forEach(attr => {
            // console.log(attr);
            let attrName = attr.name;
            if(this.isDirective(attrName)){
                let expr = attr.value;
                // node vm.$data expr
                // todo...
            }
        });
    }
    compileText(node){
        // {{}}
        let text = node.textContent;
        const reg = /\{\{(.*)\}\}/;
        if(reg.test(text)){
            
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