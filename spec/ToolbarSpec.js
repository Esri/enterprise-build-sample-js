define([
  'buildProject/Toolbar',
  'esri/layers/TileLayer'
], function(
  Toolbar,
  TileLayer
) {

  describe('components: Toolbar ', function() {
	var testArgs = {
		"view": {
			get:function(){},
		  watch:function(){}
		},
		"config": {},
		"map": {}
	};

    // create the map
    beforeEach(function() {
        toolbar = new Toolbar(testArgs);
    });

    // destroy the map
    afterEach(function() {
      toolbar.destroy();
    });

	it('clears graphics and info window', function(){
		
		toolbar.view.graphics = jasmine.createSpyObj('toolbar.view.graphics',["removeAll"]);
		spyOn(toolbar,"hidePopup");

		toolbar.clearGraphics();
		
		expect(toolbar.view.graphics.removeAll).toHaveBeenCalled();
		expect(toolbar.hidePopup).toHaveBeenCalled();
		
	});
	
	it('toggles street map', function(){
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
	
  it('enables assets button', function(){
		// 1. Toolbar should be disabled for zoom levels < 6


		// 2. Toolbar should be enabled for zoom levels >= 6


		//expect(toolbar.toggleAssetsButton.get("disabled")).toBeTruthy();
	});

	it('created Street Map Layer', function(){
		
		toolbar.map = jasmine.createSpyObj('toolbar.map',['add']);
		toolbar._createStreetMapLayer();
		
		expect(toolbar.streetMapLayer instanceof TileLayer).toBe(true);
		expect(toolbar.map.add).toHaveBeenCalled();
	});

  });
});