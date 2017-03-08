#!groovy

node {
	
	stage('build') {
		step {
			bat 'npm install'
			bat 'bower install'
		}
		step {
			bat 'grunt build -verbose'
		}
	}
}