function Map() {
	var struct = function(key, value) {
		this.key = key;
		this.value = value;
	}

	var put = function(key, value) {
		for ( var i = 0; i < this.arr.length; i++) {
			if (this.arr[i].key === key) {
				this.arr[i].value = value;
				return;
			}
		}
		this.arr[this.arr.length] = new struct(key, value);
	}

	var get = function(key) {
		for ( var i = 0; i < this.arr.length; i++) {
			if (this.arr[i].key === key) {
				return this.arr[i].value;
			}
		}
		return null;
	}
	
	var getByIndex = function(index) {
		if(index >= 0 && index < this.arr.length){
            return this.arr[index].value;
        }
        return null;
	}

	var remove = function(key) {
		var v;
		for ( var i = 0; i < this.arr.length; i++) {
			v = this.arr.pop();
			if (v.key === key) {
				continue;
			}
			this.arr.unshift(v);
		}
	}

	var size = function() {
		return this.arr.length;
	}

	var isEmpty = function() {
		return this.arr.length <= 0;
	}
	
	var getData = function(){
		return this.arr;
	}
	
	var clear = function(){
        this.arr.splice(0, this.arr.length);
    }
	
	var spliceElem = function(num){
		if(num > this.arr.length){
			num = this.arr.length;
		}
        this.arr.splice(num);
    }

	this.arr = new Array();
	
	this.get = get;
	this.getByIndex = getByIndex;
	this.put = put;
	this.remove = remove;
	this.size = size;
	this.isEmpty = isEmpty;
	this.getData = getData;
	this.clear = clear;
	this.spliceElem = spliceElem;
}

/*
var map = new Map();
map.put("re","redhacker");
map.put("do","douguoqiang");
map.put("gq","dougq");
alert("map的大小为：" + map.size())
alert("key为re的map中存储的对象为：" + map.get("re"));
map.remove("re");
alert("移除key为re的对象后，获取key为re的map中存储的对象为：" + map.get("re"));
alert("map移除一个元素后的大小为：" + map.size());
alert("map是否是一个空map:" + map.isEmpty());
*/