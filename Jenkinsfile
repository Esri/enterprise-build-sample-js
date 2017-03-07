#!groovy

node {
	stage('checkout') {
		checkout scm
	}
	
	stage('prebuild') {
		sh 'npm install'
		sh 'bower install'
	}
	
	stage('build') {
		sh 'grunt build'
	}
}