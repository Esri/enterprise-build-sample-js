
var profile = (function () { 
	return {
		selectorEngine : "acme",
		basePath : "../../",
		releaseDir : "../release",
		releaseName : "buildProjectRelease",
		layers : {
			'dojo/dojo': {
            include: [
                'dojo/i18n', // this prevents a bunch of extra requests trying to get localization
                'buildProject/SiteManager',
                'esri/dijit/Attribution',
                'dojox/gfx/path',
                'dojox/gfx/svg',
                'dojox/gfx/shape'
            ],
            includeLocales: ['en-us'],
            customBase: true, // don't include all of the globals in dojo/main
            boot: true // include AMD loader
        }
		},
		packages: [
		{
			"name" : "buildProject",
			"location" : "../buildProject"
		},
		{
			"name" : "dojo",
			"location" : "../dojo"
		},
		{
			"name" : "dijit",
			"location" : "../dijit"
		},
		{
			"name" : "dojox",
			"location" : "../dojox"
		},
		{
			"name" : "esri",
			"location" : "../esri"
		}
		]
	}
})();