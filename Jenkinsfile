#!groovy

node {
	stage('checkout') {
		checkout scm
	}
	stage('test') {
		bat 'npm install'
		bat 'grunt test'
		step([$class: 'JUnitResultArchiver', testResults: 'test-reports/**/*.xml'])
	}
	stage('build') {
		bat 'npm install'
		bat 'bower install'
		bat 'grunt build zip'
		stash includes: '*.war', name: 'app'
	}
	stage('deploy') {
		unstash 'app'
		bat 'grunt deploy'
	}
}