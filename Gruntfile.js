module.exports = function (grunt) {
  // Build customizations would be left up to developer to implement.
  grunt.loadNpmTasks('grunt-dojo');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-replace');
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
					{ match: /\/\/js.arcgis.com\/3.15\/"/g, replacement: 'js/dojo/dojo.js"'},
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
    }
  });

  grunt.registerTask('build', ['clean:build', 'dojo', 'copy', 'replace', 'clean:nonLayer']);

};