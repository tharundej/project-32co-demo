# project-32co-demo
Senior DevOps Home Assessment
This repository contains the implementation for the Senior DevOps Home Assessment, deploying a simple Node.js web application on AWS using Infrastructure as Code, CI/CD, secrets management, and monitoring.
Overview

Application: A simple Node.js Express application
Infrastructure: AWS (VPC, EC2, RDS PostgreSQL, S3, ALB)
IaC: Terraform
CI/CD: GitHub Actions
Secrets Management: AWS Secrets Manager
Monitoring: AWS CloudWatch
Bonus Features: HTTPS with ACM, basic autoscaling

Tools Used

Terraform: Infrastructure provisioning
GitHub Actions: CI/CD pipeline
AWS: Cloud provider (VPC, EC2, RDS, S3, ALB, Secrets Manager, CloudWatch, ACM)
Node.js: Application runtime
Docker: Containerization for consistent deployment

Setup Instructions
Prerequisites

AWS account with programmatic access (AWS CLI configured)
Terraform >= 1.5.0
GitHub repository with Actions enabled
Node.js >= 16.x (for local development)
Docker (for local testing)

Infrastructure Setup

Clone the repository:
git clone <repository-url>
cd <repository-folder>


Navigate to the infrastructure directory:
cd infrastructure


Initialize Terraform:
terraform init


Apply the Terraform configuration:
terraform apply


Provide the required variables (e.g., aws_region, app_name) when prompted or set them in terraform.tfvars.


Outputs will include the ALB DNS name and RDS endpoint.


CI/CD Setup

Configure GitHub Secrets:
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION


Push code to the main branch to trigger the GitHub Actions pipeline, which builds, tests, and deploys the application.

Secrets Management

Secrets are stored in AWS Secrets Manager under the name <app_name>-secrets.
The application retrieves secrets at runtime using the AWS SDK.

Monitoring

CloudWatch dashboards are set up to monitor ALB request count, EC2 CPU utilization, and RDS metrics.
An alert is configured for HTTP 5xx errors on the ALB.

Application Access

Access the application via the ALB DNS name output by Terraform (HTTPS only).

Assumptions

The application is a simple Node.js Express app requiring a database connection and an API key.
Public internet access is allowed for the ALB but restricted for EC2 and RDS.
PostgreSQL is chosen as the data store for its robustness and familiarity.
HTTPS is implemented using AWS ACM for security.

Known Limitations

Autoscaling is basic and may need tuning for production workloads.
No CDN is implemented due to time constraints, but it can be added with CloudFront.
The monitoring setup is minimal and could be enhanced with custom metrics.

Reflection
Decisions Made Beyond Requirements

HTTPS with ACM: Implemented HTTPS using AWS Certificate Manager to secure traffic, even though it was a bonus requirement. This ensures end-to-end encryption and aligns with security best practices.

Why: Securing traffic is critical for production applications, and ACM simplifies certificate management.
Trade-offs: Adds slight complexity to the ALB setup but provides significant security benefits. Alternatives like self-signed certificates were considered but rejected due to maintenance overhead.


Dockerized Deployment: Used Docker to containerize the application for consistent builds and deployments across environments.

Why: Containers ensure environment parity and simplify dependency management.
Trade-offs: Increases deployment complexity slightly but reduces runtime issues. Alternatives like direct EC2 deployment were considered but deemed less reliable.


Basic Autoscaling: Added a simple autoscaling group to handle load spikes, even though it was optional.

Why: Improves application resilience and scalability for real-world scenarios.
Trade-offs: Adds infrastructure complexity and potential costs. Manual scaling was considered but rejected due to lack of dynamic response to traffic changes.


