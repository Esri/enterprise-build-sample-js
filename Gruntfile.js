module.exports = function (grunt) {
  // Build customizations would be left up to developer to implement.
  grunt.loadNpmTasks('grunt-dojo');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-karma');
  
  grunt.initConfig({
	  
    clean: {
      build: {
        src: ['dist/']
      },
      uncompressed: {
        src: [
          'dist/**/*.uncompressed.js'
        ]
      },
	  nonLayer: {
		src: [
			// Clean out the js folder, except for the layer file
			'dist/js/**/*',
			// Exceptions to make sure the layer file(s) stay,
			// but make the app as small as possible
			"!dist/js/dojo",
			"!dist/js/dojo/dojo.js",
			"!dist/js/dojo/nls/dojo_en-us.js",
			"!dist/js/dojo/resources",
			"!dist/**/images/**",
			"!dist/**/data/**",
			"!dist/js/**/*.gif",
			"!dist/js/**/*.png",
			/*"!dist/js/dojox",
			"!dist/js/dojox/gfx",
			"!dist/js/dojox/gfx/*.js"*/
		]
	  }
    },
	
    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'web/',
          src: ['**/*', '!js/**'],
          dest: './dist/'
        }]
      },
	  support: {
        files: [{
          expand: true,
          cwd: 'web/',
          src: ['js/data/**', 'js/images/**'],
          dest: './dist/'
        }]
      }
    },
	
	replace: {
		dist: {
			options: {
				patterns: [
					// replace the hosted jsapi with the dojo build layer file
					{ match: /\/\/js.arcgis.com\/3.16\/"/g, replacement: 'js/dojo/dojo.js"'},
					// remove the reference to your app package
					{ match: /\/\/ DELETE FROM HERE[\s\S]*\/\/ TO HERE/, replacement: ''},
					// clean up any debug flags to make the app ready for production
					{ match: /isDebug[\s]*:[\s]*true/, replacement: 'isDebug: false'}
				]
			},
			files: [{src:'web/index.html', dest:'dist/index.html'}]
		}
	},
	
    dojo: {
      dist: {
        options: {
          profile: 'build/buildProject.profile.js'
        }
      },
      options: {
        dojo: 'web/js/dojo/dojo.js',
        load: 'build',
		releaseDir: './dist/js',
        cwd: './',
        basePath: './'
      }
    },
	
	karma: {
	  options: {
        // get defaults from karma config
        configFile: 'karma.conf.js',
        // run all tests once then exit
        singleRun: true,
        // only show error messages
        logLevel: 'ERROR',
      },
	  unit: {
		  options:{
			singleRun: true,
			reporters : ['junit', 'coverage'],
			junitReporter: {
			  outputDir: 'test-reports', // results will be saved as $outputDir/$browserName.xml 
			  outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile 
			  suite: '', // suite will become the package name attribute in xml testsuite element 
			  useBrowserName: true // add browser name to report and classes names 
			}
		  }
	  }
	}
  });

  grunt.registerTask('build', ['clean:build', 'dojo', 'copy', 'replace', 'clean:nonLayer']);

};