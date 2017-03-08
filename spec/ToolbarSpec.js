define([
  'buildProject/Toolbar',
  'esri/layers/TileLayer'
], function(
  Toolbar,
  TileLayer
) {

  describe('components: Toolbar ', function() {
    var view = {
        graphics: {removeAll:function() {graphicsCleared = true;}}
    },
	map = {
		add: function(layer){lastLayerAdded =  layer}
	},

	graphicsCleared, hiddenInfoWindow, lastLayerAdded, viewSetArg, viewSetVal, toolbar;

    // create the map
    beforeEach(function() {

		graphicsCleared = false;
        hiddenInfoWindow = false;
		popupSetArg = '';
		popupSetVal = '';
		
		Toolbar.prototype._getViewPopup = function(){
			return {
				set: function(arg,val){
					popupSetArg = arg;
					popupSetVal = val;
				}
			}
		};
        toolbar = new Toolbar({"id":"toolbar","map":map,"view":view,"config":{transportationUrl:"streetmap"}});

    });

    // destroy the map
    afterEach(function() {
      toolbar.destroy();
    });

	it('clears graphics and info window', function(done){
		toolbar.clearGraphics();
		
		expect(graphicsCleared).toBe(true);
		expect(popupSetArg).toEqual('visible');
		expect(popupSetVal).toBe(false);
		
	});
	
	it('toggles street map', function(done){
		expect(toolbar.viewingStreets).toBe(false);
		
		var hideStreetMapCounter = 0;
		var showStreetMapCounter = 0;

		
		spyOn(toolbar,"_createStreetMapLayer");
		spyOn(toolbar,"_hideStreetMapLayer");
		spyOn(toolbar,"_showStreetMapLayer");
		
		toolbar.toggleStreetMap();
			
		expect(toolbar._createStreetMapLayer).toHaveBeenCalled();
		expect(toolbar._showStreetMapLayer).toHaveBeenCalled();
		
		toolbar.toggleStreetMap();
		
		expect(toolbar._hideStreetMapLayer).toHaveBeenCalled();
		
		toolbar.toggleStreetMap();
		expect(toolbar._showStreetMapLayer).toHaveBeenCalled();
		
	});
	
	it('created Street Map Layer', function(done){
		toolbar._createStreetMapLayer();
		
		expect(toolbar.streetMapLayer instanceof TileLayer).toBe(true);
		expect(toolbar.streetMapLayer.url).toEqual('streetmap');
		expect(lastLayerAdded).toEqual(toolbar.streetMapLayer);		
	});

  });
});