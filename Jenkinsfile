#!groovy

node {
	stage('checkout')
	checkout scm
	
	stage('prebuild')
	withNPM(npmrcConfig: 'my-custom-nprc') {
		sh 'npm install -g grunt-cli'
	
		sh 'npm install -g bower'
	}
}