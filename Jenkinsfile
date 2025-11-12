pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-2"
        ECR_REPO = "my-cicd-app"
        CLUSTER = "myapp-cluster"
        SERVICE = "my-cicd-app-service"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Avanissh/my-cicd-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t my-cicd-app .'
            }
        }

        stage('Login to AWS ECR') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-cred']]) {
                    sh '''
                        aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
                        aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
                        aws configure set default.region ${AWS_REGION}

                        aws ecr get-login-password --region ${AWS_REGION} \
                        | docker login --username AWS --password-stdin \
                        ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}
                    '''
                }
            }
        }

        stage('Tag & Push Image to ECR') {
            steps {
                sh '''
                    docker tag my-cicd-app:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:latest
                    docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:latest
                '''
            }
        }

        stage('Deploy to ECS') {
            steps {
                sh '''
                    echo "Deploying latest image to ECS..."
                    aws ecs update-service \
                        --cluster ${CLUSTER} \
                        --service ${SERVICE} \
                        --force-new-deployment \
                        --region ${AWS_REGION}
                '''
            }
        }
    } // ✅ close stages

} // ✅ close pipeline
