define([
  'buildProject/Toolbar',
  'esri/layers/ArcGISTiledMapServiceLayer'
], function(
  Toolbar,
  ArcGISTiledMapServiceLayer
) {

  ArcGISTiledMapServiceLayer.prototype.hide = function(){this.calledHide = true;};

  describe('components: Toolbar ', function() {
    var map = {
        graphics: {clear:function() {graphicsCleared = true;}},
        infoWindow: {hide:function() {hiddenInfoWindow = true;}},
		addLayer: function(layer){lastLayerAdded =  layer}
    }, graphicsCleared, hiddenInfoWindow, lastLayerAdded, toolbar;

    // create the map
    beforeEach(function() {

		graphicsCleared = false;
        hiddenInfoWindow = false;

        toolbar = new Toolbar({"id":"toolbar","map":map,"config":{transportationUrl:"streetmap"}});

    });

    // destroy the map
    afterEach(function() {
      toolbar.destroy();
    });

	it('clears graphics and info window', function(done){
		toolbar.clearGraphics();
		
		expect(graphicsCleared).toBe(true);
		expect(hiddenInfoWindow).toBe(true);
		
	});
	
	it('toggles street map', function(done){
		expect(toolbar.viewingStreets).toBe(false);
		
		var hideStreetMapCounter = 0;
		var showStreetMapCounter = 0;

		toolbar._createStreetMapLayer = function(){
		  toolbar.streetMapLayer = true;
		};
		toolbar._hideStreetMapLayer = function(){
		  hideStreetMapCounter++;
		};
		toolbar._showStreetMapLayer = function(){
		  showStreetMapCounter++;
		};

		toolbar.toggleStreetMap();
			
		expect(toolbar.streetMapLayer).toBe(true);
		expect(showStreetMapCounter).toEqual(1);
		
		toolbar.toggleStreetMap();
		
		expect(hideStreetMapCounter).toEqual(1);
		
		toolbar.toggleStreetMap();
		expect(showStreetMapCounter).toEqual(2);
		
	});
	
	it('created Street Map Layer', function(done){
		toolbar._createStreetMapLayer();
		
		expect(toolbar.streetMapLayer instanceof ArcGISTiledMapServiceLayer).toBe(true);
		expect(toolbar.streetMapLayer.url).toEqual('streetmap');
		expect(lastLayerAdded).toEqual(toolbar.streetMapLayer);
		expect(toolbar.streetMapLayer.calledHide).toBe(true);
		
	});

  });
});