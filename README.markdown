# Senior DevOps Home Assessment

This repository contains the implementation for the Senior DevOps Home Assessment, deploying a simple Node.js web application on AWS using Infrastructure as Code, CI/CD, secrets management, and monitoring.

## Overview
- **Application**: A simple Node.js Express application
- **Infrastructure**: AWS (VPC, EC2, RDS PostgreSQL, S3, ALB)
- **IaC**: Terraform
- **CI/CD**: GitHub Actions
- **Secrets Management**: AWS Secrets Manager
- **Monitoring**: AWS CloudWatch
- **Bonus Features**: HTTPS with ACM, basic autoscaling

## Tools Used
- Terraform: Infrastructure provisioning
- GitHub Actions: CI/CD pipeline
- AWS: Cloud provider (VPC, EC2, RDS, S3, ALB, Secrets Manager, CloudWatch, ACM)
- Node.js: Application runtime
- Docker: Containerization for consistent deployment

## Setup Instructions

### Prerequisites
- AWS account with programmatic access (AWS CLI configured)
- Terraform >= 1.5.0
- GitHub repository with Actions enabled
- Node.js >= 16.x (for local development)
- Docker (for local testing)

### Infrastructure Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Navigate to the `infrastructure` directory:
   ```bash
   cd infrastructure
   ```
3. Initialize Terraform:
   ```bash
   terraform init
   ```
4. Apply the Terraform configuration:
   ```bash
   terraform apply
   ```
   - Provide the required variables (e.g., `aws_region`, `app_name`) when prompted or set them in `terraform.tfvars`.

5. Outputs will include the ALB DNS name and RDS endpoint.

### CI/CD Setup
1. Configure GitHub Secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
2. Push code to the `main` branch to trigger the GitHub Actions pipeline, which builds, tests, and deploys the application.

### Secrets Management
- Secrets are stored in AWS Secrets Manager under the name `<app_name>-secrets`.
- The application retrieves secrets at runtime using the AWS SDK.

### Monitoring
- CloudWatch dashboards are set up to monitor ALB request count, EC2 CPU utilization, and RDS metrics.
- An alert is configured for HTTP 5xx errors on the ALB.

### Application Access
- Access the application via the ALB DNS name output by Terraform (HTTPS only).

## Assumptions
- The application is a simple Node.js Express app requiring a database connection and an API key.
- Public internet access is allowed for the ALB but restricted for EC2 and RDS.
- PostgreSQL is chosen as the data store for its robustness and familiarity.
- HTTPS is implemented using AWS ACM for security.

## Known Limitations
- Autoscaling is basic and may need tuning for production workloads.
- No CDN is implemented due to time constraints, but it can be added with CloudFront.
- The monitoring setup is minimal and could be enhanced with custom metrics.
- The ALB can be configured for HTTPS using AWS Certificate Manager (ACM), though a domain is required (not     implemented here but noted in the README).


## Reflection
### Decisions Made Beyond Requirements

1.AWS for Cloud Provider

Decision: Chose AWS as the cloud provider.

Why: Primarily due to team/individual familiarity and its extensive, mature suite of services (e.g., EC2, ALB, S3, RDS, VPC). This reduced the learning curve and allowed for quicker development and deployment.

Trade-offs:

Vendor Lock-in: Committing to AWS services can make migration to other clouds more challenging in the future, although the use of Terraform (see next point) mitigates this somewhat for infrastructure.

Cost Optimization (Potential): While AWS is powerful, cost optimization requires careful management and understanding of its pricing models. Other cloud providers might offer more competitive pricing for specific services or workloads.

Alternatives Considered: Google Cloud Platform (GCP) and Microsoft Azure.

Reason for Rejection (Alternatives): Time constraints were the primary factor. Learning a new cloud platform would have significantly extended the project timeline.

2.Terraform for Infrastructure as Code (IaC)

Decision: Utilized Terraform for defining and managing infrastructure.

Why: Its cloud-agnostic nature provides flexibility; the same language and tools can be used across different cloud providers if the project scope expands or changes in the future. It offers strong state management, planning capabilities (dry runs), and a large community.

Trade-offs:

Steeper Learning Curve (vs. Cloud-Specific IaC): While powerful, Terraform can have a steeper initial learning curve compared to AWS CloudFormation, especially for those new to IaC concepts.

State Management Complexity: Managing Terraform state, especially in collaborative environments, requires careful planning (e.g., using remote backends like S3 with DynamoDB locking).

Alternative Considered: AWS CloudFormation.

Reason for Rejection (Alternative): CloudFormation is AWS-specific, which limits portability if a multi-cloud strategy were ever considered. Terraform's broader ecosystem and HCL (HashiCorp Configuration Language) were preferred for consistency across potential future projects.

3.Docker for Application Containerization

Decision: Containerized the application using Docker.

Why: Ensured consistent build and runtime environments across development, testing, and production. Simplified dependency management and application packaging. It also laid the groundwork for future container orchestration.

Trade-offs:

Overhead: Introducing Docker adds a layer of abstraction and some minimal overhead in terms of image size and runtime.

Increased Build Time (Potentially): Docker image builds can add to CI/CD pipeline times if not optimized.

Alternative Considered: AWS Elastic Container Service (ECS) for orchestration.

Reason for Rejection (Alternative): For this project's scope, using raw Docker (and potentially managing it on EC2 instances) was deemed simpler than introducing an entire orchestration service like ECS, which would have added complexity in terms of task definitions, services, and clusters. The goal was simplicity for initial deployment.

4.AWS Secrets Manager for Sensitive Data

Decision: Employed AWS Secrets Manager for storing and managing application secrets (e.g., database credentials, API keys).

Why: Specifically designed for secure storage and rotation of secrets, offering features like automatic rotation, fine-grained access control, and integration with other AWS services. This adheres to security best practices.

Trade-offs:

Cost: Secrets Manager is a paid service, whereas AWS Systems Manager Parameter Store has a free tier for standard parameters (though it's not specifically designed for secrets rotation).

Integration Complexity (Slight): Requires a bit more setup for application integration compared to simply fetching from Parameter Store, especially if leveraging advanced features like rotation.

Alternative Considered: AWS Systems Manager Parameter Store.

Reason for Rejection (Alternative): While Parameter Store can store sensitive data (using SecureString type), Secrets Manager provides a more comprehensive solution for secrets lifecycle management, including automatic rotation, which is crucial for security.

5.Rolling Updates for Deployments

Decision: Implemented rolling update deployment strategy.

Why: Provided a good balance between minimizing downtime and managing complexity. It allows new instances to gradually replace old ones, ensuring service availability throughout the deployment process without requiring duplicate environments.

Trade-offs:

Potential for Mixed Versions: During the update, both old and new versions of the application are running concurrently. This requires careful consideration for backward and forward compatibility of APIs and database schema changes.

Rollback Complexity: While rolling updates are generally simple for forward progression, a true "rollback" to a previous state might still involve another rolling update to the older version, which might not be as immediate or seamless as a blue-green swap.

Alternative Considered: Blue-Green Deployments.

Reason for Rejection (Alternative): Blue-green deployments, while offering zero-downtime and easy rollback, require maintaining two identical production environments (blue and green), which significantly increases infrastructure complexity and cost for this project's scope. The simplicity of rolling updates was prioritized.