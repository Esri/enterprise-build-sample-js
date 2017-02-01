#!groovy

node {
	stage('checkout') {
		checkout scm
	}
	
	stage('prebuild') {
		bat 'npm install -g grunt-cli'

		bat 'npm install -g bower'
		
		bat 'npm install'
		
		bat 'bower install'
	}
}