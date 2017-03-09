/*global define*/

define([
        "dojo/_base/Color",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "esri/Graphic",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/tasks/support/FeatureSet",
        //	Our Project's classes ---------------------------------------------
        "buildProject/buildProject",
        //	Widget base classes -----------------------------------------------
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        //	Widget template ---------------------------------------------------
        "dojo/text!./templates/_TravelRingDialog.html",
        //	Widgets in template (do not need to be included in function () ----
        "dijit/Dialog",
        "dijit/form/NumberSpinner",
        "dojox/form/BusyButton"
], function (
		Color,
		declare,
		lang,
		Graphic,
		SimpleFillSymbol,
		SimpleLineSymbol,
		SimpleMarkerSymbol,
		FeatureSet,
		buildProject,
		_WidgetBase,
		_TemplatedMixin,
		_WidgetsInTemplateMixin,
		template) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		//	summary:
		//		Internal dialog used by the Travel Ring Tool.
		//	description:
		//		This dialog handles all the major functionality of the Travel Ring
		//		and accepts user input.
		//	templateString:	String
		//		HTML template of the widget (imported using dojo/text)
		//	geometry:	esri.geometry.Point
		//		Point to draw the travel ring around.
		templateString : template,
		geometry: null,
		
		show: function(/*esri.geometry.Point*/geometry){
			//	summary:
			//		Opens the dialog.
			//	geometry:	esri.geometry.Point
			//		Point to draw the travel ring around.
			
			this.innerDialog.show();
			this.geometry = geometry;
			this.submitButton.cancel();
		},
		getRing: function(/*Event*/evt){
			//	summary:
			//		Once the user has submitted the form, this function creates the travel ring.
			//	evt:	Event
			//		Click event on the submit button.
			
			//	First use dijit to make sure the form is valid
			if (this.timeInput.isValid()){
				var featureSet = new FeatureSet();
				featureSet.geometryType = "point";
				featureSet.features = [new Graphic({
					"geometry":this.geometry,
					"symbol": new SimpleMarkerSymbol(),
					"attributes": {}
				})];
				
				var inputParams = {
						"Input_Location": featureSet,
						"Drive_Times": this.timeInput.get("value")
				};
				
				//	Submit the job and check on its results once the tool returns a completion message.
				this.driveTimesTask.execute(inputParams).then(lang.hitch(this,function(response){

						console.debug("FINISHED WITH EXECUTE");
						console.debug(response);
						// Add the input points and result polygons to the map.
						//	Note: This function loops through even though there will only be one polygon.
						//			This will make it easier to add multiple points or the option to enter
						//			multiple time values in the future.
						
						var results = response.results;
						try{
						var polygons = results[0];
						for (var i=0;i<featureSet.features.length;i++){
							this.view.graphics.add(featureSet.features[i]);
						}
						for (var j=0;j<polygons.value.features.length;j++){
							var fillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
						            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
									new Color([0,0,255,1]), 2),
									new Color([0,255,255,0.4]));
							polygons.value.features[j].set("symbol",fillSymbol);
							this.view.graphics.add(polygons.value.features[j]);
							
						}
						
						//	Hide the dialog and zoom in on the resulting features.
						this.submitButton.cancel();
						this.innerDialog.hide();
						this.view.set("extent",polygons.value.features[0].geometry.getExtent(),true);
					} catch(e){
						console.debug("ERROR",e);
					}
				}),buildProject.displayError);
			} else {
				buildProject.displayError("Please enter a valid time between 1 and 30 minutes.");
			}
		}
	});
});