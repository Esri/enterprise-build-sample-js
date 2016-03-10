define({
    proxyPort: 9000,
    proxyUrl: 'http://localhost:9000/',
    capabilities: { 'selenium-version': '2.46.0' },
    webdriver: {
        host: 'localhost',
        port: 4444
    },
    environments: [{ browserName: 'chrome' }],
    maxConcurrency: 3,
    tunnel: 'NullTunnel',
    loader: {
        async: true,
        locale: 'en-us',
        packages: [
            {
                name: 'buildProject',
                location: './web/js/buildProject'
            },
            {
                name: 'dojo',
                location: './web/js/dojo'
            },
            {
            	name: 'dijit',
            	location: './web/js/dijit'
            },
            {
            	name: 'dojox',
            	location: './web/js/dojox'
            },
            {
            	name: 'esri',
            	location: './web/js/esri'
            }
        ]
    },
    suites: [
    	'tests/unit/Toolbar'
    ],
    //functionalSuites: ['tests/functional/index'],
    excludeInstrumentation: /^(?:tests|node_modules)\//
});