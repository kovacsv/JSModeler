JSM.Viewer = function ()
{
	this.canvas = null;
	
	this.scene = null;
	this.camera = null;
	this.renderer = null;
	this.ambientLight = null;
	this.directionalLight = null;

	this.cameraMove = null;
	this.mouse = null;
	this.touch = null;
	
	this.settings = null;
};

JSM.Viewer.prototype =
{
	Start : function (canvasName, settings)
	{
		if (!this.IsWebGLEnabled ()) {
			return false;
		}
	
		if (!this.InitSettings (settings)) {
			return false;
		}
		
		if (!this.InitThree (canvasName)) {
			return false;
		}
	
		if (!this.InitCamera ()) {
			return false;
		}

		if (!this.InitLights ()) {
			return false;
		}
		
		if (!this.InitEvents ()) {
			return false;
		}

		this.Draw ();
		return true;
	},

	IsWebGLEnabled : function ()
	{
		if (!window.WebGLRenderingContext) {
			return false;
		}

		if (!document.createElement ('canvas').getContext ('experimental-webgl')) {
			return false;
		}

		return true;
	},
	
	InitSettings : function (settings)
	{
		this.settings = {
			'cameraEyePosition' : [1.0, 1.0, 1.0],
			'cameraCenterPosition' : [0.0, 0.0, 0.0],
			'cameraUpVector' : [0.0, 0.0, 1.0],
			'cameraFixUp' : true,
			'cameraDisableOrbit' : false,
			'cameraDisableZoom' : false,
			'fieldOfView' : 45.0,
			'nearClippingPlane' : 0.1,
			'farClippingPlane' : 1000.0,
			'lightAmbientColor' : [0.5, 0.5, 0.5],
			'lightDiffuseColor' :[0.5, 0.5, 0.5],
			'fixLightDirection' : null
		};
	
		if (settings != undefined) {
			if (settings['cameraEyePosition'] !== undefined) this.settings['cameraEyePosition'] = settings['cameraEyePosition'];
			if (settings['cameraCenterPosition'] !== undefined) this.settings['cameraCenterPosition'] = settings['cameraCenterPosition'];
			if (settings['cameraUpVector'] !== undefined) this.settings['cameraUpVector'] = settings['cameraUpVector'];
			if (settings['cameraFixUp'] !== undefined) this.settings['cameraFixUp'] = settings['cameraFixUp'];
			if (settings['cameraDisableOrbit'] !== undefined) this.settings['cameraDisableOrbit'] = settings['cameraDisableOrbit'];
			if (settings['cameraDisableZoom'] !== undefined) this.settings['cameraDisableZoom'] = settings['cameraDisableZoom'];
			if (settings['fieldOfView'] !== undefined) this.settings['fieldOfView'] = settings['fieldOfView'];
			if (settings['nearClippingPlane'] !== undefined) this.settings['nearClippingPlane'] = settings['nearClippingPlane'];
			if (settings['farClippingPlane'] !== undefined) this.settings['farClippingPlane'] = settings['farClippingPlane'];
			if (settings['lightAmbientColor'] !== undefined) this.settings['lightAmbientColor'] = settings['lightAmbientColor'];
			if (settings['lightDiffuseColor'] !== undefined) this.settings['lightDiffuseColor'] = settings['lightDiffuseColor'];
			if (settings['fixLightDirection'] !== undefined) this.settings['fixLightDirection'] = settings['fixLightDirection'];
		}

		return true;
	},

	InitThree : function (canvasName)
	{
		this.canvas = document.getElementById (canvasName);
        if (!this.canvas || !this.canvas.getContext) {
			return false;
		}

		this.scene = new THREE.Scene();
		if (!this.scene) {
			return false;
		}

		var parameters = {
			canvas : this.canvas,
			antialias : true
		};
        this.renderer = new THREE.WebGLRenderer (parameters);
        if (!this.renderer) {
			return false;
		}
        
        this.renderer.setSize (this.canvas.width, this.canvas.height);
		return true;
	},

	InitCamera : function (canvasName)
	{
		this.mouse = new JSM.Mouse ();
		if (!this.mouse) {
			return false;
		}
	
		this.touch = new JSM.Touch ();
		if (!this.touch) {
			return false;
		}

		this.cameraMove = new JSM.Camera (this.settings['cameraEyePosition'], this.settings['cameraCenterPosition'], this.settings['cameraUpVector']);
		this.cameraMove.SetFixUp (this.settings['cameraFixUp']);
		this.cameraMove.SetOrbitEnabled (!this.settings['cameraDisableOrbit']);
		this.cameraMove.SetZoomEnabled (!this.settings['cameraDisableZoom']);
		if (!this.cameraMove) {
			return false;
		}
		
        this.camera = new THREE.PerspectiveCamera (this.settings['fieldOfView'], this.canvas.width / this.canvas.height, this.settings['nearClippingPlane'], this.settings['farClippingPlane']);
        if (!this.camera) {
			return false;
		}
        
        this.scene.add (this.camera);
		return true;
	},

	InitLights : function ()
	{
		var ambientColor = new THREE.Color ();
		var diffuseColor = new THREE.Color ();
		ambientColor.setRGB (this.settings['lightAmbientColor'][0], this.settings['lightAmbientColor'][1], this.settings['lightAmbientColor'][2]);
		diffuseColor.setRGB (this.settings['lightDiffuseColor'][0], this.settings['lightDiffuseColor'][1], this.settings['lightDiffuseColor'][2]);
	
        this.ambientLight = new THREE.AmbientLight (ambientColor.getHex ());
        if (!this.ambientLight) {
			return false;
		}

		this.scene.add (this.ambientLight);
		
		this.directionalLight = new THREE.DirectionalLight (diffuseColor.getHex ());
		if (!this.directionalLight) {
			return false;
		}
		
		if (this.settings['fixLightDirection'] !== null) {
			this.directionalLight.position.set (this.settings['fixLightDirection'][0], this.settings['fixLightDirection'][1], this.settings['fixLightDirection'][2]).normalize ();
		} else {
			this.directionalLight.position.set (0.0, 0.0, 1.0).normalize ();
		}
		this.scene.add (this.directionalLight);
		return true;
	},
	
	InitEvents : function ()
	{
		var myThis = this;
		
		if (document.addEventListener) {
			document.addEventListener ('mousemove', function (event) {myThis.OnMouseMove (event);});
			document.addEventListener ('mouseup', function (event) {myThis.OnMouseUp (event);});
		}

		if (this.canvas.addEventListener) {
			this.canvas.addEventListener ('mousedown', function (event) {myThis.OnMouseDown (event);}, false);
			this.canvas.addEventListener ('DOMMouseScroll', function (event) {myThis.OnMouseWheel (event);}, false);
			this.canvas.addEventListener ('mousewheel', function (event) {myThis.OnMouseWheel (event);}, false);
			this.canvas.addEventListener ('touchstart', function (event) {myThis.OnTouchStart (event);}, false);
			this.canvas.addEventListener ('touchmove', function (event) {myThis.OnTouchMove (event);}, false);
			this.canvas.addEventListener ('touchend', function (event) {myThis.OnTouchEnd (event);}, false);
		}
		
		return true;
	},

	AddMesh : function (mesh)
	{
        this.scene.add (mesh);
        this.Draw ();
	},
	
	AddMeshes : function (meshes)
	{
		var i;
		for (i = 0; i < meshes.length; i++) {
			this.scene.add (meshes[i]);
		}
        this.Draw ();
	},

	MeshCount : function ()
	{
		var count = 0;
		
		var current;
		this.scene.traverse (function (current) {
			if (current instanceof THREE.Mesh) {
				count = count + 1;
			}
		});
		
		return count;
	},
	
	VertexCount : function ()
	{
		var count = 0;
		
		var current;
		this.scene.traverse (function (current) {
			if (current instanceof THREE.Mesh) {
				count = count + current.geometry.vertices.length;
			}
		});
		
		return count;	
	},
	
	FaceCount : function ()
	{
		var count = 0;
		
		var current;
		this.scene.traverse (function (current) {
			if (current instanceof THREE.Mesh) {
				count = count + current.geometry.faces.length;
			}
		});
		
		return count;	
	},
	
	GetMesh : function (index)
	{
		var current = null;
		var currIndex = 0;
		
		var i;
		for (i = 0; i < this.scene.children.length; i++) {
			current = this.scene.children[i];
			if (current instanceof THREE.Mesh) {
				if (currIndex == index) {
					return current;
				}
				currIndex = currIndex + 1;
			}
		}
		
		return null;
	},

	RemoveMesh : function (mesh)
	{
		this.scene.remove (mesh);
		this.Draw ();
    },
	
	RemoveMeshes : function ()
	{
		var current;
		var i;
		for (i = 0; i < this.scene.children.length; i++) {
			current = this.scene.children[i];
			if (current instanceof THREE.Mesh) {
				this.scene.remove (current);
				i--;
			}
		}
		
		this.Draw ();
    },

	RemoveLastMesh : function ()
	{
		var found = null;
		
		var current;
		this.scene.traverse (function (current) {
			if (current instanceof THREE.Mesh) {
				found = current;
			}
		});
		
		if (found != null) {
			this.scene.remove (found);
		}
		
		this.Draw ();
    },

	Resize : function ()
	{
		this.camera.aspect = this.canvas.width / this.canvas.height;
		this.camera.updateProjectionMatrix (); 
		this.renderer.setSize (this.canvas.width, this.canvas.height);
		this.Draw ();
	}, 	
	
	FitInWindow : function ()
	{
		var center = this.GetCenter ();
		var radius = this.GetBoundingSphereRadius ();
		this.FitInWindowWithCenterAndRadius (center, radius);
	},

	FitInWindowWithCenterAndRadius : function (center, radius)
	{
		var offsetToOrigo = JSM.CoordSub (this.cameraMove.center, center);
		this.cameraMove.origo = center;
		this.cameraMove.center = center;
		this.cameraMove.eye = JSM.CoordSub (this.cameraMove.eye, offsetToOrigo);
		
		var centerEyeDirection = JSM.VectorNormalize (JSM.CoordSub (this.cameraMove.eye, this.cameraMove.center));
		var fieldOfView = this.settings['fieldOfView'] / 2.0;
		if (this.canvas.width < this.canvas.height) {
			fieldOfView = fieldOfView * this.canvas.width / this.canvas.height;
		}
		var distance = radius / Math.sin (fieldOfView * JSM.DegRad);
		
		this.cameraMove.eye = JSM.CoordOffset (this.cameraMove.center, centerEyeDirection, distance);
		this.Draw ();
	},

	GetCenter : function ()
	{
		var boundingBox = this.GetBoundingBox ();
		var center = JSM.MidCoord (boundingBox[0], boundingBox[1]);
		return center;
	},

	GetBoundingBox : function ()
	{
		var min = new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf);
		var max = new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf);
		
		var current, geometry, coord;
		this.scene.traverse (function (current) {
			if (current instanceof THREE.Mesh) {
				geometry = current.geometry;
				var j;
				for (j = 0; j < geometry.vertices.length; j++) {
					coord = geometry.vertices[j].clone ();
					coord.add (current.position);
					min.x = JSM.Minimum (min.x, coord.x);
					min.y = JSM.Minimum (min.y, coord.y);
					min.z = JSM.Minimum (min.z, coord.z);
					max.x = JSM.Maximum (max.x, coord.x);
					max.y = JSM.Maximum (max.y, coord.y);
					max.z = JSM.Maximum (max.z, coord.z);
				}
			}
		});

		return [min, max];
	},

	GetBoundingSphereRadius : function ()
	{
		var center = this.GetCenter ();
		var radius = 0.0;
		
		var current, geometry, coord, distance;
		this.scene.traverse (function (current) {
			if (current instanceof THREE.Mesh) {
				geometry = current.geometry;
				var j;
				for (j = 0; j < geometry.vertices.length; j++) {
					coord = geometry.vertices[j].clone ();
					coord.add (current.position);
					distance = JSM.CoordDistance (center, new JSM.Coord (coord.x, coord.y, coord.z));
					if (JSM.IsGreater (distance, radius)) {
						radius = distance;
					}
				}
			}
		});

		return radius;
	},
	
	GetObjectsUnderMouse : function ()
	{
		var mouseX = (this.mouse.currX / this.canvas.width) * 2 - 1;
		var mouseY = -(this.mouse.currY / this.canvas.height) * 2 + 1;
		
		var projector = new THREE.Projector ();
		var cameraPosition = this.camera.position;
		var vector = new THREE.Vector3 (mouseX, mouseY, 0.5);
		projector.unprojectVector (vector, this.camera);
		vector.sub (cameraPosition);
		vector.normalize ();

		var ray = new THREE.Raycaster (cameraPosition, vector);
		return ray.intersectObjects (this.scene.children);
	},
	
	GetFaceUnderMouse : function ()
	{
		var intersects = this.GetObjectsUnderMouse ();
		var face = null;
		if (intersects.length > 0) {
			face = intersects[0].face;
		}
		return face;
	},

	GetFaceIndexUnderMouse : function ()
	{
		var intersects = this.GetObjectsUnderMouse ();
		var faceIndex = -1;
		if (intersects.length > 0) {
			faceIndex = intersects[0].faceIndex;
		}
		return faceIndex;
	},
	
	GetPointUnderMouse : function ()
	{
		var intersects = this.GetObjectsUnderMouse ();
		var point = null;
		if (intersects.length > 0) {
			point = intersects[0].point;
		}
		return point;
	},

	Draw : function ()
	{
		this.camera.position = new THREE.Vector3 (this.cameraMove.eye.x, this.cameraMove.eye.y, this.cameraMove.eye.z);
		this.camera.up = new THREE.Vector3 (this.cameraMove.up.x, this.cameraMove.up.y, this.cameraMove.up.z);
		this.camera.lookAt (new THREE.Vector3 (this.cameraMove.center.x, this.cameraMove.center.y, this.cameraMove.center.z));
		if (this.settings['fixLightDirection'] === null) {
			this.directionalLight.position = new THREE.Vector3 ().subVectors (this.cameraMove.eye, this.cameraMove.center);
		}
		this.renderer.render (this.scene, this.camera);
		return true;
	},

	OnMouseDown : function (event)
	{
		this.mouse.Down (event, this.canvas);
	},

	OnMouseMove : function (event)
	{
		this.mouse.Move (event, this.canvas);
		if (!this.mouse.down) {
			return;
		}
		
		if (this.settings['cameraDisableOrbit']) {
			return;
		}
		
		var ratio = -0.5;
		this.cameraMove.Orbit (this.mouse.diffX * ratio, this.mouse.diffY * ratio);
		
		this.Draw ();
	},
	
	OnMouseUp : function (event)
	{
		this.mouse.Up (event, this.canvas);
	},
	
	OnMouseOut : function (event)
	{
		this.mouse.Out (event, this.canvas);
	},

	OnMouseWheel : function (event)
	{
		var eventParameters = event;
		if (eventParameters === null) {
			eventParameters = window.event;
		}
		
		if (this.settings['cameraDisableZoom']) {
			return;
		}
		
		var delta = 0;
		if (eventParameters.detail) {
			delta = -eventParameters.detail;
		} else if (eventParameters.wheelDelta) {
			delta = eventParameters.wheelDelta / 40;
		}
	
		var zoomIn = delta > 0;
		this.cameraMove.Zoom (zoomIn);
		this.Draw ();
	},
	
	OnTouchStart : function (event)
	{
		this.touch.Start (event, this.canvas);
	},

	OnTouchMove : function (event)
	{
		this.touch.Move (event, this.canvas);
		if (!this.touch.down) {
			return;
		}
		
		var ratio = -0.5;
		this.cameraMove.Orbit (this.touch.diffX * ratio, this.touch.diffY * ratio);
		
		this.Draw ();
	},

	OnTouchEnd : function (event)
	{
		this.touch.End (event, this.canvas);
	}
};
