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
				bat 'npm run build'
				bat 'grunt zip:war'
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
				bat 'if exist c:\\Apache24\\htdocs\\sample-webpack RD /S /Q c:\\Apache24\\htdocs\\sample-webpack'
				bat 'xcopy /E /I dist c:\\Apache24\\htdocs\\sample-webpack'
			}
		}
		stage('release') {
			steps {
				// This could stash the release to an Object Store like S3 or to a github release
				// or could just create a tag in git to later recheck out the project
				bat "xcopy /E /I dist c:\\archive\\${env.JOB_NAME}\\sample-webpack-${env.BUILD_ID}"
			}
		}
	}
	post {
		failure {
			mail to: 'randy_jones@esri.com', subject: 'The Pipeline failed', body: 'The Pipeline failed'
		}
	}
}