POXLS = {
	load:function(path) {
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
	},
	loadres:function(path) {
		return POXLS.load(path)
	},
	save:function(name,data) {
		return new Promise((resolve,reject) => {
			const oData = new FormData()
			oData.append("fname", name)
			oData.append("data",JSON.stringify(data))
			var oReq = new XMLHttpRequest()
			oReq.open("POST", "save/save.php", true)
			oReq.responseType = "json" ;
			oReq.onload = function(oEvent) {
				if (oReq.status == 200) {
					if(oReq.response && oReq.response.status==0) {
						resolve()
					} else {
						reject("save error")
					}
				} else {
					reject("save error")
				}
			};
			oReq.send(oData)			
		})		
	}
}