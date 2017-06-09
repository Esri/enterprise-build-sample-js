pipeline {
	agent {
		label: 'windows'
	}
	stages {
		stage('checkout') {
			steps {
				checkout scm
			}
		}
		stage('test') {
			steps {
				bat 'npm install'
				bat 'grunt test'
			}
			post {
				junit 'test-reports/**/*.xml'
			}
		}
		stage('build') {
			steps {
				bat 'npm install'
				bat 'bower install'
				bat 'grunt build zip'
			}
			post {
				stash includes: '*.war', name: 'app'
			}
		}
		stage('deploy') {
			steps {
				unstash 'app'
				bat 'grunt deploy'
			}
		}
	}
	post {
		failure {
			mail to: randy_jones@esri.com, subject: 'The Pipeline failed'
		}
	}
}