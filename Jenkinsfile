#!groovy

node {
	stage('checkout') {
		checkout scm
	}
	
	stage('prebuild') {
		bat 'npm install'
		bat 'bower install'
	}
	
	stage('build') {
		bat 'grunt build'
	}
}