//浏览器检测
(function(){
	window.sys={};
	var ua=navigator.userAgent.toLowerCase();
	var s;
	(s=ua.match(/msie([\d.]+)/))?sys.ie=s[1]:
	(s=ua.match(/firefox\/([\d.]+)/))?sys.firefox=s[1]:
	(s=ua.match(/chrome\/([\d.]+)/))?sys.chrome=s[1]:
	(s=ua.match(/opera\/.*version\/([\d.]+)/))?sys.opera=s[1]:
	(s=ua.match(/version\/([\d.]+).*safari/))?sys.safari=s[1]:0;
	//alert(ua);
	if(/webkit/.test(ua)) 
		sys.webkit=ua.match(/webkit\/([\d.]+)/)[1];
		//alert(sys.webkit);
})();
//DOM加载
function addDomLoaded(fn){
	var isReady=false;
	var timer=null;
	function doReady(){
		if(timer) clearInterval(timer);
		if(isReady) return;
		isReady=true;
		fn();
	}
	if((sys.opera&&sys.opera<9)||(sys.firefox&&sys.firefox<3)||(sys.webkit&&sys.webkit<525)){
		/*timer=setInterval(function(){
		if(/loaded|complete/.test(document.readyState)){//loaded是部分加载,
			doReady();
		}
	},1);*/
		timer=setInterval(function(){
		if(document&&document.getElementById&&document.getElementsByTagName&&document.body){
			doReady();
		}
	},1);	
	}else if(document.addEventListener){
		addEvent(document,'DOMContentLoaded',function(){
			fn();
			removeEvent(document,'DOMContentLoaded',arguments.callee);
		});
	} else if(sys.ie&&sys.ie<9){
		var timer=null;
		timer=setInterval(function(){
			try{
				document.documentElement.doScroll('left');
				doReady();
			}catch(e){};
		},1);
	}
}

//跨浏览器事件绑定
function addEvent(obj,type,fn){
	if(typeof obj.addEventListener !='undefined'){
		obj.addEventListener(type,fn,false);
	}else{
		//var box={};
		if(!obj.events) obj.events={};
		if(!obj.events[type]){
			obj.events[type]=[];
			if(obj['on'+type]) obj.events[type][0]=fn;
		}else{
			if(addEvent.equal(obj.events[type],fn)) return false;
		}
		obj.events[type][addEvent.ID++]=fn;
		obj['on'+type]=addEvent.exec;
	}
}
addEvent.ID=1;
//执行事件处理函数
addEvent.exec=function(event){
	var e=event||addEvent.fixEvent(window.event);
	var es=this.events[e.type];
	for(var i in es){
				es[i].call(this,e);
			}
};
//同一个注册函数进行屏蔽
addEvent.equal=function(es,fn){
	for(var i in es){
		if(es[i]==fn) return true;
	}
	return false;
}
//把IE常用的Event对象配对到W3C中
addEvent.fixEvent=function(event){
	event.preventDefault=addEvent.fixEvent.preventDefault;
	event.stopPropagation=addEvent.fixEvent.stopPropagation;
	event.target=event.srcElement;
	return event;
}
//IE阻止默认行为
addEvent.fixEvent.preventDefault=function(){
	this.returnValue=false;
};
//IE取消冒泡
addEvent.fixEvent.stopPropagation=function(){
	this.cancelBubble=true;
};
//跨浏览器删除事件
function removeEvent(obj,type,fn){
	if(typeof obj.removeEventListener !='undefined'){
		obj.removeEventListener(type,fn,false);
	}else {
		//alert(obj.events);
		if(obj.events){
		for(var i in obj.events[type]){
			if(obj.events[type][i]==fn){
			delete obj.events[type][i];
			}
			}
		}
	}
}

//跨浏览器获取窗口大小
function getInner(){
	if(typeof window.innerWidth!='undefined'){
		return{
			width:window.innerWidth,
			height:window.innerHeight
		}
	}else{
		return{
			width:document.documentElement.clientWidth,
			height:document.documentElement.clientHeight
		}
	}
}
//跨浏览器获取滚动条位置
function getScroll(){
	return {
		top:document.documentElement.scrollTop||document.body.scrollTop,
		left:document.documentElement.scrollLeft||document.body.scrollLeft
	}
}
//跨浏览器获取Style
function getStyle(element,attr){
	var value;
	if(typeof window.getComputedStyle!='undefined'){	//W3C
				value=window.getComputedStyle(element,null)[attr];
			}else if(typeof element.currentStyle!='undefined'){//IE
				value=element.currentStyle[attr];
			}
			return value;
}
//判断class是否存在
function hasClass(element,className){
	return element.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
}
//跨浏览器添加link或style的CSS规则
function insertRule(sheet,selectorText,cssText,position){
	if(typeof sheet.insertRule !='undefined'){
		sheet.insertRule(selectorText+'{'+cssText+'}',position);//W3C
	}else if(typeof sheet.addRule !='undefined'){
		sheet.addRule(selectorText,cssText,position);//IE
	}
}
//跨浏览器移除link或style的CSS规则
function deleteRule(sheet,index){
	if(typeof sheet.deleteRule !='undefined'){
		sheet.deleteRule(index);//W3C
	}else if(typeof sheet.removeRule !='undefined'){
		sheet.removeRule(index);//IE
	}
}
//跨浏览器获取innerText
function getInnerText(element){
	return (typeof element.textContent=='string')? element.textContent:element.innerText;
}
//跨浏览器设置innerText
function setInnerText(element,text){
	if(typeof element.textContent=='string'){
		element.textContent=text;	
	}else{
		element.innerText=text;
	}
}
//获取某一个元素到最外层顶点的位置
function offsetTop(element){
	var top=element.offsetTop;
	var parent=element.offsetparent;
	while(parent!=null){
		top+=parent.offsetTop;
		parent=element.offsetparent;
	}
	return top;
}
//删除左右空格
function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g,'');
}
//某一个值是否存在某个数组中
function inArray(array,value){
	for(var i in array){
		if(array[i]===value)	return true;
	}
	return false;
}

//滚动条清零
/*function scrollTop(){
	document.documentElement.scrollTop=0;
	document.body.scrollTop=0;
}*/
//获取某一个节点的上一个节点的索引
function prevIndex(current,parent){
	var length=parent.children.length;
	if(current==0) return length-1;
	return parseInt(current)-1;
}
//获取某一个节点的下一个节点的索引
function nextIndex(current,parent){
	var length=parent.children.length;
	if(current==length-1) return 0;
	return parseInt(current)+1;
}

//阻止默认行为
function predef(e){
	e.preventDefault();
}
