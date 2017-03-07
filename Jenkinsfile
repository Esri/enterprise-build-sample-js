#!groovy

node {
	stage('checkout') {
		checkout scm
	}
	
	stage('prebuild') {
		cmd 'npm install'
		cmd 'bower install'
	}
	
	stage('build') {
		cmd 'grunt build'
	}
}