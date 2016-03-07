/*global define, require, dojo,dijit,esri,buildProject*/
define([
        "dojo/_base/declare",
        "dojo/_base/kernel",
        "dojo/_base/lang",
        "dojo/_base/xhr",
        "dojo/dom",
        "dojo/on",
        "dojo/parser",
        "esri/map",
        "esri/geometry/Extent",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/tasks/IdentifyParameters",
        "esri/tasks/IdentifyTask",
        // Our Project's classes ---------------------------------------------
        "buildProject/buildProject",
        "buildProject/InfoGrid",
        "buildProject/Toolbar"
], function (
		declare,
		kernel,
		lang,
		xhr,
		dom,
		on,
		parser,
		Map,
		Extent,
		ArcGISDynamicMapServiceLayer,
		ArcGISTiledMapServiceLayer,
		IdentifyParameters,
		IdentifyTask,
		buildProject,
		InfoGrid,
		Toolbar) {
	return declare (null, {
		//	summary:
		//		Loader class.  Initializes the site and several essential widgets.
		//	toolbar: String | buildProject.Toolbar
		//		Initially the id of a DOM Node to create the toolbar in.
		//	infoGrid:	buildProject.InfoGrid
		//		Chart to be displayed inside info window on identify
		//	map:	esri.Map
		//		The application's map object
		//	identifyTask:	esri.tasks.IdentifyTask
		//		Task used to identify entities, districts, and zip codes.
		//	identifyParams:	esri.tasks.IdentifyParameters
		//		Parameters used by the Identify Task object
		//	config:	Object
		//		Configuration object loaded from data/config.json
		//	identifyConnect:	dojo.connect
		//		Keeps track of the on click behavior for entities, districts, and zip codes.
		
		toolbar: "toolbarNode",
		infoGrid: null,
		map: null,
		identifyTask: null,
		identifyParams: null,
		config: null,
		identifyConnect: null,
		init: function(){
			//	summary:
			//		Loades the flat config file and initializes several widgets.
			
			parser.parse();
			
			xhr.get({
				"url": require.toUrl("data/config.json"),
				"handleAs":"json",
				"load": lang.hitch(this,function(config){
					this.config = config;
					
					this.setupMap();
								
					this.setupToolbar();
									
					this.setupInfoGrid();
				}),
				"error": buildProject.displayError
			});
		},
		setupMap: function(){
			//	summary:
			//		Sets up the map starting pararmeters and loads all standard layers onto the map.
			
			var initExtent = new Extent({
				"xmin":-8585309.048629632,
				"ymin":4702297.046680435,
				"xmax":-8560849.19957841,
				"ymax":4714259.441607048,
				"spatialReference":{"wkid":102100}
			 });

			var lods = this.config.mapLods;
			this.map = new Map("map",{extent:initExtent,lods:lods,showInfoWindowOnClick:false,logo:false});
			//resize the map when the browser resizes - view the 'Resizing and repositioning the map' section in 
			//the following help topic for more details http://help.esri.com/EN/webapi/javascript/arcgis/help/jshelp_start.htm#jshelp/inside_guidelines.htm
			var resizeTimer;
			this.map.on('load', lang.hitch(this, function(theMap) {
				on(kernel.global, "onresize", lang.hitch(this, function(){  //resize the map if the div is resized
					clearTimeout(resizeTimer);
					resizeTimer = setTimeout( lang.hitch(this,function(){ 
						this.map.resize();
						this.map.reposition();
					}), 250);
				}));
			}));
			
			//	If baseMapUrl is configured, this loads a background map to be used in the application
			if (this.config.baseMapUrl){
				var basemap = new ArcGISTiledMapServiceLayer(this.config.baseMapUrl);
				on(basemap,"error",buildProject.displayError);
				this.map.addLayer(basemap);
			}
			
			//	Counties, states, city names
			var boundariesLayer = new ArcGISTiledMapServiceLayer(this.config.boundariesUrl,
				{"displayLevels":[4,5,9,10],
				"id":"boundariesLayer",
				"opacity":0.5}
			);
			on(boundariesLayer,"error",buildProject.displayError);
			this.map.addLayer(boundariesLayer);
			
			
			//	Entities/districts/zip codes
			var entityDistrictLayer = new ArcGISDynamicMapServiceLayer(this.config.entityDistrictUrl,{"id":"entityDistrictLayer"});
			entityDistrictLayer.setVisibleLayers([1]);
			on(entityDistrictLayer,"error",buildProject.displayError);
			this.map.addLayer(entityDistrictLayer);
			
			// Connect zoom and resize handlers.
			this.map.on("zoom-end",lang.hitch(this,this._onZoom)); 
		},
		setupToolbar: function(){
			//	summary:
			//		Initializes the toolbar widget.
			
			this.toolbar = dom.byId(this.toolbar);
			if (this.toolbar){
				this.toolbar = new Toolbar({"id":"toolbar","map":this.map,"config":this.config},this.toolbar);
			}
		},
		setupInfoGrid: function(){
			//	summary:
			//		Initializes the InfoGrid widget and sets up the Identify Task.
			
			this.identifyTask = new IdentifyTask(this.config.entityDistrictUrl);
			this.identifyParams = new IdentifyParameters();
			
			this.identifyParams.tolerance = 1;
	        this.identifyParams.returnGeometry = true;
	        
			this.infoGrid = new InfoGrid({"id":"infoGrid","map":this.map,"config":this.config});
			this.enableIdentifyConnect();
		},
		disableIdentifyConnect: function(){
			//	summary:
			//		Disables the click to identify behavior for Entities, Districts, and Zip Codes.
			//	description:
			//		Disables the click to identify behavior for Entities, Districts, and Zip Codes.
			//		This is used by the travel ring tool, and asset connections to allow us to enable
			//		other map click actions.
			
			this.identifyConnect.remove();
		},
		enableIdentifyConnect: function(){
			//	summary:
			//		Enables the click to identify behavior for Entities, Districts, and Zip Codes.
			//	description:
			//		Enables the click to identify behavior for Entities, Districts, and Zip Codes.
			//		This is used by the travel ring tool, and asset connections to allow us to restore
			//		default functionality when they are done with the map.
			
			this.identifyConnect = on(this.map,"click",lang.hitch(this,this.identify));
		},
		identify: function(evt){
			//	summary:
			//		Runs an identify task on the given point.
			//	description:
			//		Runs an identify task on the given point.This is run by the identify 
			//		connect handler whenever a user clicks on the map.
			//	evt:	Event
			//		Mouse click event.
			
			this.identifyParams.geometry = evt.mapPoint;
			this.identifyParams.mapExtent = this.map.extent;
			
			// This is used to determine which map layer we are running the identify on
			// and is based on the zoom level of the map.
			//	0: Entities
			//  1: Districts
			//  2: Zip Codes
			
			var level = this.map.getLevel();
			if (level < 2){
				this.identifyParams.layerIds = [0];
			} else if (level >= 2 && level < 5){
				this.identifyParams.layerIds = [1];
			} else if (level >= 7){
				this.identifyParams.layerIds = [2];
			} else {
				return;
			}
			
			this.identifyTask.execute(this.identifyParams,lang.partial(dojo.hitch(this.infoGrid,this.infoGrid.populate),evt.screenPoint),buildProject.displayError);
		},
		_onZoom: function(/*esri.geometry.Extent*/extent, /*int*/zoomFactor, /*esri.geometry.Point*/anchor, /*int*/level){
			//	summary:
			//		Called everytime the maps zoom level is changed.
			//	description:
			//		Called everytime the maps zoom level is changed.
			//		Adjusts the visibility of the boundaries layer and handles the asset layer button.
			//	extent:	esri.geoemtry.Extent
			//		The map's final extent after zooming
			//	zoomFactor:	float
			//		The amount as a percentage that the map zoomed in or out from the previous extent.
			//	anchor:	esri.geometry.Point
			//		The location of the mouse pointer.
			//	level:	int
			//		Zoom level after zooming.
			
			var boundaries = this.map.getLayer("boundariesLayer");
			
			if (level < 3){
				boundaries.setOpacity(0.5);
			} else {
				boundaries.setOpacity(1);
			}
			
			if (level > 8){
				this.toolbar.toggleAssetsButton.set("disabled",false);
			} else {
				if (this.toolbar.viewingAssets){
					this.toolbar.toggleAssetLayer();
				}
				this.toolbar.toggleAssetsButton.set("disabled",true);
			}
		}
	});
});