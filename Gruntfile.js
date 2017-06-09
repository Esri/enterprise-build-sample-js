module.exports = function (grunt) {
  // Build customizations would be left up to developer to implement.
  grunt.loadNpmTasks('grunt-dojo');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-tomcat-deploy');

  var port = grunt.option('port') || 8000;
  
  grunt.initConfig({
	  
    clean: {
      build: {
        src: ['dist/', 'build-temp/', 'build-src/js/buildProject/']
      },
      postbuild: ['build-temp/'],
      test: ['test-reports/, coverage/']
    },
	
    copy: {
      prebuild: {
      	files: [
      	// copy project packages from src to build-src
      	{
      		expand: true,
      		cwd: 'web/js/buildProject',
      		src: ['**'],
      		dest: './build-src/js/buildProject'
      	},
      	// copy project non-package artifacts direct to dist 
      	{
      		expand: true,
      		cwd: 'web',
      		src: ['*', 'js/data/**', 'js/images/**'],
      		dest: './dist/'
      	},
      	// copy project node dependecies to dist
      	{
      		expand: true,
      		cwd: './node_modules',
      		src: ['dojo-themes/**'],
      		dest: './dist'
      	}]
      },
      // copy all the layer files specified in the profile.js 
      // created by the dojo build to the dist dir
      postbuild: {
      	files: [{
      		expand: true,
      		cwd: 'build-temp/js',
      		src: ['dojo/dojo.js', 'esri/layers/VectorTileLayerImpl.js'],
      		dest: './dist/js'
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
		releaseDir: '../../build-temp/js',
        cwd: './build-src/js',
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
			captureTimeout:30000,
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
	},

    // Tomcat redeploy task still gets its config from tomcat_deploy
    // config item
    tomcat_deploy: {
      host: 'localhost',
      login: 'tomcat',
      password: 'tomcat',
      path: '/sample',
      port: 8080,
      war:  'sample.war',
      deploy: '/manager/text/deploy',
      undeploy: '/manager/text/undeploy'
    }
  });

    // Adding task registration for zip b/c the tomcat task does the horrible thing of overwriting
    // the zip config
    var zip = grunt.config('zip');
    zip.war = {
    cwd: 'dist',
    dest: 'sample.war',
    src: ['dist/**']
    };
    grunt.config('zip', zip);

  // Serve dev app locally
  grunt.registerTask('serve', [ 'connect', 'watch' ]);

  grunt.registerTask('build', ['clean:build', 'copy:prebuild', 'dojo', 'copy:postbuild', 'replace', 'clean:postbuild']);

  grunt.registerTask('deploy', ['tomcat_deploy']);

  grunt.registerTask('test', ['jshint', 'karma']);

  // JS task
  grunt.registerTask('js', [ 'jshint']);

};