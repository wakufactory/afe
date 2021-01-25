var warn = AFRAME.utils.debug('components:vrm-model:warn');
/**
 * vrm model loader.
 */
AFRAME.registerComponent('vrm-model', {
  schema: {
	  src:{type: 'model'},

		b_hips_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_spine_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_chest_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_neck_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_head_rot:{type:"vec3",default:{x:0,y:0,z:0}},

		b_leftEye_rot:{type:"vec3",default:{x:0,y:0,z:0}},	
		b_leftShoulder_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftUpperArm_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftLowerArm_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftHand_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftUpperLeg_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftLowerLeg_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftFoot_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftToes_rot:{type:"vec3",default:{x:0,y:0,z:0}},

		b_leftThumbProximal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftThumbIntermediate_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftThumbDistal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftIndexProximal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftIndexIntermediate_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftIndexDistal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftMiddleProximal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftMiddleIntermediate_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftMiddleDistal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftRingProximal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftRingIntermediate_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftRingDistal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftLittleProximal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftLittleIntermediate_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_leftLittleDistal_rot:{type:"vec3",default:{x:0,y:0,z:0}},

		b_rightEye_rot:{type:"vec3",default:{x:0,y:0,z:0}},	
		b_rightShoulder_rot:{type:"vec3",default:{x:0,y:0,z:0}},		
		b_rightUpperArm_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightLowerArm_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightHand_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightUpperLeg_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightLowerLeg_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightFoot_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightToes_rot:{type:"vec3",default:{x:0,y:0,z:0}},

		b_rightThumbProximal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightThumbIntermediate_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightThumbDistal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightIndexProximal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightIndexIntermediate_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightIndexDistal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightMiddleProximal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightMiddleIntermediate_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightMiddleDistal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightRingProximal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightRingIntermediate_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightRingDistal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightLittleProximal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightLittleIntermediate_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		b_rightLittleDistal_rot:{type:"vec3",default:{x:0,y:0,z:0}},
		
		m_A:{default:0},
		m_I:{default:0},
		m_U:{default:0},
		m_E:{default:0},
		m_O:{default:0},
		m_Blink:{default:0},
		m_Blink_L:{default:0},
		m_Blink_R:{default:0},
		m_LookUp:{default:0},
		m_LookDown:{default:0},
		m_LookLeft:{default:0},
		m_LookRight:{default:0},
		m_Neutral:{default:0},
		m_Fun:{default:0},
		m_Joy:{default:0},
		m_Angry:{default:0},
		m_Sorrow:{default:0},
		m_LookDown:{default:0},		
		m_LookUp:{default:0},		
		m_LookLeft:{default:0},		
		m_LookRight:{default:0}	
	},
  init: function () {
//    var dracoLoader = this.system.getDRACOLoader();
    this.model = null;
    
//    if (dracoLoader) {
//      this.loader.setDRACOLoader(dracoLoader);
//    }
    console.log("regist vrm-model")
  },

  update: function (odata,force=false) {
    var self = this;
    var el = this.el;
 //   console.log(this.data)
    var src = this.data.src 
this.loader = new THREE.GLTFLoader();
    if (src &&　odata.src!=src ) {
	    this.remove();
	    console.log("load "+src)
	    this.loader.load(src, (gltfModel)=> {
		    console.log("loaded gltf")
		    THREE.VRM.from( gltfModel ).then( ( vrm ) => {
			    console.log("loaded vrm")
			    console.log(vrm)
					this.model = vrm.scene || vrm.scenes[0];
					this.model.animations = vrm.animations;
					this.model.vrm = vrm 
					el.setObject3D('mesh', this.model);

			  	this.bones = vrm.humanoid.humanBones 
			  	this.morph = vrm.blendShapeProxy
			  	this.setBones(vrm.humanoid.restPose)
			  	this.update(this.data,true)
					el.emit('model-loaded', {format: 'vrm', model: this.model});

			  })
	    }, undefined /* onProgress */,(error)=> {
	      var message = (error && error.message) ? error.message : 'Failed to load glTF model';
	      console.log("error "+message)
	      warn(message);
	      el.emit('model-error', {format: 'vrm', src: src});
	    });
    }
		function v3eq(a,b) {return a.x==b.x && a.y==b.y && a.z==b.z}
		const RAD = Math.PI/180
		if(!this.bones) return 
		let mf = false 
		for(let k in this.data) {
			const p = k.split("_") 
//			console.log(p)
			if(p[0]=="b" && p[2]=="rot") {	//bone rotation
				if(!force && v3eq(odata[k],this.data[k])) continue
				if(!this.bones[p[1]]||!this.bones[p[1]][0]) continue ;
//				console.log(this.data[k])
//console.log(p)
				this.bones[p[1]][0].node.rotation.x = this.data[k].x*RAD
				this.bones[p[1]][0].node.rotation.y = this.data[k].y*RAD
				this.bones[p[1]][0].node.rotation.z = this.data[k].z*RAD
			}
			if(p[0]=="m") {	//morph
				if(!force && odata[k]==this.data[k]) continue
//				console.log("set morph "+p[1])
				let kk = p.slice(1).join("_")
				this.morph.setValue(kk,this.data[k])
				mf = true 
			}
		}
		if(mf) this.morph.update()
  },
	setBones:function(data) {
		for(let k in data) {
			if(!this.bones[k]) continue
			const rot = data[k].rotation 
			const pos = data[k].position
			if(rot) this.bones[k][0].node.rotation = rot 
			if(pos) this.bones[k][0].node.position = pos 
		}
	},
  remove: function () {
    if (!this.model) { return; }
    this.el.removeObject3D('mesh');
  }
});
