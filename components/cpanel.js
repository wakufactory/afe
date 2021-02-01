(async function() {
	regist()

function regist() {
AFRAME.registerComponent('cpanel',{
	schema: {
		text:{default:[""]},
		ppm:{default:512},
		font:{default:"40px monospace"},
		color:{default:"#222"},
		clearColor:{default:"#fff0"},
		lheight:{default:40}
	},
	init:function() {
		const elg = this.el.components.geometry.data
		const data = this.data
		if(this.el.innerHTML!="") this.data.text=this.el.innerHTML.split("\n")
		this.pcanvas = document.createElement('canvas') ;
		this.pcanvas.width = data.ppm * elg.width ;
		this.pcanvas.height = data.ppm * elg.height ;	
		this.data.lines = Math.floor(this.pcanvas.height/data.lheight)
		this.j2c = new json2canvas(this.pcanvas)
		this.j2c.default.font = data.font
		this.j2c.default.textColor = data.color
		this.clearColor = data.clearColor 
		this.ctx = this.j2c.ctx
		this.dd = []
		let y = data.lheight 
		for(let i=0;i<data.lines;i++,y+=data.lheight) 
			this.dd.push({shape:"text",str:"",x:0,y:y,width:this.pcanvas.width})
		this.j2c.draw(this.dd)
		this.el.setAttribute("material","src",this.pcanvas)
	},
	update:function() {
		const data = this.data
		this.j2c.clear(this.clearColor)
		for(let i=0;i<data.lines;i++) 
		if(data.text[i]!==undefined) this.dd[i].str = data.text[i]
			this.j2c.draw(this.dd)

		let material = this.el.getObject3D('mesh').material
		if (!material.map) return
		material.map.needsUpdate = true
	}
})
}
})()