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
        location: 'http://js.arcgis.com/4.3/dgrid'
      }, {
        name: 'dijit',
        location: 'http://js.arcgis.com/4.3/dijit'
      }, {
        name: 'esri',
        location: 'http://js.arcgis.com/4.3/esri'
      }, {
        name: 'dojo',
        location: 'http://js.arcgis.com/4.3/dojo'
      }, {
        name: 'dojox',
        location: 'http://js.arcgis.com/4.3/dojox'
      }, {
        name: 'moment',
        location: 'http://js.arcgis.com/4.3/moment'
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