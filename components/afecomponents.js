(function() {
// exit vr by B/Y button 
AFRAME.registerComponent('exitvr', {
	init:function() {
		this.el.addEventListener('bbuttonup',this.exitvr)
		this.el.addEventListener('ybuttonup',this.exitvr)			
	},
	exitvr:function() {
		AFRAME.scenes[0].exitVR()
	}
})
// set VR mode height
AFRAME.registerComponent('vrheight', {
	schema:{
		height:{type:"number",default:1.5}
	},
	init:function() {
		const scene = this.el.sceneEl
		const camrig = this.el 
		if(!camrig) return 
		scene.addEventListener("enter-vr", ev=>{
			const p = camrig.getAttribute("position")
			camrig.setAttribute("position", {x:p.x,y:0,z:p.z})
		})
		scene.addEventListener("exit-vr", ev=>{
			const p = camrig.getAttribute("position")
			camrig.setAttribute("position", {x:p.x,y:this.data.height,z:p.z})	
		})
	}
})
// oclusTouch mover
AFRAME.registerComponent('padmove', {
	schema:{
		gripud:{type:"boolean",default:false}
	},
	init:function() {
		const data = this.data
		let lastx = 0
		let grip = 0  
		this.el.addEventListener('thumbstickmoved',stick)
		this.el.addEventListener('trackpaddown',stick)
		
		function stick(ev){
//			console.log(ev)
			const stick = ev.detail
			const pm = document.querySelector("[padmoved]")?.components.padmoved 
			if(!pm) return 
			if(Math.abs(stick.x)>Math.abs(stick.y)) {
				if(Math.abs(stick.x)>0.6){
					if(lastx == 0) {
						lastx = 1
						pm.rotate(stick.x)
					}
				} else lastx = 0
			} else {
				if(data.gripud && grip) pm.ud(stick.y)
				else pm.move(stick.y)
			}	
		}
		this.el.addEventListener('gripchanged',(ev)=>{
			grip = ev.detail.pressed
		})
	}
})
// touch movee
AFRAME.registerComponent('padmoved', {
	schema: {
		movev:{default:2},
		dirlock:{default:true},
		fly:{default:false}
	},
	init:function() {
	  this.rot = {x:0,y:0,z:0}
		this.cdir = {x:0,y:0,z:0}
	  this.velocity = 0
	  this.mode = 0
	  this.camobj = AFRAME.scenes[0].camera.el.object3D
	  this.el.addEventListener('updown',(ev)=>{
		  this.ud(ev.detail.dir)
		})
	},
	rotate:function(dir) {
		this.rot.y += THREE.Math.degToRad( (dir>0)?-30:30 ) ;
		this.el.object3D.rotation.set(this.rot.x,this.rot.y,this.rot.z)
	},
	move:function(dir) {
		if(this.velocity==0 && Math.abs(dir)>0) {
			if(this.data.fly) this.cdir.y = Math.sin(-this.camobj.rotation.x)
			this.cdir.z = Math.cos(this.camobj.rotation.y+this.rot.y)
			this.cdir.x = Math.sin(this.camobj.rotation.y+this.rot.y)
		}
		this.velocity = this.data.movev * dir/1000
		this.mode = 0
	},
	ud:function(dir) {
		this.velocity = this.data.movev * -dir/1000
		this.mode = 1 
	},
	tick:function(time, timeDelta) {
		const vv = this.velocity *timeDelta
		if(!this.data.dirlock) {
			if(this.data.fly) this.cdir.y = Math.sin(-this.camobj.rotation.x)
			this.cdir.z = Math.cos(this.camobj.rotation.y+this.rot.y)
			this.cdir.x = Math.sin(this.camobj.rotation.y+this.rot.y)
		}
		const dx = this.mode==0?(this.cdir.x * vv):0
		const dz = this.mode==0?(this.cdir.z * vv):0
		const dy = this.mode==1?(vv*0.5):this.cdir.y * vv
		this.el.object3D.position.add({x:dx,y:dy,z:dz})		
	}
})// matrix transform
AFRAME.registerComponent('matrix4', {
	schema:{
		mat:{default:[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,0]}
	},
	init:function() {
		this.mat = new THREE.Matrix4()
	},
	update:function() {
		this.mat.set(...this.data.mat)
		this.el.object3D.applyMatrix4(this.mat)
	}
})
AFRAME.registerComponent('euler', {
  schema: {
	  angle:{type: 'vec3'},
	  order:{default: 'YXZ'}
	},
  update: function () {
    var data = this.data
    var object3D = this.el.object3D
    object3D.rotation.set(degToRad(data.angle.x), degToRad(data.angle.y), degToRad(data.angle.z))
    object3D.rotation.order = data.order
  },

  remove: function () {
    // Pretty much for mixins.
    this.el.object3D.rotation.set(0, 0, 0)
  }
})
})()