pipeline {
    agent any

    environment {
        PROFILE = "${params.BRANCH == "master" ? "prod" : "test"}"
        PROJECT_NAME = 'akamuinsaner'
        BACKEND_IP = '101.42.247.31'
        BACKEND_PORT = "${params.BRANCH == "master" ? "8001" : "8000"}"
        EXPOSE_PORT = "3000"
        OPEN_PORT = "${params.BRANCH == "master" ? "9001" : "9000"}"
    }

    stages {
        stage('Git Clone') {
            steps {
                checkout scm
            }
        }

        stage('Docker build') {
            steps {
                script {
                    def BACKEND_URL
                    if (env.PROFILE == 'test') {
                        BACKEND_URL = "http://${env.BACKEND_IP}:${env.BACKEND_PORT}"
                    } else {
                        BACKEND_URL = "http://${env.BACKEND_IP}:${env.BACKEND_PORT}"
                    }
                    sh """
                        docker build --build-arg PORT=${env.EXPOSE_PORT} --build-arg BACKEND_URL=${BACKEND_URL} -t ${env.PROJECT_NAME}/${env.JOB_NAME}-${env.PROFILE}:${env.BUILD_ID} --network=host .
                    """
                }

            }
        }

        stage('Docker push') {
            when {
                expression { params.BRANCH == 'master' }
            }
            steps {
                withCredentials([string(credentialsId: 'hub.docker', passwordVariable: 'password', usernameVariable: 'username')]) {
                    sh """
                        docker login --username ${username} --password ${password}
                        docker push ${env.PROJECT_NAME}/${env.JOB_NAME}-${env.PROFILE}:${env.BUILD_ID}
                    """
                }

            }
        }

        stage ('Deploy') {
            steps {
                script {
                    def CONTAINER_ID = sh(script: "docker ps -a | grep -0e ${env.PROJECT_NAME}/${env.JOB_NAME}-${env.PROFILE} | cut -c1-10", returnStdout: true).trim();
                    if (CONTAINER_ID) {
                        sh "docker rm -f ${CONTAINER_ID}"
                    }
                    sh "docker run -d --rm -p ${env.OPEN_PORT}:${env.EXPOSE_PORT} --name ${env.JOB_NAME}-${env.PROFILE} ${env.PROJECT_NAME}/${env.JOB_NAME}-${env.PROFILE}:${env.BUILD_ID}"
                }
            }
        }
    }
}