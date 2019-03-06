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
        //	Our Project's classes ---------------------------------------------
        "./TravelRingDialog"
], function (
		Color,
		declare,
		kernel,
		lang,
		on,
		SimpleMarkerSymbol,
		SimpleLineSymbol,
		Geoprocessor,
		TravelRingDialog) {
	return declare(null, {
		driveTimesTask: null,
		isActive: false,
		pointSymbol: null,
	    map: null,
	    config: null,
	    mapClickHandler: null,
	    constructor: function(/*Object*/options){
			//	summary:
			//		Adds option fields to the object and creates the draw toolbar and gptask.
			//	options:	Object
			//		Json object to be mixed in with this class.
			
			lang.mixin(this,options);
			
			this.driveTimesTask = new Geoprocessor(this.config.driveTimesUrl);
			console.debug("test1");
			this.driveTimesTask.outSpatialReference = this.map.spatialReference;
			this.mapClickHandler = on.pausable(this.view,"click",lang.hitch(this,this.run));
			this.mapClickHandler.pause();

			this.pointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 16,
						            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
						                    new Color([89,95,35]), 2),
						                    new Color([130,159,83,0.40]));
		},
		activate: function(){
			//	summary:
			//		Enables the tool by activated the draw toolbar.
			
			console.debug("ACTIVE");
			if (!this.isActive){
				this.isActive = true;
				if (this.toolbar.viewingAssets){
					this.toolbar.disableAssetConnect();
				} else {
					kernel.global.site.disableIdentifyConnect();
				}
				this.mapClickHandler.resume();
			}
		},
		run: function(evt){
			//	summary:
			//		Opens the TravelRingToolDialog.  This is called once the draw toolbar receives a drawing end event.			

			var geometry = evt.mapPoint;

			if (!this.dialog){
				this.dialog = new TravelRingDialog({
					"map":this.map,
					"config":this.config,
					"driveTimesTask":this.driveTimesTask,
					"view": this.view
				});
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
				this.mapClickHandler.pause();
			}
		}
	});
});