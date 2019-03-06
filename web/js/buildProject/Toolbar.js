/*global define, dojo,dijit,esri,buildProject,site*/

define([
        "dojo/_base/declare",
        "dojo/_base/kernel",
        "dojo/_base/lang",
        "dojo/dom",
        "dojo/on",
        "dojo/dnd/Moveable",
        "esri/PopupTemplate",
        "esri/layers/MapImageLayer",
        "esri/layers/TileLayer",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/tasks/support/IdentifyParameters",
        "esri/tasks/IdentifyTask",
        // 	Our Project's classes ---------------------------------------------
        "./buildProject",
        "./TravelRingTool",
        //	Widget base classes -----------------------------------------------
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        //	Widget template ---------------------------------------------------
        "dojo/text!./templates/Toolbar.html",
        //	Widgets in template (do not need to be included in function () ----
        "dijit/form/Button"
], function (
		declare,
		kernel,
		lang,
		dom,
		on,
		Moveable,
		PopupTemplate,
		MapImageLayer,
		TileLayer,
		SimpleMarkerSymbol,
		IdentifyParameters,
		IdentifyTask,
		buildProject,
		TravelRingTool,
		_WidgetBase,
		_TemplatedMixin,
		_WidgetsInTemplateMixin,
		template) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		//	summary:
		//		Toolbar widget.  Also handles the activation of several tools.
		//	templateString:	String
		//		HTML template of the widget (imported using dojo/text)
		//	streetMapLayer:	esri.layers.TileLayer
		//		Transportation layer to be displayed on Toggle Streets
		//	viewingStreets:	boolean
		//		Flag to keep track of which layers should be on the map
		//	viewingAssets:	boolean
		//		Flag to keep track of which layers should be on the map
		//	travelRingTool:	buildProject.TravelRingTool
		//		Tool for adding a travel ring to the map.
		//	identifyTask:	esri.tasks.IdentifyTasks
		//		Identify task used for the assets layer.
		//	identifyParams:	esri.tasks.IdentifyParameters
		//		Parameters used for the assets layer identify task.
		//	assetConnect:	dojo.connect
		//		Keeps track of the onclick event for the assets layer.
		templateString : template,
		streetMapLayer: null,
		viewingStreets: false,
		viewingAssets: false,
		travelRingTool: null,
		identifyTask: null,
		identifyParams: null,
		assetConnect: null,
		postCreate: function(){
			//	summary:
			//		Runs after the widget is completely formed.
			//	description:
			//		Runs after the widget is completely formed.  Sets up the floating behavior.
			
			var moveable = new Moveable(this.domNode,{handle:this.header});
		},
		toggleStreetMap: function(){
			//	summary:
			//		Turns the street map on and off when the appropriate button is clicked.
			//		Also makes sure the zip code layer is hidden when the street map is not.
			
			
			this._createStreetMapLayer();
			
			if (this.viewingStreets){
				this._hideStreetMapLayer();
			} else {
				this._showStreetMapLayer();
			}
			
			this.viewingStreets = !this.viewingStreets;
		},
		_createStreetMapLayer: function(){
			if (!this.streetMapLayer){
				this.streetMapLayer = new TileLayer({
					"url": this.config.transportationUrl,
					"visible": false
				});
				
				this.map.add(this.streetMapLayer);
			}
		},
		_hideStreetMapLayer: function(){
			this.streetMapLayer.set("visible",false);
			this.toggleStreetsButton.set("label","Show Transportation");
		},
		_showStreetMapLayer: function(){
			this.streetMapLayer.set("visible",true);
			this.toggleStreetsButton.set("label","Hide Transportation");
		},
		toggleAssetLayer: function(){
			//	summary:
			//		Turns the asset layer on and off when the appropriate button is clicked.
			//	description:
			//		Turns the asset layer on and off when the appropriate button is clicked.
			//		There is a click to identify behavior associated with the assets layer.  This
			//		function also handles the toggling of that and ensures the right layer is being
			//		used for click to identify.
			
			if (!this.assetLayer){
				this.assetLayer = new MapImageLayer({
					"url": this.config.assetsUrl,
					"sublayers": [
						{
							id: 0,
							visible: true
						}
					]
				});

				this.map.add(this.assetLayer);
			}
			if (this.viewingAssets){
				
				if (this.view.get("zoom") < 6){
					this.toggleAssetsButton.set("disabled",true);
				}
				this.assetLayer.set("visible",false);
				this.toggleAssetsButton.set("label","Show Assets");
				this.disableAssetConnect();
				kernel.global.site.enableIdentifyConnect();
				
			} else {
				this.assetLayer.set("visible",true);
				this.toggleAssetsButton.set("label","Hide Assets");
				
				if (!this.identifyTask){
					this.identifyTask = new IdentifyTask(this.config.assetsUrl);
					
					this.identifyParams = new IdentifyParameters();
					
					this.identifyParams.tolerance = 2;
					this.identifyParams.layerIds = [0];
			        this.identifyParams.returnGeometry = true;
			        this.identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
				}
				this.enableAssetConnect();
				kernel.global.site.disableIdentifyConnect();
				
			}
			
			
			
			this.viewingAssets = !this.viewingAssets;
		},
		enableAssetConnect: function(){
			//	summary:
			//		Enables the identify connect behavior for asset layers.
			
			//	Make sure the sites identify connect is turned off.
			kernel.global.site.disableIdentifyConnect();
			
			this.assetConnect = this.map.on("click", lang.hitch(this,function(evt){
				this.identifyParams.geometry = evt.mapPoint;
				this.identifyParams.mapExtent = this.map.extent;
				
				// when the identify task is completed we create a poopup for the given asset.
				this.identifyTask.execute(this.identifyParams,lang.hitch(this,function(identifyResults){
					if (identifyResults.length === 0){
						buildProject.displayError("No assets found at click location");
					} else {
						var feature = identifyResults[0].feature;
						feature.set("symbol",new SimpleMarkerSymbol());
						feature.set("popupTemplate",new PopupTemplate({"title":"Asset","content":"${*}"}));
						
						this.view.graphics.add(feature);
						var screenPt = this.map.toScreen(feature.geometry);

						var popup = this.view.get("popup");
						popup.set("title","Asset");
						popup.set("content",feature.getContent());
						popup.show(screenPt,this.map.getInfoWindowAnchor(screenPt));
					}
				}),buildProject.displayError);
			}));

			
		},
		disableAssetConnect: function(){
			//	summary:
			//		Disables the identify connect behavior for asset layers.
			
			this.view.get("popup").set("visible",false);
			this.assetConnect.remove();
		},
		toggleTravelRingTool: function(){
			//	summary:
			//		Turns the travel ring tool on and off when the appropriate button is clicked.
			
			if (!this.travelRingTool){
				this.travelRingTool = new TravelRingTool({
					map:this.map,
					config:this.config,
					toolbar:this,
					"view": this.view});
			}
			if (this.travelRingTool.isActive){
				this.toggleTravelRingButton.containerNode.style.fontWeight = "";
				this.toggleTravelRingButton.domNode.firstChild.style.backgroundColor = "";
				this.travelRingTool.deactivate();
			} else {
				this.toggleTravelRingButton.containerNode.style.fontWeight = "bold";
				this.toggleTravelRingButton.domNode.firstChild.style.backgroundColor = "#AFD9FF";
				this.travelRingTool.activate();
			}
		},
		clearGraphics: function(){
			//	summary:
			//		Clears all graphics from the map.
			
			this.view.graphics.removeAll();
			this.hidePopup();
		},
		hidePopup: function(){
			this.view.get("popup").set("visible",false);
		}
	});
});