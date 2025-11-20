pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-2"
        REPO = "037276000336.dkr.ecr.ap-south-2.amazonaws.com/my-cicd-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Avanissh/my-cicd-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t my-cicd-app:${IMAGE_TAG} .'
            }
        }

        stage('Login to AWS ECR') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'aws-cred',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )]) {
                    sh '''
                        aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
                        aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
                        aws configure set default.region ${AWS_REGION}

                        aws ecr get-login-password --region ${AWS_REGION} \
                          | docker login --username AWS --password-stdin ${REPO}
                    '''
                }
            }
        }

        stage('Push Image to ECR') {
            steps {
                sh '''
                    docker tag my-cicd-app:${IMAGE_TAG} ${REPO}:${IMAGE_TAG}
                    docker push ${REPO}:${IMAGE_TAG}
                '''
            }
        }

        stage('Deploy to ECS') {
            steps {
                sh '''
                    aws ecs update-service \
                        --cluster my-cicd-cluster \
                        --service my-cicd-service \
                        --force-new-deployment \
                        --region ${AWS_REGION} \
                        --task-definition $(aws ecs describe-task-definition \
                             --task-definition my-cicd-task \
                             --query "taskDefinition.taskDefinitionArn" \
                             --output text)
                '''
            }
        }
    }
}
