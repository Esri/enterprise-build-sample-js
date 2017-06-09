#!groovy

node {
	stage('checkout') {
		checkout scm
	}
	stage('build') {
		bat 'npm install'
		bat 'bower install'
		bat 'grunt build zip -verbose'
	}
	stage('deploy') {
		unstash 'app'
		bat 'grunt deploy'
	}
}