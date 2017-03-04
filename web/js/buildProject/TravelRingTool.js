/*global define, dojo,dijit,esri,buildProject,site*/
define([
        "dojo/_base/Color",
        "dojo/_base/declare",
        "dojo/_base/kernel",
        "dojo/_base/lang",
        "dojo/on",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/tasks/Geoprocessor",
        "esri/toolbars/draw",
        //	Our Project's classes ---------------------------------------------
        "buildProject/TravelRingDialog"
], function (
		Color,
		declare,
		kernel,
		lang,
		on,
		SimpleMarkerSymbol,
		SimpleLineSymbol,
		Geoprocessor,
		Draw,
		TravelRingDialog) {
	return declare(null, {
		driveTimesTask: null,
		isActive: false,
		drawToolbar: null,
		pointSymbol: null,
	    map: null,
	    config: null,
	    constructor: function(/*Object*/options){
			//	summary:
			//		Adds option fields to the object and creates the draw toolbar and gptask.
			//	options:	Object
			//		Json object to be mixed in with this class.
			
			lang.mixin(this,options);
			
			this.driveTimesTask = new Geoprocessor(this.config.driveTimesUrl);
			console.debug("test1");
			this.driveTimesTask.outSpatialReference = this.map.spatialReference;
			this.drawToolbar = new Draw(this.map);
			this.drawToolbar.setMarkerSymbol(this.pointSymbol);  
			
			this.drawToolbar.on("draw-end", lang.hitch(this,this.run));

			this.pointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 16,
						            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
						                    new Color([89,95,35]), 2),
						                    new Color([130,159,83,0.40]));
		},
		activate: function(){
			//	summary:
			//		Enables the tool by activated the draw toolbar.
			
			if (!this.isActive){
				this.isActive = true;
				if (this.toolbar.viewingAssets){
					this.toolbar.disableAssetConnect();
				} else {
					kernel.global.site.disableIdentifyConnect();
				}
				this.drawToolbar.activate(Draw.POINT);
			}
		},
		run: function(/*esri.geometry.Point*/geometry){
			//	summary:
			//		Opens the TravelRingToolDialog.  This is called once the draw toolbar receives a drawing end event.
			//	geometry:	esri.geometry.Point
			//		Point selected by the draw toolbar.  Travel ring will be drawn around this point
			
			if (!this.dialog){
				this.dialog = new TravelRingDialog({"map":this.map,"config":this.config,"driveTimesTask":this.driveTimesTask});
			}
			this.dialog.show(geometry);
			
			
		},
		deactivate: function(){
			//	summary:
			//		Deactivates the tool by disabling the draw toolbar and re-enabling the click to identify functionality.
			
			if (this.isActive){
				this.isActive = false;
				if (this.toolbar.viewingAssets){
					this.toolbar.enableAssetConnect();
				} else {
					kernel.global.site.enableIdentifyConnect();
				}
				this.drawToolbar.deactivate();
			}
		}
	});
});