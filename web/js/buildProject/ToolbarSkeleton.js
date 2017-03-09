/*global define*/
define([
        "dojo/_base/declare",
		"dojo/on",
		"dojo/_base/lang",
		], 
		function(declare, on, lang) {
			return {
				postCreate: function(){
					
					this.makeToolbarDraggable();
					
					on(this.toggleTransportationButton,"click",lang.hitch(this,this.toggleTransportation));
					
					on(this.toggleAssetsButton,"click",lang.hitch(this,this.toggleAssets));
					
					on(this.createTravelRingButton,"click",lang.htich(this,this.toggleTravelRingTool));
					
					on(this.clearGraphicsButton,"click",lang.hitch(this,this.clearGraphics));
				},
				makeToolbarDraggable: function(){
				},
				toggleTransportation: function(){
					if(this.isTransportationVisible()){
						this.hideTransportation();
					} else {
						this.showTransportation();
					}
				},
				isTransportationVisible: function(){
				},
				hideTransportation: function(){
				},
				showTransportation: function(){
				},
				toggleAssetsButton: function(){
					if (this.areAssetsVisible()){
						this.hideAssets();
					} else {
						this.showAssets();
					}
				},
				areAssetsVisible: function(){
				},
				hideAssets: function(){
				},
				showAssets: function(){
				},
				toggleTravelRingTool: function(){
					if (isTravelRingToolActive()){
						this.activateTravelRingTool();
					} else {
						this.deactivateTravelRingTool();
					}
				},
				isTravelRingToolActive: function(){
				},
				activateTravelRingTool: function(){
				},
				deactivateTravelRingTool: function(){
				},
				clearGraphics: function() {
				}
		};
	}
);