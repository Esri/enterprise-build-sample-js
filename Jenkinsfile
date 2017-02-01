#!groovy

node {
	stage('checkout')
	checkout scm
	
	stage('prebuild')
	cmd 'npm install -g grunt-cli'
	
	cmd 'npm install -g bower'
}