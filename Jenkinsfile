#!groovy

node {
	stage('checkout') {
		checkout scm
	}
	
	stage('prebuild') {
		docker.image('digitallyseamless/nodejs-bower-grunt').inside {
			bat 'npm install'
			
			bat 'bower install'
		}
	}
}