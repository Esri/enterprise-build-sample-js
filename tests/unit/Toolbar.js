define(function (require) {
    var registerSuite = require('intern!object');
    var assert = require('intern/chai!assert');
    var Toolbar = require('buildProject/Toolbar');
    var ArcGISTiledMapServiceLayer = require('esri/layers/ArcGISTiledMapServiceLayer');
    ArcGISTiledMapServiceLayer.prototype.hide = function(){this.calledHide = true;};

    var map = {
        graphics: {clear:function() {graphicsCleared = true;}},
        infoWindow: {hide:function() {hiddenInfoWindow = true;}},
        addLayer: function(layer){lastLayerAdded =  layer}
    }, graphicsCleared, hiddenInfoWindow,lastLayerAdded, toolbar;

    registerSuite({
      name: 'components: Toolbar',
      setup: function(){

      },
      beforeEach: function() {

        graphicsCleared = false;
        hiddenInfoWindow = false;

        toolbar = new Toolbar({"id":"toolbar","map":map,"config":{transportationUrl:"streetmap"}});

      },
      afterEach: function(){
        toolbar.destroy();
      },
      teardown: function() {

      },
     'Toolbar clears graphics and info window': function() {

        toolbar.clearGraphics();


        assert.isTrue(graphicsCleared, "graphics cleared");
        assert.isTrue(hiddenInfoWindow, "infowindow cleared");
      },
      'Toolbar toggles street map': function(){

            assert.isFalse(toolbar.viewingStreets,"Streets are not viewed by default");

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

            assert.isTrue(toolbar.streetMapLayer,"Street Map Created");
            assert.strictEqual(showStreetMapCounter,1,"First Click Shows Street Map");

            toolbar.toggleStreetMap();

            assert.strictEqual(hideStreetMapCounter,1,"Second Click Hides Street Map");

            toolbar.toggleStreetMap();
            assert.strictEqual(showStreetMapCounter,2,"Third Click Shows Street Map");
      }, 'Created Street Map Layer': function(){
        toolbar._createStreetMapLayer();

        assert.isTrue(toolbar.streetMapLayer instanceof ArcGISTiledMapServiceLayer,"New Tiled Layer Created");
        assert.strictEqual(toolbar.streetMapLayer.url,"streetmap","New Tile Layer uses the Street Map config value");
        assert.strictEqual(lastLayerAdded,toolbar.streetMapLayer,"Added streetmap to map");
        assert.isTrue(toolbar.streetMapLayer.calledHide,"Hid Streetmap");
      }
    });
});
