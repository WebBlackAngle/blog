//前台调用
var $=function(args){
	return new Base(args);
}
//基础库
function Base(args){
	this.elements=[];
	if(typeof args=='string'){
		//css模拟
		if(args.indexOf(' ') !=-1){
			var elements=args.split(' ');//把借点拆开
			var childElements=[];//存放临时节点对象的数组,解决被覆盖的问题
			var node=[];		//用来存放父节点
			for(var i=0;i<elements.length;i++){
				if(node.length==0) node.push(document);	//如果默认没有父节点 就把document放入
				switch(elements[i].charAt(0)){
				case '#':
					childElements=[];//清理到临时节点，以便父节点失效，子节点有效
					childElements.push(this.getId(elements[i].substring(1)));	
					node=childElements;
					break;
				case '.':
					childElements=[];
					for(var j=0;j<node.length;j++){
						var temps=this.getClass(elements[i].substring(1),node[j]);
						for(var k=0;k<temps.length;k++){
							childElements.push(temps[k]);
						}
					}
					node=childElements;		
					break;
				default:
					childElements=[];
					for(var j=0;j<node.length;j++){
						var temps=this.getTagName(elements[i],node[j]);
						for(var k=0;k<temps.length;k++){
							childElements.push(temps[k]);
						}
					}
					node=childElements;					
				}
			}
			this.elements=childElements;
		}else{
			//find模拟
			switch(args.charAt(0)){
				case '#':	this.elements.push(this.getId(args.substring(1)));	
					break;
				case '.':	this.elements=this.getClass(args.substring(1));	
					break;
				default:	this.elements=this.getTagName(args);
					
			}
		}	
	}else if(typeof args=='object'){
		if(args!=undefined){
		this.elements[0]=args;
		}
	}else if(typeof args=='function'){
		 this.ready(args);
	}
};
//addDomLoaded
Base.prototype.ready=function(fn){
	 addDomLoaded(fn);
};
//创建一个数组，来保存获取的节点和节点数组

	//获取ID节点
Base.prototype.getId=function(id){
		//this.elements.push(document.getElementById(id));
		return document.getElementById(id);
};
	//获取元素节点
Base.prototype.getTagName=function(tag,parentNode){
	var node=null;
	var temps=[];
	if(parentNode !=undefined){
		node=parentNode;
	}else{
		node=document;
	}
	var tags=node.getElementsByTagName(tag);
	for(var i=0;i<tags.length;i++){
	temps.push(tags[i]);
	}
	return temps;
};
//获取CLASS节点数组
Base.prototype.getClass=function(className,parentNode){
	var node=null;
	var temps=[];
	if(parentNode !=undefined){
		node=parentNode;
	}else{
		node=document;
	}
	var all=node.getElementsByTagName('*');
	for(var i=0;i<all.length;i++){
		if((new RegExp('(\\s|^)'+className+'(\\s|$)')).test(all[i].className)){
			temps.push(all[i]);
		}
	}
	return temps;
}
//设置CSS选择器子节点
Base.prototype.find=function(str){
	var childElements=[];
	for(var i=0;i<this.elements.length;i++){
		switch(str.charAt(0)){
			case '#':
				childElements.push(this.getId(str.substring(1)));
				break;
			case '.':	
				var temps=this.getClass(str.substring(1),this.elements[i]);
				for(var j=0;j<temps.length;j++){
				childElements.push(temps[j]);
				}
				break;
			default:	 
				var temps=this.getTagName(str,this.elements[i]);
				for(var j=0;j<temps.length;j++){
				childElements.push(temps[j]);
				}
			}
		}
	this.elements=childElements;
	return this;
};

//获取某一个节点，并且返回节点对象
Base.prototype.ge=function(num){
	return this.elements[num];
};
//获取首个节点，并且返回这个节点对象
Base.prototype.first=function(){
	return this.elements[0];
};
//获取末个节点，并且返回这个节点对象
Base.prototype.last=function(){
	return this.elements[this.elements.length-1];
};
//获取某组节点的数量
Base.prototype.length=function(){
	return this.elements.length;
};
//获取某一节点的属性
Base.prototype.attr=function(attr,value){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==1){
			return this.elements[i].getAttribute(attr);
		}else if(arguments.length==2){
			this.elements[i].setAttribute(attr,value);
		}
	}
	return this;
};
//获取某一节点在整个节点组中的索引
Base.prototype.index=function(){
	var children=this.elements[0].parentNode.children;
	for(var i=0;i<children.length;i++){
		if(this.elements[0]==children[i])	return i;
	}
};
//设置某一个节点的透明度
Base.prototype.opacity=function(num){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.opacity=num/100;
		this.elements[i].style.filter='alpha(opacity='+num+')';	
	}
	return this;
};


//获取某一个节点，并且返回Base对象
Base.prototype.eq=function(num){
	var element=this.elements[num];
	this.elements=[];
	this.elements[0]=element;
	return this;
};
//获取当前节点的下一个元素节点
Base.prototype.next=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i]=this.elements[i].nextSibling;
		if(this.elements[i]==null)  throw Error('找不到下一个同级元素节点');
		if(this.elements[i].nodeType==3)	this.next();
	}
	return this;
};
//获取当前节点的上一个元素节点
Base.prototype.prev=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i]=this.elements[i].previousSibling;
		if(this.elements[i]==null)  throw Error('找不到上一个同级元素节点');
		if(this.elements[i].nodeType==3)	this.prev();
	}
	return this;
};
//设置CSS
Base.prototype.css=function(attr,value){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==1){
			return getStyle(this.elements[i],attr);
		}
		this.elements[i].style[attr]=value;
	}
		return this;
	}
//添加Class
Base.prototype.addClass=function(className){
	for(var i=0;i<this.elements.length;i++){
		if(!hasClass(this.elements[i],className)){
			this.elements[i].className+=' '+className;
		}
	}
	return this;
}
//移除Class
Base.prototype.removeClass=function(className){
	for(var i=0;i<this.elements.length;i++){
		if(hasClass(this.elements[i],className)){
			this.elements[i].className=this.elements[i].className.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),' ');
		}
	}
	return this;
}
//添加link或style的CSS规则
Base.prototype.addRule=function(num,selectorText,cssText,position){
	var sheet=document.StyleSheets[num];
	insertRule(sheet,selectorText,cssText,position);
	return this;
}
//移除link或style的CSS规则
Base.prototype.addRule=function(num,index){
	var sheet=document.StyleSheets[num];
	deleteRule(sheet,index);
	return this;
}
//设置表单字段元素
Base.prototype.form=function(name){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i]=this.elements[i][name];
	}
	return this;
}
//设置表单字段内容获取
Base.prototype.value=function(str){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==0){
			return this.elements[i].value;
		}
		this.elements[i].value=str;
	}
	return this;
}
//设置innerHTML
Base.prototype.html=function(str){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==0){
			return this.elements[i].innerHTML;
		}
		this.elements[i].innerHTML=str;
	}
	return this;
}
//设置innerText
Base.prototype.text=function(str){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==0){
			return getInnerText(this.elements[i]);
		}
		setInnerText(this.elements[i],text);
	}
	return this;
}
//设置事件发生器
Base.prototype.bind=function(event,fn){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],event,fn);
	}
	return this;
};

//设置鼠标移入移出方法
Base.prototype.hover=function(over,out){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'mouseover',over);
		addEvent(this.elements[i],'mouseout',out);
	}
	return this;
};
//设置点击切换
Base.prototype.toggle=function(){
	for(var i=0;i<this.elements.length;i++){
		//tog(this.elements[i],arguments);
		(function(element,args){
			var count=0;
			addEvent(element,'click',function(){	
			args[count++%args.length].call(this);
		});
		})(this.elements[i],arguments);
	}
		return this;
};
/*function tog(element,args){
	var count=0;
	addEvent(element,'click',function(){	
		args[count++%args.length].call(this);
	});
}*/


//设置显示
Base.prototype.show=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='block';
	}
		return this;
};
//设置隐藏
Base.prototype.hide=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='none';
	}
		return this;
};
//设置物体居中
Base.prototype.center=function(width,height){
	var top=(getInner().height-height)/2+getScroll().top;
	var left=(getInner().width-width)/2+getScroll().left;
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.top=top+'px';
		this.elements[i].style.left=left+'px';
	}
		return this;
	}
//设置锁屏
Base.prototype.lock=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.width=getInner().width+getScroll().left+'px';
		this.elements[i].style.height=getInner().height+getScroll().top+'px';
		this.elements[i].style.display='block';
		parseFloat(sys.firefox)<4?document.body.style.overflow='hidden':document.documentElement.style.overflow='hidden';
		//addEvent(window,'scroll',scrollTop);
		addEvent(document,'mousedown',predef);
		addEvent(document,'mouseup',predef);
		addEvent(document,'selectstart',predef);
	}
		return this;
}
//设置解屏
Base.prototype.unlock=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='none';
		parseFloat(sys.firefox)<4?document.body.style.overflow='auto':document.documentElement.style.overflow='auto';
		//removeEvent(window,'scroll',scrollTop);
		removeEvent(document,'mousedown',predef);
		removeEvent(document,'mouseup',predef);
		removeEvent(document,'selectstart',predef);
	}
		return this;
}
//触发点击事件
Base.prototype.click=function(fn){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].onclick=fn;
	}
		return this;
	}
//触发浏览器窗口事件
Base.prototype.resize=function(fn){
	for(var i=0;i<this.elements.length;i++){
		var element=this.elements[i];
		addEvent(window,'resize',function(){
			fn();
		if(element.offsetLeft>getInner().width+getScroll().left-element.offsetWidth){
			element.style.left=getInner().width+getScroll().left-element.offsetWidth+'px';
			if(element.offsetLeft<=0+getScroll().left){
			element.style.left=0+getScroll().left+'px';
			}
		}
		
		if(element.offsetTop>getInner().height+getScroll().top-element.offsetHeight){
			element.style.top=getInner().height+getScroll().top-element.offsetHeight+'px';
			if(element.offsetTop<=0+getScroll().top){
			element.style.top=0+getScroll().top+'px';
			}
		}
		});
	}
		return this;
	
}
//设置动画
Base.prototype.animate=function(obj){
	for(var i=0;i<this.elements.length;i++){
		var element=this.elements[i];
		var attr=obj['attr']=='x'?'left':obj['attr']=='y'?'top':
					 obj['attr']=='w'?'width':obj['attr']=='h'?'height':
					 obj['attr']=='o'?'opacity':obj['attr']!=undefined?obj['attr']:'left';
		var start=obj['start']!=undefined?obj['start']:
						attr=='opacity'?parseFloat(getStyle(element,attr)).toFixed(2)*100:
												 parseInt(getStyle(element,attr));
		var t=obj['t']!=undefined?obj['t']:10;
		var step=obj['step']!=undefined?obj['step']:20;
		var alter=obj['alter'];
		var target=obj['target'];
		var mul=obj['mul'];
		var speed=obj['speed']!=undefined?obj['speed']:6;
		var type=obj['type']==0?'constant':obj['type']==1?'buffer':'buffer';
		if(alter!=undefined&&target==undefined){
			target=alter+start;
		}else if(alter==undefined&&target==undefined&&mul==undefined){
			throw new Error('增量alter和目标量target必须传一个');
		}
		if(start>target) step=-step;
		if(attr=='opacity'){
			element.style.opacity=parseInt(start)/100;
			element.style.filter='alpha(opacity='+parseInt(start)+')';
		}
		//alert(start);
		if(mul==undefined){
			mul={};
			mul[attr]=target;
		}
		clearInterval(element.timer);
		element.timer=setInterval(function(){
			/*问题1:多个动画执行了多了列队动画，我们只要求执行一个列队动画*/
			/*问题2:多个动画数值差别过大，导致动画无法到达目标值*/
			//创建一个布尔值，这个值可以了解多个动画是否都执行完毕
			var flag=true;
			
			
			
			for(var i in mul){
				attr=i=='x'?'left':i=='y'?'top':i=='w'?'width':i=='h'?'height':i=='o'?'opacity':i!=undefined?i:'left';
				target=mul[i];
				if(type=='buffer'){
					step=attr=='opacity'?(target-parseFloat(getStyle(element,attr)).toFixed(2)*100)/speed:
													(target-parseInt(getStyle(element,attr)))/speed;
					step=step>0?Math.ceil(step):Math.floor(step);
				}
				if(attr=='opacity'){
					if(step==0){
						setOpacity();
					}else if(step>0&&Math.abs(parseFloat(getStyle(element,attr)).toFixed(2)*100-target)<=step){
						setOpacity();
					}else if(step<0&&(parseFloat(getStyle(element,attr)).toFixed(2)*100-target)<=Math.abs(step)){
						setOpacity();
					}else{
						var temp=parseFloat(getStyle(element,attr)).toFixed(2)*100;		//关键在这里的小数
						element.style.opacity=parseInt(temp+step)/100;
						element.style.filter='alpha(opacity='+parseInt(temp+step)+')';
					}
					if(parseInt(target) !=parseInt(parseFloat(getStyle(element,attr))*100))	flag=false;
				}else{
					if(step==0){
						setTarget();
					}else if(step>0&&Math.abs(parseInt(getStyle(element,attr))-target)<=step){
						setTarget();
					}else if(step<0&&(parseInt(getStyle(element,attr))-target)<=Math.abs(step)){
						setTarget();
					}else{
						element.style[attr]=parseInt(getStyle(element,attr))+step+'px';
					}
					if(parseInt(target)!=parseInt(getStyle(element,attr))) flag=false;
				}
				//document.getElementById('test').innerHTML+='</br>'+i+'--'+parseInt(target)+'--'+parseInt(getStyle(element,attr))+'--'+flag+'</br>';
			}
			if(flag){
				clearInterval(element.timer);
				if(obj.fn!=undefined) obj.fn(); 
			}
		//document.getElementById('aaa').innerHTML+=step+'</br>';
		//document.getElementById('aaa').innerHTML+=getStyle(element,attr)+'</br>';
		//document.getElementById('aaa').innerHTML+=parseFloat(getStyle(element,attr)).toFixed(2)+'</br>';
	},t);
		function setTarget(){
			element.style[attr]=target+'px';
		}
		function setOpacity(){
			element.style.opacity=parseInt(target)/100;
			element.style.filter='alpha(opacity='+parseInt(target)+')';
		}
	}
	return this;	
};

//插件入口
Base.prototype.extend=function(name,fn){
	Base.prototype[name]=fn;
};


















