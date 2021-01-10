const POXA = {
lskey:"afe.polygon.work",
log:function(msg) {
	if(POXE) POXE.log(msg)
	else console.log(msg)
},
registerComponent:function(name,f) {
	if(AFRAME.components[name]) delete AFRAME.components[name]
	AFRAME.registerComponent(name,f) 
},
mkscene:function(data) {
	const osc = document.querySelector("a-scene")
	if(osc) $("scene").removeChild(osc)
	let ev 
	try {
		ev = new Function("POXA",'(function(){'+data.components+'})()')
	} catch(err) {
		console.log("catch eval")
		POXA.log(err,err.stack)
		return 
	}
	try {
		ev(POXA)
	} catch(err) {
		console.log("catch eval")
		POXA.log(err,err.stack)
		return 
	}
	POXA.log("regist component")
	const sc = document.createElement("a-scene")
	sc.setAttribute('background','color',"#88f")
	sc.setAttribute("embedded",true)
	sc.setAttribute("fps",true)
	sc.setAttribute("sceneinit",{query:POXA.query?.join(",")})
	sc.innerHTML = data.scenes[0]
	try {
		$("scene").appendChild(sc)
	}catch(err) {
		console.log("cache append")
		POXA.log(err,err.stack)
		return 
	}
	POXA.log("scene set OK")
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
		osc.setAttribute("visible", !ev.target.checked)
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
POXA.loadjson = function(path) {
	return new Promise((resolve,reject) => {
		const req = new XMLHttpRequest();
		req.open("get",path+"?"+new Date().getTime(),true) ;
		req.responseType = "json" ;
		req.onload = () => {
			if(req.status==200) {
				resolve(req.response) ;
			} else {
				reject("Ajax error:"+req.statusText) ;
			}
		}
		req.onerror = ()=> {
			reject("Ajax error:"+req.statusText)
		}
		req.send() ;
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
			data = await POXA.loadjson(url)
		} catch(err) {
			console.log(err)
		}
	}
	if(!data) {
		data = JSON.parse(localStorage.getItem(POXA.lskey+".scene"))
		if(data) data = data[0]
	}
	if(query[1]) POXA.query = query.slice(1)
	return data 
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

