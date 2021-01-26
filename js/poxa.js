POXA = {
lskey:"afe.polygon.work",
log:function(msg) {
	if(window.POXE) POXE.log(msg)
	else console.log(msg)
},
registerComponent:function(name,f) {
	if(AFRAME.components[name]) delete AFRAME.components[name]
	AFRAME.registerComponent(name,f)
	POXA.log("regist component "+name)
},
registerShader:function(name,f) {
	if(AFRAME.shaders[name]) delete AFRAME.shaders[name]
	AFRAME.registerShader(name,f) 
	POXA.log("regist shader "+name)
},
registerSystem:function(name,f) {
	if(AFRAME.systems[name]) delete AFRAME.systems[name]
	AFRAME.registerSystem(name,f) 
	POXA.log("regist system "+name)
},
registerGeometry:function(name,f) {
	if(AFRAME.geometries[name]) delete AFRAME.geometries[name]
	AFRAME.registerGeometry(name,f) 
	POXA.log("regist geometry "+name)
},
initscene:function() {
	const osc = document.querySelector("a-scene")
	if(osc) $("scene").removeChild(osc)
		const sc = document.createElement("a-scene")
		sc.setAttribute('background','color',"#88f")
		sc.setAttribute("embedded","true")
		sc.setAttribute("fps",true)
		sc.setAttribute("sceneinit","query:"+POXA.query?.join(","))	
		$("scene").appendChild(sc)
		POXA.scene = sc 
		$('pui').innerHTML = ""
		POXA.uprop = null 
},
loadscene:function(data,attr) {
	let ev 
	try {
		ev = new Function("POXA",''+data.components+'')
	} catch(err) {
		console.log("catch eval")
		POXA.log(err,err.stack)
		return 
	}
	let ret 
	try {
		ret = ev(POXA)
	} catch(err) {
		console.log("catch eval")
		POXA.log(err,err.stack)
		return 
	}
	if(ret !==undefined) {
		if(ret.constructor==Promise) {
			ret.then(data=>{
				console.log("completed")
				addscene(attr)
			})
		}
	} else addscene(attr)
	function addscene(attr) {
		if(!attr || !attr.import) {
			const osc = document.querySelector("a-scene")
			if(osc) $("scene").removeChild(osc)
			const sc = document.createElement("a-scene")
			sc.setAttribute('background','color',"#88f")
			sc.setAttribute("embedded",true)
			sc.setAttribute("fps",true)
			sc.setAttribute("sceneinit","query:"+POXA.query?.join(","))	
			POXA.scene = sc 
			$("scene").appendChild(sc )
			$('pui').innerHTML = ""
			POXA.uprop = null 		
		}
		const dc = document.createElement("a-entity")
		for(let p in attr) dc.setAttribute(p,attr[p])
		dc.innerHTML = data.scenes[0]
		dc.childNodes.forEach(o=>{
			if(o.tagName=="A-ASSETS") {
				POXA.scene.appendChild(o)
			}
			if(attr?.import && o.id=="camrig") {
				dc.removeChild(o)
			}
		})
		try {
			POXA.scene.appendChild(dc)			
		}catch(err) {
			console.log("catch append")
			POXA.log(err,err.stack)
			return 
		}
		POXA.log("scene set OK")
	}
}
}
POXA.init = function() {
	$("c_stats")?.addEventListener("change", (ev)=>{
		const osc = document.querySelector("a-scene")
		if(ev.target.checked) osc.setAttribute("stats",true)
		else osc.removeAttribute("stats")
	})
	$("pause")?.addEventListener("change", (ev)=>{
		const osc = document.querySelector("a-scene")
		ev.target.checked?osc.pause():osc.play()
	})
	document.addEventListener('fullscreenchange', (event) => {
		if(document.fullscreenElement) {
				if($('editp')) $('editp').style.display = "none"
				document.querySelector("a-scene").emit("exit-vr")	
		} else {
				if($('editp')) $('editp').style.display = "block"	
		}
	})	
	POXA.registerComponent('fps',{
		init:function() {
			this.buf = new Array(60)
			this.bi = 0 
			this.lt = 0
		},
		tick:function(time,td) {
			this.buf[this.bi++] = td 
			if(this.bi>=this.buf.length) this.bi = 0
			if(Math.floor(time/500)!=this.lt) {
				this.lt = Math.floor(time/500)
				let fps = 1000/this.buf.reduce((a,v)=>{return a+v},0)*this.buf.length+0.05
				let info = this.el.sceneEl.renderer.info.render
				if($('fps')) $('fps').innerHTML = `${info.calls} CALLS/${info.triangles}△/${fps.toString().substr(0,4)}FPS`
			}
		}	
	})	
}

POXA.load = async (path)=> {
	let data = null 
	const query = location.search.substr(1).split("&")
	let url 
	if(path) url = path 
	else if(query[0].match(/\.json$/)) url = query[0]
	
	if(url) {
		try {
			data = await POXLS.load(url)
		} catch(err) {
			console.log(err)
			return null 
		}
	}
	if(!data) {
		data = JSON.parse(localStorage.getItem(POXA.lskey+".scene"))
		if(data) data = data[0]
	}
	if(query[1]) POXA.query = query.slice(1)
	return data 
}
POXA.importScene = async function(path,attr) {
	const data = await POXA.load(path)
	console.log(data)
	if(data!==null) {
		POXA.loadscene(data,attr)
	}
} 
POXA.setimport = async function(list) {
	const pl = []
	list.forEach(a=>{
		const p = new Promise((resolve,reject)=>{
			const el = document.createElement("script")
			el.src = a 
			el.onload = (e)=>{
				resolve()
			}
			document.head.appendChild(el)
		})
		pl.push(p)
	})
	return Promise.all(pl)
}

POXA.setUIproperty = function(comp,prop,cb=null) {
	if(prop===undefined) return ;
	const dom = $('pui')
	if(!dom) return ;
	const cname = comp.name 
	if(!cname) cname="" 
	console.log(cname)
	if(!POXA.uprop) POXA.uprop = WBind.create()
	let tag 
	for(let i in prop) {
		const p = prop[i] ;
		const name = (p.name)?p.name:i ;
		let size = ""
		if(!p.type) p.type = "range" 
		if(!p.step) p.step = 100 ;
		if(p.size) size = "size="+p.size
		tag = document.createElement("div")
		tag.className = "b"
		tag.innerHTML = `<div class=t>${name}</div> <input type=${p.type} id="_p_${cname}_${i}" ${size} min=0 max=${p.step} style="${(p.type=="disp")?"display:none":""}"  /><div class=v id=${"_p_d_"+cname+"_"+i}></div>`
		dom.appendChild(tag)
	}
	function _tohex(v) {
		let s = (v*255).toString(16) ;
		if(s.length==1) s = "0"+s ;
		return s ;
	}
	function _setdisp(i,v) {
		if(v===undefined || prop[i].type=="file"|| prop[i].type=="text"|| prop[i].type=="button") return 
		const dobj = document.getElementById(`_p_d_${cname}_`+i)
		if(prop[i].type=="color" && v ) {
			dobj.innerHTML = v.map((v)=>v.toString().substr(0,5)) ;
		} else if(prop[i].type=="range")  {
			if(prop[i].enum) {
				dobj.innerHTML = prop[i].enum[Math.floor(v)]
			} else dobj.innerHTML = v.toString().substr(0,5) ;	
		} else dobj.innerHTML = v
	}
	for(let i in prop) {
		let p = prop[i]
		POXA.uprop.bindInput(i,"#_p_"+cname+"_"+i)
		POXA.uprop.setFunc(i,{
			set:(v)=> {
				let ret = v ;
				if(p.type=="color") {
					ret = "#"+_tohex(v[0])+_tohex(v[1])+_tohex(v[2])
				} else if(p.type=="range") {
					if(p.scale=="log10") ret = Math.log10(v/p.min)/Math.log10(p.max/p.min)*p.step
					else ret = (v - p.min)*(p.step)/(p.max - p.min)
				}
//				console.log(ret)
				_setdisp(i,ret)
				return ret 	
			},
			get:(v)=> {
				let ret = v ;
				if(p.type=="color" ) {
					if(typeof v =="string" && v.match(/#[0-9A-F]+/i)) {
						ret =[parseInt(v.substr(1,2),16)/255,parseInt(v.substr(3,2),16)/255,parseInt(v.substr(5,2),16)/255] ;
					} else ret = v ;
				} else if(p.type=="range" ) {
					if(p.scale=="log10") ret = Math.pow(10,Math.log10(p.min)+Math.log10(p.max/p.min)*v/p.step)
					else ret = v*(p.max-p.min)/(p.step)+p.min 
				}
				return ret ;
			},
			input:(v)=>{
				_setdisp(i,POXA.uprop[i])
//				this.keyElelment.focus()
//				this.callEvent("prop",{key:i,value:v})
				if(cb) cb({key:i,value:POXA.uprop[i]})
			}
		})
		POXA.uprop[i] = p.value ;
	}
}
