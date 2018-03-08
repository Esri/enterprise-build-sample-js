pipeline {
	agent { label 'windows' }
	stages {
		stage('test') {
			steps {
				bat 'npm install'
				bat 'grunt test -v'
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
				bat 'grunt build zip -v'
			}
			post {
				success {
					stash includes: '*.war', name: 'app'
				}
			}
		}
		stage('deploy QA') {
			steps {
				unstash 'app'
				bat 'grunt deploy'
			}
		}
		stage('deploy Prod') {
			steps {
			    milestone(3)
			    input message: 'Deploy?'
				unstash 'app'
				bat 'grunt deploy --port=8081'
				milestone(4)
			}
		}
	}
	post {
		failure {
			mail to: 'randy_jones@esri.com', subject: 'The Pipeline failed', body: 'The Pipeline failed'
		}
	}
}