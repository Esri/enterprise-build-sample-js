#!groovy

node {
	stage('checkout') {
		checkout scm
	}
	
	stage('prebuild') {
		npm install
		bower install
	}
	
	stage('build) {
		grunt build
	}
}