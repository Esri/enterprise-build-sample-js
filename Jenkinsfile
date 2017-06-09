#!groovy

node {
	stage('checkout') {
		checkout scm
	}
	stage('build') {
		bat 'npm install'
		bat 'grunt test -verbose'
	}
	stage('build') {
		bat 'npm install'
		bat 'bower install'
		bat 'grunt build zip -verbose'
		stash includes: '*.war', name: 'app'
	}
	stage('deploy') {
		unstash 'app'
		bat 'grunt deploy'
	}
}