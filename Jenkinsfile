#!groovy

node {
	stage('checkout') {
		checkout scm
	}
	stage('build') {
		bat 'npm install'
		bat 'bower install'
		bat 'grunt build -verbose'
	}
}