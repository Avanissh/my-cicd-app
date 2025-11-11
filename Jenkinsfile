pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-2"
        ECR_REPO ="037276000336.dkr.ecr.ap-south-2.amazonaws.com/my-cicd-app"
        IMAGE_NAME = "my-cicd-app"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Avanissh/my-cicd-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME ."
            }
        }

        stage('Login to AWS ECR') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-cred', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh """
                        aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
                        aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
                        aws configure set default.region $AWS_REGION
                        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO
                    """
                }
            }
        }

    stage('Tag & Push Image to ECR') {
        steps {
            sh """
            docker tag my-cicd-app:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/my-cicd-app:latest
            docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/my-cicd-app:latest
            """
    }
}

    stage('Deploy to ECS') {
        steps {
            sh """
            aws ecs update-service --cluster my-cicd-cluster1 --service my-cicd-service --force-new-deployment --region ${AWS_REGION}
            """
    }
}
