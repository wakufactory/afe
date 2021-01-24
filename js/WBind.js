//WBind 
// license MIT
// 2017 wakufactory 
WBind = { } 

WBind.create = function(init) {
	var obj = new WBind.obj ;
	if(init!==undefined) {
		for(var i in init) {
			obj[i] = init[i] ;
		}
	}
	return obj ;
}
WBind.obj = function() {
	this.prop = {} ;
	this._elem = {} ;
	this._check = {} ;
	this._func = {} ;
	this._tobjs = {} ;
}

WBind._getobj = function(elem,root) {
	if(!root) root = document ;
	var e ;
	if(typeof elem == "string") {
		e = root.querySelectorAll(elem) ;
		if(e.length==1) e = e[0] ;
		if(e.length==0) e = null ;
	} else {
		e = elem ;
	}
	return e ;		
}
WBind._getval = function(e) {
	var v = e.value ;
	if(e.type=="checkbox") {
		v = e.checked ;
	}
	if(e.type=="select-multiple") {
		var o = e.querySelectorAll("option") ;
		v = [] ;
		for(var i=0;i<o.length;i++ ) {
			if(o[i].selected) v.push(o[i].value) ;
		}
	}
	if(e.type=="range") v = parseFloat(v) ;
	if(e.type=="file") v = e.files 
	return v ;		
}

// bind innerHTML
WBind.obj.prototype.bindHtml= function(name,elem,func) {
	var e = WBind._getobj(elem);
	if(!e) return this ;
	this._elem[name] = e ;
	if(!func) func={} ;
	this._func[name] = func ;

	Object.defineProperty(this,name,{
		configurable: true,
		get: function() {
//			WBind.log("get "+name)
			if((e instanceof NodeList || Array.isArray(e))) this.prop[name] = e[0].innerHTML ;
			else this.prop[name] = e.innerHTML ;
			return this.prop[name]  ;
		},
		set:function(val) {
//			WBind.log("set "+name) 
			if(this._func[name].set) val = this._func[name].set(val) ;
			this.prop[name] = val ;
			if((e instanceof NodeList || Array.isArray(e))) {
				for(var i=0;i<e.length;i++) {
//					console.log(this._elem[name][i])
					this._elem[name][i].innerHTML = val 
				}
			} else  this._elem[name].innerHTML = val ;
		}
	})
	if((e instanceof NodeList || Array.isArray(e))) this.prop[name] = e[0].innerHTML ;
	else this.prop[name] = e.innerHTML ;
	return this ;
}
//bind css
WBind.obj.prototype.bindStyle= function(name,elem,css,func) {
	var e = WBind._getobj(elem);
	if(!e) return this ;
	this._elem[name] = e ;
	if(!func) func={} ;
	this._func[name] = func ;	

	Object.defineProperty(this,name,{
		configurable: true,
		get: function() {
//			WBind.log("get "+name)
			if((e instanceof NodeList || Array.isArray(e))) this.prop[name] = e[0].style[css] ;
			else this.prop[name] = e.style[css] ;
			return this.prop[name]  ;
		},
		set:function(val) {
//			WBind.log("set "+name) 
			if(this._func[name].set) val = this._func[name].set(val) ;
			this.prop[name] = val ;
			if((e instanceof NodeList || Array.isArray(e))) {
				for(var i=0;i<e.length;i++) {
					this._elem[name][i].style[css] = val 
				}
			} else this._elem[name].style[css] = val ;
		}
	})
	if((e instanceof NodeList || Array.isArray(e))) this.prop[name] = e[0].style[css] ;
	else this.prop[name] = e.style[css] ;
	return this ;	
}
//bind attribute
WBind.obj.prototype.bindAttr= function(name,elem,attr,func) {
	var e = WBind._getobj(elem);
	if(!e) return this ;
	this._elem[name] = e ;
	if(!func) func={} ;
	this._func[name] = func ;	

	Object.defineProperty(this,name,{
		configurable: true,
		get: function() {
//			WBind.log("get "+name)
			if((e instanceof NodeList || Array.isArray(e))) this.prop[name] = e[0].getAttribute(attr) ;
			else this.prop[name] = e.getAttribute(attr) ;
			return this.prop[name]  ;
		},
		set:function(val) {
//			WBind.log("set "+name) 
			if(this._func[name].set) val = this._func[name].set(val) ;
			this.prop[name] = val ;
			if((e instanceof NodeList || Array.isArray(e))) {
				for(var i=0;i<e.length;i++) {
					this._elem[name][i].setAttribute(attr,val) 
				}
			} else this._elem[name].setAttribute(attr,val) ;
		}
	})
	if((e instanceof NodeList || Array.isArray(e))) this.prop[name] = e[0].getAttribute(attr) ;
	else this.prop[name] = e.getAttribute(attr) ;
	return this ;	
}
// bind input
WBind.obj.prototype.bindInput= function(name,elem,func) {
	var e = WBind._getobj(elem);
	if(!e) return this ;
	if(!func) func={} ;
	this._func[name] = func ;
	if((e instanceof NodeList || Array.isArray(e))&&
		e[0].type!="checkbox"&&e[0].type!="radio") e = e[0] ;
	var exist = (this.prop[name]!=undefined) ;
	this._elem[name] = e ;
	Object.defineProperty(this,name,{
		configurable: true,
		get: function() {
//			this.prop[name] = e.value ;
			var v = _getprop(name) ;
			if(this._func[name].get) v = this._func[name].get(v) ;
			return v  ;
		},
		set:function(val) {
//			WBind.log("set "+name) 
			if(this._func[name].set) val = this._func[name].set(val) ;
			this.prop[name] = val ;
			_setval(name,val) ;
			if(this._func[name].change) this._func[name].change(_getprop(name)) ;
			if(this._func[name].input) this._func[name].input(_getprop(name)) ;
		}
	})
	var self = this ;
	var v = null ;
	
	if((e instanceof NodeList || Array.isArray(e))) {

		if(e[0].type=="checkbox") self._check[name] = {} ;
		for(var i=0;i<e.length;i++) {
			if( typeof e[i] != "object") continue ;
			if(!exist) e[i].addEventListener("change", function(ev) {
				var val ;
				if(this.type=="checkbox" ) {
					self._check[name][this.value] = this.checked ;
					val = _getprop(name);
				}

				else val = this.value ;
				self.prop[name] = val ;
				if(self._func[name].get) val = self._func[name].get(val) ;
				WBind.log("get "+name+"="+val)
				if(self._func[name].change) self._func[name].change(val) ;
			})
			
			if(e[i].type=="radio" && e[i].checked) v = e[i].value ;
			else if(e[i].type=="checkbox" )  {
				self._check[name][e[i].value] = e[i].checked;
			}
		}
		if(e[0].type=="checkbox") v = _getprop(name);
	} else {
		v = WBind._getval(e) ;
		if(!exist) e.addEventListener("change", function(ev) {
			var val = WBind._getval(this) ;
			self.prop[name] = val ;
			if(self._func[name].get) val = self._func[name].get(val) ;
//			WBind.log("get "+name+"="+val)
			if(self._func[name].change) self._func[name].change(val) ;
		})
		if(!exist) e.addEventListener("input", function(ev) {
			var val = WBind._getval(this) ;
			self.prop[name] = val ;
			if(self._func[name].get) val = self._func[name].get(val) ;
	//		WBind.log("get "+name+"="+this.value)
			if(self._func[name].input) self._func[name].input(val) ;
		})
	}
	if(this._func[name].get) v = this._func[name].get(v) ;
	this.prop[name] = v ;
	if(self._func[name].input) this._func[name].input(v) ;
	if(self._func[name].change) this._func[name].change(v) ;


	function _getprop(name) {
		var v ;
		if(self._check[name]) {
			v = [] ;
			for(var i in self._check[name]) {
				if(self._check[name][i]) v.push(i);
			}
			self.prop[name] = v ;
		} else  v = self.prop[name] ;
		return v ;
	}

	function _setval(name,v) {
		var e = self._elem[name] ;
		if(e instanceof NodeList || Array.isArray(e)) {
			if(e[0].type=="radio") {
				for(var i=0;i<e.length;i++ ) {
					if(e[i].value == v) e[i].checked = true ;
				}
			}
			else if(e[0].type=="checkbox") {
				var chk = {} ;
				for(var i=0; i<v.length;i++) {
					chk[v[i]] = true ;
				}
				for(var i=0;i<e.length;i++ ) {
					e[i].checked = chk[e[i].value] ;
				}
				self._check[name] = chk ;
			}
		} 
		else if(e.type=="checkbox") e.checked = v ;
		else if(e.type=="select-multiple") {
			var o = e.querySelectorAll("option") ;
			for(var i=0;i<o.length;i++ ) {
				o[i].selected = false ;
				for(var vi=0;vi<v.length;vi++) {
					if(o[i].value==v[vi]) o[i].selected = true ;
				}
			}			
		}
		else if(e.type=="file") ;
		else e.value = v ;	
	}
	return this ;
}

WBind.obj.prototype.getCheck = function(name) {
	return this._check[name] ;
}
//set callback function
WBind.obj.prototype.setFunc = function(name,func) {
	for(var f in func) {
		this._func[name][f] = func[f] ;
	}
	var val = WBind._getval( this._elem[name]) ;
	if(this._func[name].get) val = this._func[name].get(val) ;
	this.prop[name] = val ;
	return this._func[name]  ;
}
//bind all input elements
WBind.obj.prototype.bindAllInput = function(base) {
	if(!base) base = document ;
	var o = base.querySelectorAll("input,select,textarea") ;
	var na = {} ;
	for(var i=0;i<o.length;i++) {
		var n = o[i].name ;
		if(na[n]) {
			if(Array.isArray(na[n])) na[n].push(o[i]) ;
			else na[n] = [na[n],o[i]] ;
		} else na[n] = o[i] ;
	}
	for(var i in na) {
		this.bindInput(i,na[i])
	}
	return na ;
}
WBind.obj.prototype.bindAll = function(selector,base) {
	if(base==null) base = document ;
	var b = base.querySelectorAll(selector) ;
	for(var i=0;i<b.length;i++) {
		var name = b[i].getAttribute("data-bind") ;
		if(b[i].tagName=="INPUT"||b[i].tagName=="SELECT") {
			this.bindInput(name,b[i]) ;
		} else {
			this.bindHtml(name,b[i])
		}
	}
}
//bind timer
WBind.obj.prototype.setTimer = function(name,to,ttime,opt) {
	if(Array.isArray(to)) {
		return this.setTimerM(name,to) ;
	}
	if(!opt) opt = {} ;
	var cd ;
	var sfx = null ;
	if(opt.from) cd = opt.from  ;
	else cd = this[name] ;
	if(isNaN(cd)) {
		if(cd.match(/^([0-9\-\.]+)(.*)$/)) {
			cd = parseFloat(RegExp.$1) ;
			opt.sfx = RegExp.$2 ;
		}
		else cd = 0 ;	
	} ;
	if(cd == to) return this;
	var delay = 0 ;
	if(opt.delay) delay = opt.delay ;
	var now = new Date().getTime() ;
	var o =  {from:cd,to:to,st:now+delay,et:now+delay+ttime,opt:opt} ;
	this._tobjs[name] = {tl:[o],tc:0} ;
//	WBind.log(o) ;
	return this ;
}
WBind.obj.prototype.setTimerM = function(name,s) {
	var o = [] ;
	var now = new Date().getTime() ;
	var cd = this[name] ;
	for(var i=0;i<s.length;i++) {
		var to = s[i].to ;
		var ttime = s[i].time ;
		var opt = s[i].opt ;
		if(!opt) opt = {} ;

		var sfx = null ;
		if(isNaN(cd)) {
			if(cd.match(/^([0-9\-\.]+)(.*)$/)) {
				cd = parseFloat(RegExp.$1) ;
				opt.sfx = RegExp.$2 ;
			}
			else cd = 0 ;	
		} ;
//		if(cd == to) continue ;
		var delay = 0 ;
		if(opt.delay) delay = opt.delay ;
		o.push({from:cd,to:to,st:now+delay,et:now+delay+ttime,opt:opt}) ;
		cd = to ;
	}
	this._tobjs[name] = {tl:o,tc:0} ;
	console.log(o);
	return this ;
}
WBind.obj.prototype.clearTimer = function(name) {
	delete(this._tobjs[name])
}
WBind.obj.prototype.updateTimer = function() {
	var now = new Date().getTime() ;
	for(var name in this._tobjs) {
		var obj = (this._tobjs[name])
		var o = obj.tl[obj.tc] ;
//		console.log(o);
		if(o===undefined) continue ;
		
		if(o.st>now) continue ;
		if(o.et<=now) {
			var v = o.to ;
			if(o.opt.sfx) v = v + o.opt.sfx ;
			this[name] = v ;
//			WBind.log("timeup "+o.key) ;
			obj.tc++ ;
			if(this._tobjs[name].tl.length<obj.tc) delete(this._tobjs[name]) ;
			if(o.opt.efunc) o.opt.efunc(o.to) ;

		} else {
			var t = (now-o.st)/(o.et-o.st) ;
			if(o.opt.tfunc) {
				if(typeof o.opt.tfunc =="string") {
					switch(o.opt.tfunc) {
						case "ease-in":
							t = t*t ;
							break ;
						case "ease-out":
							t = t*(2-t) ;
							break ;
						case "ease-inout":
							t = t*t*(3-2*t) ;
							break;
					}
				} else t = o.opt.tfunc(t) ;
			}
			var v = o.from + (o.to-o.from)* t;
			if(o.opt.sfx) v = v + o.opt.sfx ;
//			WBind.log(o.key+"="+v) ;
			this[name] = v ;
		}
	}
}


//utils
WBind.log = function(msg) {
	console.log(msg) ;
}
WBind.addev = function(id,event,fn,root) {
	var e = WBind._getobj(id,root) ;
	if(e) {
		if(!(e instanceof NodeList) && !Array.isArray(e)) e = [e] 
		for(var i=0;i<e.length;i++) {
			e[i].addEventListener(event,function(ev) {
				if(!fn(ev)) ev.preventDefault() ;
			}) ;
		}
	}
}
WBind.set = function(data,root) {
	if(!root) root = document ;
	if(!(data instanceof Array)) data = [data] ;

	for(var i =0;i<data.length;i++) {
		var d = data[i] ;
		var e ;
		if(d.obj) e = WBind._getobj(d.obj,root) ;
		if(d.id) e = root.getElementById(d.id) ;
		if(d.sel) e = root.querySelectorAll(d.sel) ;
		if(!e) continue ;
		if(!(e instanceof NodeList || Array.isArray(e))) e = [e] ;
		for(var ee=0;ee<e.length;ee++ ) {
			if(d.html !=undefined) e[ee].innerHTML = d.html ;
			if(d.value !=undefined) e[ee].value = d.value ;
			if(d.attr !=undefined) e[ee].setAttribute(d.attr,d.value) ;
			if(d.style !=undefined) {
				for(s in d.style) e[ee].style[s] = d.style[s] ;
			}
		}
	}
}
