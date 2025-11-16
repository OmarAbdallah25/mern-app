pipeline {
    agent any

    environment {
        // ⚠️ Mets ici ton vrai username Docker Hub
        DOCKERHUB_USER  = 'TON_DOCKERHUB_USERNAME'
        SERVER_IMAGE    = "${DOCKERHUB_USER}/mern-server"
        CLIENT_IMAGE    = "${DOCKERHUB_USER}/mern-client"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build server image') {
            steps {
                sh 'docker build -t $SERVER_IMAGE ./server'
            }
        }

        stage('Build client image') {
            steps {
                sh 'docker build -t $CLIENT_IMAGE ./client'
            }
        }

        stage('Scan images with Trivy') {
            steps {
                sh '''
                    # Scan de l'image backend
                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      aquasec/trivy:latest image \
                      --exit-code 1 \
                      --severity HIGH,CRITICAL \
                      $SERVER_IMAGE

                    # Scan de l'image frontend
                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      aquasec/trivy:latest image \
                      --exit-code 1 \
                      --severity HIGH,CRITICAL \
                      $CLIENT_IMAGE
                '''
            }
        }

        stage('Login & Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USERNAME',
                        passwordVariable: 'DOCKERHUB_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
                        docker push $SERVER_IMAGE
                        docker push $CLIENT_IMAGE
                        docker logout || true
                    '''
                }
            }
        }
    }
}
