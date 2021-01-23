//draw canvas from json data
//				2018 wakufactory 
//
// shapes box,roundbox,text,textbox,img 
// property str,src ,rect,x,y,width,height 
// styles radius,color,border,background,lineWidth,font,lineHeight,align,offsetx,offsety
//
export {json2canvas}
class json2canvas {

constructor(can) {
	this.canvas = can 
	this.data = null 
	this.width = can.width
	this.height = can.height 
	this.ctx = can.getContext("2d");
	this.bx = 0
	this.by = 0 
	this.default = {
		font:"20px sans-serif",
		borderColor:"black",
		textColor:"black",
//		backgroundColor:"white"
	}
	this.class = {}
	this.km = /[。、\.\-,)\]｝、〕〉》」』】〙〗〟’”｠»ゝゞーァィゥェォッャュョヮヵヶぁぃぅぇぉっゃゅょゎゕゖㇰㇱㇲㇳㇴㇵㇶㇷㇸㇹㇷ゚ㇺㇻㇼㇽㇾㇿ々〻‐゠–〜～?!‼⁇⁈⁉・:;\/]/
	this.tm = /[(\[｛〔〈《「『【〘〖〝‘“｟«]/
	this.am = /[a-zA-Z—―]/
}

clear(clearColor) {
	this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
	if(clearColor) {
		this.ctx.fillStyle = clearColor
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
	}
}
_ax(v) {
	return v + this.bx
}
_ay(v) {
	return v + this.by 
}
_aw(v) {
	return v 
}
_ah(v) {
	return v  
}

async draw(data){
	this.data = data 
	this.ctx.font = this.default.font 
	for(let i=0;i<data.length;i++) {
		const d = data[i]
		if(d.classdef) {
			this.class[d.classdef] = d.style ;
			continue ;
		}
		let style = {lineWidth:1,boder:this.default.borderColor}
		if(d.class) {
			for(let s in this.class[d.class]) {
				style[s] = this.class[d.class][s]	
			}
		}
		if(d.style) {
			for(let s in d.style) {
				style[s] = d.style[s]	
			}
		}
		let x = 0 ; let y = 0 ;
		let w=10; let h = 10 ;
		if(d.rect) style.rect = d.rect 
		if(d.x!=undefined) style.x = d.x 
		if(d.y!=undefined) style.y = d.y
		if(d.width!=undefined) style.width = d.width
		if(d.height!=undefined) style.height = d.height 
		if(style.rect) {
			x = style.rect[0] ;y=style.rect[1];w=style.rect[2];h=style.rect[3]
		} 
		if(style.x!=undefined) x = style.x 
		if(style.y!=undefined) y = style.y 
		if(style.width!=undefined) w = style.width
		if(style.height!=undefined) h = style.height
		
		this.ctx.save()
		switch(d.shape) {
			case "box":
				if(style.lineWidth) this.ctx.lineWidth = style.lineWidth
				if(style.background) {
					this.ctx.fillStyle = style.background 
					this.ctx.fillRect(this._ax(x),this._ay(y),this._aw(w),this._ah(h))
				}
				if(style.border) {
					this.ctx.strokeStyle = style.border
					this.ctx.strokeRect(this._ax(x),this._ay(y),this._aw(w),this._ah(h))
				}
				break ;
			case "roundbox":
				const radius = (style.radius)?style.radius:20 
				this.ctx.beginPath()
				this.ctx.moveTo(this._ax(x+radius),this._ay(y))
				this.ctx.lineTo(this._ax(x+w-radius),this._ay(y))
				this.ctx.arcTo(this._ax(x+w),this._ay(y),this._ax(x+w),this._ay(y+radius),radius)
				this.ctx.lineTo(this._ax(x+w),this._ay(y+h-radius))
				this.ctx.arcTo(this._ax(x+w),this._ay(y)+h,this._ax(x+w-radius),this._ay(y+h),radius)
				this.ctx.lineTo(this._ax(x+radius),this._ay(y+h))
				this.ctx.arcTo(this._ax(x),this._ay(y+h),this._ax(x),this._ay(y+h-radius),radius)
				this.ctx.lineTo(this._ax(x),this._ay(y+radius))
				this.ctx.arcTo(this._ax(x),this._ay(y),this._ax(x+radius),this._ay(y),radius)
				if(style.lineWidth) this.ctx.lineWidth = style.lineWidth
				if(style.background) {
					this.ctx.fillStyle = style.background 
					this.ctx.fill()
				}
				if(style.border) {
					this.ctx.strokeStyle = style.border
					this.ctx.stroke()
				}
				break ;
			case "line":
				
				break ;
			case "text":
				if(style.color) this.ctx.fillStyle = style.color ;else this.ctx.fillStyle = this.default.textColor
				if(style.font) this.ctx.font = style.font 
				if(style.align) this.ctx.textAlign = style.align ; else this.ctx.textAlign  = "left"
				if(style.width) {
					if(style.align=="right") x += w
					if(style.align=="center") x += w/2 
				} else w = undefined
				this.ctx.fillText(d.str,this._ax(x),this._ay(y),w)
				break ;
			case "textbox":
				let l 
				if(d.str) {
					l = this.boxscan(d,style)
					data[i].lines = l
				} else if(d.lines) {
					l = d.lines 
				}
				let lh = (style.lineHeight!=undefined)?style.lineHeight:20
				if(style.color) this.ctx.fillStyle = style.color ;else this.ctx.fillStyle = this.default.textColor
				if(style.font) this.ctx.font = style.font 
				if(style.align) this.ctx.textAlign = style.align ; else this.ctx.textAlign  = "left"
				if(style.align=="right") x += w
				if(style.align=="center") x += w/2 
				const ox = ((style.offsetx!=undefined)?style.offsetx:0)
				const oy = ((style.offsety!=undefined)?style.offsety:0)
				let lx =  - ox
				let ly =  lh - oy
				this.ctx.rect(this._ax(x),this._ay(y),w,h)
				this.ctx.clip() 
				for(let i=0;i<l.length;i++) {
					if(ly>0)
						this.ctx.fillText(l[i],this._ax(lx+x),this._ay(ly+y),w)
					if(ly>h+lh) break ;
					ly += lh 
				}
				break
			case "img":
				let img = await json2canvas.loadImageAjax(d.src)
				if(style.width!=undefined && style.height==undefined) {
					w = style.width ; h = style.width * img.height / img.width
				} else 
				if(style.width==undefined && style.height!=undefined) {
					h = style.height ; w = style.height * img.width / img.height
				} else
				if(style.width!=undefined && style.height!=undefined) {
					w = style.width ; h = style.height 
				} else {w=img.width;h=img.height}
				this.ctx.drawImage(img,x,y,w,h)
				break ;
		}
		if(d.children) {
			const bbx = this.bx ; const bby = this.by 
			this.bx = x ; this.by = y 
			this.draw(d.children)
			this.bx = bbx ;this.by = bby 
		}
		this.ctx.restore()
	}
}

getElementById(id,data) {
	if(!data) data = this.data 	
	for(let i=0;i<data.length;i++) {
		if(data[i].id == id) {
			return data[i] ;
		}
		if(data[i].children) {
			var c =  this.getElementById(id,data[i].children) ;
			if(c) return c ;
		}
	}
	return null
}
boxscan(d,style) {
	class unistr {
		constructor(str) {
			this._str = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
		}
		get length() { return this._str.length }
		get char() { return this._str }
		substr(i,n) {
			return this._str.slice(i,(n==undefined)?undefined:i+n).join("")
		}
	}
	let x = d.rect[0] ;let y=d.rect[1];let w=d.rect[2];let h=d.rect[3]
	let str = new unistr(d.str)
	this.ctx.save()
	if(style.font) this.ctx.font = style.font 
	let si =0 
	let lines = [] 

	for(let i =1 ;i<str.length;i++) {
		if(str.char[i] == "\n") {
			lines.push(str.substr(si,i-si))
			i++
			si = i 						
		} else 
		if(this.ctx.measureText(str.substr(si,i-si+1)).width > w) {
			let ii = i 
			while(i>ii-4 && str.char[i-1].match(this.tm)) i--	//行末禁則追い出し
			while(i<ii+4 && str.char[i].match(this.km)) i++		//行頭禁則追い込み

			while(str.char[i-1].match(this.am) && str.char[i].match(this.am)) { //分離禁止追い出し
				i-- 
				if(i==si) {
					i=ii ; break ; 
				}
			}
			lines.push(str.substr(si,i-si))
			si = i				
		}
	}
	if(si<str.length) {
		lines.push(str.substr(si))
	}
	this.ctx.restore()
	return lines
}

static async loadImageAjax(src) {
	return new Promise((resolve,reject)=>{
		json2canvas.loadAjax(src,{type:"blob"}).then((b)=>{
			const timg = new Image ;
			const url = URL.createObjectURL(b);
			timg.onload = ()=> {
				URL.revokeObjectURL(url)
				resolve(timg) ;
			}
			timg.src = url
		}).catch((err)=>{
			resolve(null) ;
		})
	})
}
static loadAjax(src,opt) {
	return new Promise((resolve,reject)=> {
		const req = new XMLHttpRequest();
		req.open("get",src,true) ;
		req.responseType = (opt && opt.type)?opt.type:"text" ;
		req.onload = ()=> {
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

static loadFont(name,path) {
	return new Promise((resolve,reject)=>{
		if(!document.fonts) {
			resolve(null)
			return 
		}
		let f = new FontFace(name,`url(${path})`,{})
		if(!f) {
			resolve(null)
			return 
		}
		f.load().then((font)=>{
			document.fonts.add(font)
			resolve(font) 
		}).catch((err)=> {
			reject(err) 
		})
	})
}
}  //class json2canvas