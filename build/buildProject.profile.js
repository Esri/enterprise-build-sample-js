
var profile = {
	basePath : ".",
	releaseDir: "../buildOutput",
	action: 'release',
	cssOptimize: 'comments',
	mini: true,
	optimize: 'closure',
	layerOptimize: 'closure',

	layers : {
		'dojo/dojo': {
			boot: true, // include AMD loader
			customBase: true, // don't include all of the globals in dojo/main
			include: [
				'dojo/i18n', // this prevents a bunch of extra requests trying to get localization
				'buildProject/SiteManager',
				'esri/dijit/Attribution',
				'dojox/gfx/path',
				'dojox/gfx/svg',
				'dojox/gfx/shape',
				'dojox/gfx/filters',
				'dojox/gfx/svgext',
				'dojo/_firebug/firebug',
				'esri/IdentityManager'
			],
			includeLocales: ['en-us']
		},
    	'esri/layers/VectorTileLayerImpl': {
    		include: [
        		"esri/layers/VectorTileLayerImpl"
    		],
      		includeLocales: ["en-us"]
    	}
	},
	packages: [
		{
			"name" : "buildProject",
			"location" : "js/buildProject"
		},
		{
			"name" : "dojo",
			"location" : "./dojo"
		},
		{
			"name" : "dijit",
			"location" : "./dijit"
		},
		{
			"name" : "dojox",
			"location" : "./dojox"
		},
		{
			"name" : "esri",
			"location" : "./esri"
		},
		{
			"name" : "dgrid",
			"location" : "./dgrid"
		},
		{
			"name" : "dgrid1",
			"location" : "./dgrid1"
		},
		{
			"name" : "dstore",
			"location" : "./dstore"
		},
		{
			"name" : "put-selector",
			"location" : "./put-selector"
		},
		{
			"name": "xstyle",
			"location" : "./xstyle"
		},
		// moment package is newly needed for 3.16
		{
		  name: 'moment',
		  location: './moment',
		  main: 'moment',
		  trees: [
			  // don't bother with .hidden, tests, min, src, and templates
			  [".", ".", /(\/\.)|(~$)|(test|txt|src|min|templates)/]
		  ]
		}
	],
	
	useSourceMaps: false,
	stripConsole: 'normal',
	selectorEngine: 'acme',
	
	staticHasFeatures: {
		// The trace & log APIs are used for debugging the loader, so we do not need them in the build.
		'dojo-trace-api': false,
		'dojo-log-api': false,

		// This causes normally private loader data to be exposed for debugging. In a release build, we do not need
		// that either.
		'dojo-publish-privates': false,

		// This application is pure AMD, so get rid of the legacy loader.
		'dojo-sync-loader': false,

		// `dojo-xhr-factory` relies on `dojo-sync-loader`, which we have removed.
		'dojo-xhr-factory': false,

		// We are not loading tests in production, so we can get rid of some test sniffing code.
		'dojo-test-sniff': false
	}
};