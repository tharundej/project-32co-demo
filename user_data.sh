#!/bin/bash
yum update -y
yum install -y docker
service docker start
usermod -a -G docker ec2-user

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install

# Pull and run Docker container
docker pull <your-docker-image>
docker run -d -p 3000:3000 \
  -e AWS_REGION=${aws_region} \
  -e SECRETS_ARN=${secrets_arn} \
  -e RDS_ENDPOINT=${rds_endpoint} \
  <your-docker-image>