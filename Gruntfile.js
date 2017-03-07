module.exports = function (grunt) {
  // Build customizations would be left up to developer to implement.
  grunt.loadNpmTasks('grunt-dojo');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );

  var port = grunt.option('port') || 8000;
  
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
			"!dist/js/dojo/resources/**/*",
			"!dist/**/images/**",
			"!dist/js/data/**",
			"!dist/js/**/*.gif",
			"!dist/js/**/*.png",
			/*"!dist/js/dojox",
			"!dist/js/dojox/gfx",
			"!dist/js/dojox/gfx/*.js"*/
		]
	  }
    },
	
    copy: {
      prebuild: {
      	files: [{
      		expand: true,
      		cwd: 'web',
      		src: ['**'],
      		dest: './dist/'
      	},
      	{
      		expand: true,
      		cwd: 'arcgis-js-api',
      		src: ['**'],
      		dest: './dist/js'
      	},
      	{
      		expand: true,
      		cwd: './node_modules',
      		src: ['dojo-themes/**'],
      		dest: './dist'
      	}]
      }
    },
	
	replace: {
		dist: {
			options: {
				patterns: [
					// replace the hosted jsapi with the dojo build layer file
					{ match: /\/\/js.arcgis.com\/4.3\/"/g, replacement: 'js/dojo/dojo.js"'},
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
          profile: '../../build/buildProject.profile.js'
        }
      },
      options: {
        dojo: './dojo/dojo.js',
        load: 'build',
		releaseDir: '.',
        cwd: './dist/js',
        basePath: '.'
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
	},
	jshint: {
		options: {
			curly: false,
			eqeqeq: true,
			immed: true,
			latedef: true,
			newcap: true,
			noarg: true,
			sub: true,
			undef: true,
			eqnull: true,
			browser: true,
			expr: true,
			globals: {
				head: false,
				module: false,
				console: false,
				unescape: false,
				define: false,
				exports: false
			}
		},
		files: [ 'Gruntfile.js', 'web/js/buildProject/**/*.js' ]
	},
	connect: {
	  	server: {
	  		options: {
	  			port: port,
	  			livereload: true,
	  			open: true,
	  			base: ['web','node_modules']
	  		}
	  	}
	  },
	  watch: {
		options: {
			livereload: true
		},
		js: {
			files: [ 'Gruntfile.js', 'web/js/buildProject/**/*.js' ],
			tasks: ['js']
		},
		html: {
			files: [ 'web/index.html']
		}
	}
  });

  // Serve dev app locally
  grunt.registerTask( 'serve', [ 'connect', 'watch' ] );

  grunt.registerTask('build', ['clean:build', 'copy:prebuild', 'dojo', 'replace', 'clean:nonLayer']);

  	// JS task
	grunt.registerTask( 'js', [ 'jshint'] );

};