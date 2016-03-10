(function(window) {
  'use strict';

  var allTestFiles = [];
  var TEST_REGEXP = /.*Spec\.js$/;

  for (var file in window.__karma__.files) {
    if (TEST_REGEXP.test(file)) {
      allTestFiles.push(file);
    }
  }

  window.dojoConfig = {
    packages: [
      // local pacakges to test
      {
          name:"buildProject",
          location:"../../../web/js/buildProject"
      },

      // esri/dojo packages
      {
        name: 'dgrid',
        location: 'http://js.arcgis.com/3.16/dgrid'
      }, {
        name: 'dijit',
        location: 'http://js.arcgis.com/3.16/dijit'
      }, {
        name: 'esri',
        location: 'http://js.arcgis.com/3.16/esri'
      }, {
        name: 'dojo',
        location: 'http://js.arcgis.com/3.16/dojo'
      }, {
        name: 'dojox',
        location: 'http://js.arcgis.com/3.16/dojox'
      }, {
        name: 'put-selector',
        location: 'http://js.arcgis.com/3.16/put-selector'
      }, {
        name: 'util',
        location: 'http://js.arcgis.com/3.16/util'
      }, {
        name: 'xstyle',
        location: 'http://js.arcgis.com/3.16/xstyle'
      }
    ],
    async: true
  };


  /**
   * This function must be defined and is called back by the dojo adapter
   * @returns {string} a list of dojo spec/test modules to register with your testing framework
   */
  window.__karma__.dojoStart = function() {
    return allTestFiles;
  };
})(window);