# enterprise-build-sample-js

This sample application shows how to run a dojo build on a 3.x ArcGIS API for JavaScript application to get it ready for production. The sample intends for bower to be used for dependency management to download the ArcGIS API for JavaScript, dojo, and other dependencies and grunt to run the dojo build (both of which depend on Node.js). This sample is using the 3.14 version of the ArcGIS API for JavaScript. Updated bower files for newer versions of the ArcGIS API for JavaScript can be found at [https://github.com/Esri/jsapi-resources](https://github.com/Esri/jsapi-resources).

![App](enterprise-build-sample-js.png?raw=true)

## Features
* Sample Enterprise Application - Formatted and developed to work with Automated Dojo Builds
* Sample Grunt File - Build file to be adapted to your own applications
* Build Profiles - Sample dojo build profile files to be adapted to your own applications
* Bower File - to download the Dojo, dgrid, put-selector, and xstyle source code, which has been patched to better work with the ArcGIS JavaScript API and the ArcGIS JavaScript API AMD Build. 

## Instructions

1. install [git](https://git-scm.com/)
2. install [Node.js](https://nodejs.org/)
3. Install global packages with [npm](https://www.npmjs.com)

	`npm install -g grunt-cli`

	`npm install -g bower`

4. Fork and then clone this repository.
5. Navigate to the folder project was cloned to.
6. Install local node packages into your project by running `npm install`
7. Install the JavaScript dependencies `bower install`, because of the .bowerrc file config these will install into the web/js folder.
8. Run the dojo build using grunt by running `grunt build`
9. When the build is complete the dist directory should be a production ready version of the application
	
## Requirements

* Notepad or your favorite HTML editor
* [Node.js](https://nodejs.org/)
* [Bower](https://bower.io)
* [Grunt](http://gruntjs.com/)
* Web browser with access to the Internet

## Resources

* [ArcGIS for JavaScript API Resource Center](https://developers.arcgis.com/javascript/3/)
* [Dojo Build Process Tutoiral](http://dojotoolkit.org/documentation/tutorials/1.10/build/)
* [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
* [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2015 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt](License.txt?raw=true) file.

[](Esri Tags: Enterprise, Build, JavaScript, Dojo)
[](Esri Language: JavaScript)​
