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
			'cameraMode' : 'FreeRotateAroundCenter',
			'disableZoom' : false,
			'fieldOfView' : 45.0,
			'nearClippingPlane' : 0.1,
			'farClippingPlane' : 1000.0,
			'lightAmbientColor' : [0.5, 0.5, 0.5],
			'lightDiffuseColor' :[1.0, 1.0, 1.0],
			'fixLightDirection' : null,
		};
	
		if (settings != undefined) {
			if (settings['cameraEyePosition'] !== undefined) this.settings['cameraEyePosition'] = settings['cameraEyePosition'];
			if (settings['cameraCenterPosition'] !== undefined) this.settings['cameraCenterPosition'] = settings['cameraCenterPosition'];
			if (settings['cameraUpVector'] !== undefined) this.settings['cameraUpVector'] = settings['cameraUpVector'];
			if (settings['cameraMode'] !== undefined) this.settings['cameraMode'] = settings['cameraMode'];
			if (settings['disableZoom'] !== undefined) this.settings['disableZoom'] = settings['disableZoom'];
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
		this.cameraMove.SetMode (this.settings['cameraMode']);
		this.cameraMove.SetZoomEnabled (!this.settings['disableZoom']);
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
	
	GetMesh : function (index)
	{
		var currentIndex = 0;
		var i, current;
		for (i = 0; i < this.scene.__objects.length; i++) {
			current = this.scene.__objects[i];
			if (current instanceof THREE.Mesh) {
				if (currentIndex == index) {
					return current;
				}
				currentIndex++;
			}
		}
		alert ('not found');
		return new THREE.Mesh ();
	},
	
	RemoveMeshes : function ()
	{
		var i, current;
		for (i = 0; i < this.scene.__objects.length; i++) {
			current = this.scene.__objects[i];
			if (current instanceof THREE.Mesh) {
				this.scene.remove (current);
				i--;
			}
		}
		this.Draw ();
    },

	RemoveLastMesh : function ()
	{
		var i, current;
		for (i = this.scene.__objects.length; i >= 0; i--) {
			current = this.scene.__objects[i];
			if (current instanceof THREE.Mesh) {
				this.scene.remove (current);
				this.Draw ();
				return;
			}
		}
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
		var projector = new THREE.Projector ();
		var mouseX = (this.mouse.currX / this.canvas.width) * 2 - 1;
		var mouseY = -(this.mouse.currY / this.canvas.height) * 2 + 1;
		
		var cameraPosition = this.camera.position;
		var vector = new THREE.Vector3 (mouseX, mouseY, 0.5);
		projector.unprojectVector (vector, this.camera);

		var ray = new THREE.Ray (cameraPosition, vector.subSelf (cameraPosition).normalize ());
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
		this.camera.position = this.cameraMove.eye;
		this.camera.up = this.cameraMove.up;
		this.camera.lookAt (this.cameraMove.center);
		if (this.settings['fixLightDirection'] === null) {
			this.directionalLight.position = new THREE.Vector3 ().sub (this.cameraMove.eye, this.cameraMove.center);
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
