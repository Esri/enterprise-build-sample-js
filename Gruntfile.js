/* eslint-disable */

module.exports = function (grunt) {
  // Build customizations would be left up to developer to implement.
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-tomcat-deploy');
  grunt.loadNpmTasks('grunt-zip');

  
  grunt.initConfig({
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
			reporters : ['junit', 'progress'],
			junitReporter: {
			  outputDir: 'test-reports', // results will be saved as $outputDir/$browserName.xml 
			  outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile 
			  suite: '', // suite will become the package name attribute in xml testsuite element 
			  useBrowserName: true // add browser name to report and classes names 
			}
		  }
	  }
	},
	eslint: {
		files: [ 'web/js/buildProject/**/*.js' ]
	},
	watch: {
		options: {
			livereload: true
		},
		js: {
			files: [ 'Gruntfile.js', 'web/js/buildProject/**/*.js' ],
			tasks: ['test']
		},
		html: {
			files: [ 'web/index.html']
		}
	},

    // Tomcat redeploy task still gets its config from tomcat_deploy
    // config item
    tomcat_deploy: {
      host: host,
      login: 'tomcat',
      password: 'tomcat',
      path: '/' + path,
      port: port,
      war:  'sample.war',
      deploy: '/manager/text/deploy',
      undeploy: '/manager/text/undeploy'
    },

    zip: {
    	war: {
		    cwd: 'dist',
		    dest: 'sample.war',
		    src: ['dist/**']
	    }
	}
  });

  // Serve dev app locally
	grunt.registerTask('serve', [ 'watch' ]);
	
  grunt.registerTask('deploy', ['tomcat_redeploy']);

  grunt.registerTask('test', ['eslint', 'karma']);

  // JS task
  grunt.registerTask('js', [ 'eslint']);

};