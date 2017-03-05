/*global define, require, dojo,dijit,esri,buildProject*/
define([
        "dojo/_base/declare",
        "dojo/_base/kernel",
        "dojo/_base/lang",
        "dojo/_base/xhr",
        "dojo/dom",
        "dojo/on",
        "dojo/parser",
        "esri/Map",
        "esri/views/MapView",
        "esri/geometry/Extent",
        "esri/layers/MapImageLayer",
        "esri/layers/TileLayer",
        "esri/tasks/support/IdentifyParameters",
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
		MapView,
		Extent,
		MapImageLayer,
		TileLayer,
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
		//	identifyParams:	esri.tasks.support.IdentifyParameters
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

			this.map = new Map({
				"basemap": "satellite"
			});

			console.debug(this.map);

			var lods = this.config.mapLods;
			this.view = new MapView({
				"container": "map",
				"map": this.map,
				"extent": initExtent,
				"lods": lods
			});
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
			
			//	Counties, states, city names
			this.boundariesLayer = new TileLayer({
				"url": this.config.boundariesUrl,
				"displayLevels":[4,5,9,10],
				"id":"boundariesLayer",
				"opacity":0.5
			});
			on(this.boundariesLayer,"error",buildProject.displayError);			
			
			//	Entities/districts/zip codes
			var entityDistrictLayer = new MapImageLayer({
				"url":this.config.entityDistrictUrl,
				"id":"entityDistrictLayer",
				"sublayers": [
					{
						"id": 1,
						"visible": true
					}
				]
			});

			on(entityDistrictLayer,"error",buildProject.displayError);

			this.map.addMany([
				this.boundariesLayer,
				entityDistrictLayer
			]);
			
			// Connect zoom and resize handlers.
			this.view.watch("zoom", lang.hitch(this,this._onZoom));
		},
		setupToolbar: function(){
			//	summary:
			//		Initializes the toolbar widget.
			
			this.toolbar = dom.byId(this.toolbar);
			if (this.toolbar){
				this.toolbar = new Toolbar({
					"id":"toolbar",
					"map":this.map,
					"view": this.view,
					"config":this.config
				},this.toolbar);
			}
		},
		setupInfoGrid: function(){
			//	summary:
			//		Initializes the InfoGrid widget and sets up the Identify Task.
			
			this.identifyTask = new IdentifyTask(this.config.entityDistrictUrl);
			this.identifyParams = new IdentifyParameters();
			
			this.identifyParams.tolerance = 1;
	        this.identifyParams.returnGeometry = true;
	        
			this.infoGrid = new InfoGrid({
				"id":"infoGrid",
				"map":this.map,
				"config":this.config,
				"view": this.view
			});

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
			
			this.identifyConnect = on(this.view,"click",lang.hitch(this,this.identify));
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
			this.identifyParams.mapExtent = this.view.get("extent");
			
			// This is used to determine which map layer we are running the identify on
			// and is based on the zoom level of the map.
			//	0: Entities
			//  1: Districts
			//  2: Zip Codes
			
			var level = this.view.get("zoom");
			if (level < 2){
				this.identifyParams.layerIds = [0];
			} else if (level >= 2 && level < 5){
				this.identifyParams.layerIds = [1];
			} else if (level >= 7){
				this.identifyParams.layerIds = [2];
			} else {
				return;
			}
			
			this.identifyTask.execute(this.identifyParams).then(
				lang.partial(dojo.hitch(this.infoGrid,this.infoGrid.populate),evt.mapPoint),
				buildProject.displayError
			);
		},
		_onZoom: function(/*int*/level){
			//	summary:
			//		Called everytime the maps zoom level is changed.
			//	description:
			//		Called everytime the maps zoom level is changed.
			//		Adjusts the visibility of the boundaries layer and handles the asset layer button.
			//	level:	int
			//		Zoom level after zooming.
			
			var boundaries = this.boundariesLayer;
			
			if (level < 3){
				boundaries.set("opacity",0.5);
			} else {
				boundaries.set("opacity",1);
			}
			
			if (level > 12){
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