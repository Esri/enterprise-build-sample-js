pipeline {
	agent { label 'windows' }
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
				success {
					junit 'test-reports/**/*.xml'
				}
			}
		}
		stage('build') {
			steps {
				bat 'npm install'
				bat 'bower install'
				bat 'grunt build zip'
			}
			post {
				success {
					stash includes: '*.war', name: 'app'
				}
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
			mail to: 'randy_jones@esri.com', subject: 'The Pipeline failed', body: 'The Pipeline failed'
		}
	}
}