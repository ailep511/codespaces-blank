import { QuizQuestionData } from './types';

// INITIAL_QUESTIONS is initialized as an empty array.
// The actual initial questions will be loaded from questions.json in App.tsx
// if no questions are found in localStorage.
export const INITIAL_QUESTIONS: QuizQuestionData[] = [
  {
    "question": "A company uses Amazon EC2 Reserved Instances to run its data processing workload. The nightly job typically takes 7 hours to run and must finish within a 10-hour time window. The company anticipates temporary increases in demand at the end of each month that will cause the job to run over the time limit with the capacity of the current resources. Once started, the processing job cannot be interrupted before completion. The company wants to implement a solution that would provide increased resource capacity as cost-effectively as possible.\nWhat should a solutions architect do to accomplish this?",
    "options": {
      "A": "Deploy On-Demand Instances during periods of high demand.",
      "B": "Create a second EC2 reservation for additional instances.",
      "C": "Deploy Spot Instances during periods of high demand.",
      "D": "Increase the EC2 instance size in the EC2 reservation to support the increased workload."
    },
    "correctAnswer": "A",
    "explanation": "On-Demand Instances are suitable for workloads that are short-term, spiky, or unpredictable and cannot be interrupted. Spot Instances are cheaper but can be interrupted, which is not suitable as the job cannot be interrupted. A new reservation would be costly for temporary demand and isn't flexible for infrequent peaks. Increasing the size of the existing reservation might be overkill for temporary increases and less cost-effective than using On-Demand capacity only when needed."
  },
  {
    "question": "A company is migrating its on-premises three-tier web application to AWS. The application requires a relational database. The company wants a managed database solution that minimizes administrative overhead, supports automatic patching, backups, and offers high availability with a Multi-AZ deployment option.\nWhich AWS service should the solutions architect recommend for the database tier?",
    "options": {
      "A": "Amazon DynamoDB",
      "B": "Amazon EC2 instances with a self-managed database",
      "C": "Amazon RDS",
      "D": "Amazon Redshift"
    },
    "correctAnswer": "C",
    "explanation": "Amazon RDS (Relational Database Service) is a managed service that simplifies setting up, operating, and scaling a relational database in the cloud. It supports Multi-AZ deployments for high availability, automated patching, and backups, meeting all the company's requirements for a managed relational database. DynamoDB is a NoSQL database. EC2 with a self-managed database increases administrative overhead. Amazon Redshift is a data warehousing service, not primarily designed for transactional application backends."
  },
  {
    "question": "A development team needs to store and share Docker container images securely within their AWS environment. They require a fully managed service that integrates well with Amazon ECS and EKS. The service should also support versioning of images.\nWhich AWS service is most appropriate for this requirement?",
    "options": {
      "A": "Amazon S3",
      "B": "Amazon EFS",
      "C": "Amazon ECR (Elastic Container Registry)",
      "D": "AWS CodeArtifact"
    },
    "correctAnswer": "C",
    "explanation": "Amazon ECR (Elastic Container Registry) is a fully-managed Docker container registry that makes it easy for developers to store, manage, and deploy Docker container images. It integrates seamlessly with Amazon ECS (Elastic Container Service) and Amazon EKS (Elastic Kubernetes Service) and natively supports image versioning. While S3 can store files, it's not a specialized container registry. EFS provides file storage. AWS CodeArtifact is a repository for software packages, not specifically container images."
  },
  {
    "question": "A company is launching a new public-facing website and expects significant, unpredictable traffic spikes. They want to ensure the website remains available and responsive, and they want to protect it from common web exploits like SQL injection and cross-site scripting (XSS).\nWhich combination of AWS services should be used to meet these requirements?",
    "options": {
      "A": "Amazon EC2 Auto Scaling, Application Load Balancer, and AWS Shield Standard",
      "B": "Amazon EC2 Auto Scaling, Application Load Balancer, and AWS WAF",
      "C": "Amazon CloudFront, Amazon S3 (for static content), and AWS Shield Advanced",
      "D": "Amazon Route 53 Latency-based routing and AWS Firewall Manager"
    },
    "correctAnswer": "B",
    "explanation": "Amazon EC2 Auto Scaling allows the application to scale out or in based on demand, ensuring availability and responsiveness during traffic spikes. An Application Load Balancer (ALB) distributes incoming traffic across multiple EC2 instances. AWS WAF (Web Application Firewall) helps protect web applications from common web exploits such as SQL injection and XSS. AWS Shield Standard provides DDoS protection for all AWS customers, but WAF is specifically for application-layer attacks."
  },
  {
    "question": "A company wants to establish a dedicated, private network connection between its on-premises data center and its AWS VPC. The connection needs to provide consistent low-latency performance and high bandwidth for transferring large datasets.\nWhich AWS service should the company use to establish this connection?",
    "options": {
      "A": "AWS VPN (Site-to-Site VPN)",
      "B": "AWS Direct Connect",
      "C": "VPC Peering",
      "D": "AWS Transit Gateway"
    },
    "correctAnswer": "B",
    "explanation": "AWS Direct Connect is a cloud service solution that makes it easy to establish a dedicated network connection from your premises to AWS. Using AWS Direct Connect, you can establish private connectivity between AWS and your datacenter, office, or colocation environment, which can reduce your network costs, increase bandwidth throughput, and provide a more consistent network experience than Internet-based connections. AWS VPN creates a secure connection over the public internet. VPC Peering connects two VPCs. AWS Transit Gateway is a network hub to connect VPCs and on-premises networks, but Direct Connect provides the dedicated physical circuit."
  },
  {
    "question": "A company needs to store frequently accessed, critical data in Amazon S3. They require the highest level of durability and availability. Data must be resilient to the failure of an entire AWS Availability Zone. Cost is a secondary concern compared to data resilience.\nWhich S3 storage class should be used?",
    "options": {
      "A": "S3 Standard-Infrequent Access (S3 Standard-IA)",
      "B": "S3 One Zone-Infrequent Access (S3 One Zone-IA)",
      "C": "S3 Standard",
      "D": "S3 Glacier Deep Archive"
    },
    "correctAnswer": "C",
    "explanation": "S3 Standard offers high durability (99.999999999%) and availability (99.99%) by redundantly storing data across multiple Availability Zones (typically 3 or more). This makes it resilient to the failure of a single AZ. S3 Standard-IA is for less frequently accessed data but still offers multi-AZ resilience. S3 One Zone-IA stores data in a single AZ and is not resilient to an AZ failure. S3 Glacier Deep Archive is for long-term archival with retrieval times of hours and is not suitable for frequently accessed data."
  },
  {
    "question": "A solutions architect is designing a serverless application that uses AWS Lambda functions to process images uploaded to an Amazon S3 bucket. The Lambda functions need permission to read objects from the S3 bucket and write logs to Amazon CloudWatch Logs.\nWhat is the MOST secure way to grant these permissions to the Lambda functions?",
    "options": {
      "A": "Create an IAM user with the necessary permissions and embed its access keys in the Lambda function code.",
      "B": "Create an IAM role with the necessary permissions and assign it to the Lambda functions as their execution role.",
      "C": "Configure the S3 bucket policy to allow access from the Lambda function's ARN and a similar policy for CloudWatch Logs.",
      "D": "Store IAM user credentials in AWS Secrets Manager and retrieve them within the Lambda function code."
    },
    "correctAnswer": "B",
    "explanation": "The most secure way to grant permissions to AWS services like Lambda is by using IAM roles. An IAM execution role is assumed by the Lambda function at runtime, granting it temporary credentials with the defined permissions. Embedding access keys (A) or retrieving them from Secrets Manager for this purpose (D) is less secure and more complex than using execution roles. While resource-based policies like S3 bucket policies (C) can grant access, an IAM execution role is the standard and recommended best practice for Lambda permissions as it centralizes the function's entitlements."
  },
  {
    "question": "An application running on Amazon EC2 instances processes sensitive user data. The company has a strict compliance requirement that all data stored at rest must be encrypted. The application writes data to Amazon EBS volumes attached to the EC2 instances.\nHow can a solutions architect ensure the data on the EBS volumes is encrypted at rest?",
    "options": {
      "A": "Encrypt the data within the application before writing it to the EBS volumes.",
      "B": "Enable EBS encryption by default for the AWS Region.",
      "C": "Use AWS Shield to encrypt the EBS volumes.",
      "D": "Store the data in an encrypted S3 bucket and mount it to the EC2 instances using AWS Storage Gateway."
    },
    "correctAnswer": "B",
    "explanation": "Enabling EBS encryption by default for the AWS Region ensures that all new EBS volumes created in that region are automatically encrypted at rest using AWS KMS. This is a simple and effective way to meet the compliance requirement. While application-level encryption (A) is possible, it adds complexity. AWS Shield (C) is for DDoS protection, not EBS encryption. Using S3 via Storage Gateway (D) changes the storage architecture and is not a direct solution for encrypting existing EBS volumes at rest."
  },
  {
    "question": "A company wants to monitor the performance of its web application, which is deployed across several Amazon EC2 instances behind an Application Load Balancer (ALB). They need to collect metrics such as CPU utilization, network traffic, and request latency for both the EC2 instances and the ALB. They also want to create alarms based on these metrics.\nWhich AWS service should they primarily use for this purpose?",
    "options": {
      "A": "AWS CloudTrail",
      "B": "Amazon CloudWatch",
      "C": "AWS Config",
      "D": "Amazon Inspector"
    },
    "correctAnswer": "B",
    "explanation": "Amazon CloudWatch is a monitoring and observability service that collects metrics, logs, and traces from AWS resources, applications, and on-premises servers. It can collect CPU utilization, network traffic from EC2 instances, and request latency from ALBs. CloudWatch also allows users to create alarms based on these metrics. AWS CloudTrail (A) is for logging API activity. AWS Config (C) is for assessing, auditing, and evaluating configurations. Amazon Inspector (D) is a vulnerability management service."
  },
  {
    "question": "A company is building a microservices architecture. They need a way to decouple their microservices so that a failure in one service does not impact others. Messages between services need to be stored durably until they are processed. The order of messages within a specific group of related messages must be maintained.\nWhich AWS service is most suitable for this messaging requirement?",
    "options": {
      "A": "Amazon Simple Notification Service (SNS)",
      "B": "Amazon Kinesis Data Streams",
      "C": "Amazon Simple Queue Service (SQS) FIFO queues",
      "D": "Amazon MQ"
    },
    "correctAnswer": "C",
    "explanation": "Amazon SQS FIFO (First-In, First-Out) queues are designed for applications where the order of operations and events is critical, or where duplicates cannot be tolerated. They provide durable message storage and ensure that messages are processed exactly once, in the order they are sent (within a message group). Standard SQS queues don't guarantee order. SNS (A) is a pub/sub messaging service, not primarily for ordered, durable queues. Kinesis Data Streams (B) is for real-time data streaming. Amazon MQ (D) is a managed message broker service for ActiveMQ or RabbitMQ, which could work but SQS FIFO is a more direct AWS-native fit for this specific ordered queuing need."
  },
  {
    "question": "A solutions architect needs to design a highly available and fault-tolerant architecture for a stateless web application. The application will be deployed on Amazon EC2 instances. The design must ensure that the application can withstand the failure of an entire Availability Zone.\nWhich design pattern should the architect implement?",
    "options": {
      "A": "Deploy all EC2 instances in a single Availability Zone with multiple instance types.",
      "B": "Deploy EC2 instances across multiple AWS Regions and use Amazon Route 53 for failover.",
      "C": "Deploy EC2 instances in an Auto Scaling group across multiple Availability Zones within a single AWS Region, behind an Application Load Balancer.",
      "D": "Deploy EC2 instances in a single Availability Zone and use Amazon EBS snapshots for quick recovery."
    },
    "correctAnswer": "C",
    "explanation": "To withstand an Availability Zone failure, the application must be deployed across multiple AZs within a region. An Auto Scaling group ensures the desired number of instances are running, and an Application Load Balancer distributes traffic across instances in these multiple AZs. This setup provides high availability and fault tolerance against an AZ outage. Deploying in a single AZ (A, D) does not protect against AZ failure. Multi-Region deployment (B) provides disaster recovery but is more complex and costly than a multi-AZ setup for high availability within a region."
  },
  {
    "question": "A company has a large amount of historical data (petabytes) that is rarely accessed but must be retained for 10 years for compliance reasons. They are looking for the most cost-effective Amazon S3 storage class for this data. Retrieval times of several hours are acceptable.\nWhich S3 storage class should be used?",
    "options": {
      "A": "S3 Standard",
      "B": "S3 Intelligent-Tiering",
      "C": "S3 Glacier Flexible Retrieval",
      "D": "S3 Glacier Deep Archive"
    },
    "correctAnswer": "D",
    "explanation": "S3 Glacier Deep Archive is Amazon S3’s lowest-cost storage class and supports long-term retention and digital preservation for data that may be accessed once or twice in a year. It is designed for customers that retain data sets for 7-10 years or more. Retrieval times are typically within 12 hours. S3 Standard (A) is for frequently accessed data. S3 Intelligent-Tiering (B) automatically moves data to the most cost-effective access tier but might not be the absolute lowest cost for rarely accessed archival data. S3 Glacier Flexible Retrieval (C) is also for archive but S3 Glacier Deep Archive offers even lower storage costs for data that can tolerate longer retrieval times."
  },
  {
    "question": "A company wants to quickly deploy a simple web application and its database without managing the underlying infrastructure like operating systems or servers. They prefer a solution where they can just upload their code, and AWS handles the deployment, scaling, and patching.\nWhich AWS service is designed for this type of deployment?",
    "options": {
      "A": "Amazon EC2",
      "B": "AWS Elastic Beanstalk",
      "C": "Amazon ECS",
      "D": "AWS Lambda with Amazon API Gateway"
    },
    "correctAnswer": "B",
    "explanation": "AWS Elastic Beanstalk is an easy-to-use service for deploying and scaling web applications and services developed with Java, .NET, PHP, Node.js, Python, Ruby, Go, and Docker on familiar servers such as Apache, Nginx, Passenger, and IIS. You can simply upload your code, and Elastic Beanstalk automatically handles the deployment, from capacity provisioning, load balancing, auto-scaling to application health monitoring. EC2 (A) requires infrastructure management. ECS (C) is for container orchestration. Lambda with API Gateway (D) is for serverless functions, which might fit part of the need but Elastic Beanstalk is more holistic for web application and database deployment in a PaaS model."
  },
  {
    "question": "An organization needs to audit all API calls made to their AWS resources for security analysis and compliance. They need to know who made an API call, from what IP address, when it was made, and what resources were affected. This information must be logged and retained for several years.\nWhich AWS service provides this capability?",
    "options": {
      "A": "Amazon CloudWatch Logs",
      "B": "AWS Config",
      "C": "AWS CloudTrail",
      "D": "Amazon Inspector"
    },
    "correctAnswer": "C",
    "explanation": "AWS CloudTrail is a service that enables governance, compliance, operational auditing, and risk auditing of your AWS account. With CloudTrail, you can log, continuously monitor, and retain account activity related to actions across your AWS infrastructure. It records API calls, including the caller identity, time, source IP, request parameters, and response elements. CloudWatch Logs (A) is for application and system logs. AWS Config (B) tracks resource configuration changes. Amazon Inspector (D) is a vulnerability assessment service."
  },
  {
    "question": "A company is running a stateful application on an Amazon EC2 instance. The application requires a persistent block storage volume that can be detached from one EC2 instance and reattached to another in the same Availability Zone if the original instance fails. The data must be retained even if the EC2 instance is terminated.\nWhich type of storage should be used?",
    "options": {
      "A": "Amazon S3",
      "B": "Amazon EBS Volume",
      "C": "EC2 Instance Store",
      "D": "Amazon EFS"
    },
    "correctAnswer": "B",
    "explanation": "Amazon EBS (Elastic Block Store) volumes provide persistent block-level storage for use with EC2 instances. EBS volumes persist independently from the running life of an EC2 instance and can be detached and reattached to other instances in the same Availability Zone. S3 (A) is object storage, not block storage for OS/applications. EC2 Instance Store (C) is ephemeral and data is lost when the instance is stopped or terminated. EFS (D) is file storage that can be accessed by multiple instances, but EBS is the standard block storage for a single instance needing persistence."
  },
  {
    "question": "A solutions architect needs to provide distinct network segments within a single Amazon VPC for different environments like development, testing, and production. Each segment must have its own IP address range and routing configuration, and traffic between these segments should be controllable via network ACLs and security groups.\nHow can this be achieved within the VPC?",
    "options": {
      "A": "Create multiple VPCs and use VPC peering.",
      "B": "Create multiple subnets, each dedicated to an environment.",
      "C": "Use multiple Elastic IP addresses for each environment.",
      "D": "Configure different AWS Direct Connect connections for each environment."
    },
    "correctAnswer": "B",
    "explanation": "Subnets are segments of a VPC's IP address range where you can place groups of isolated resources. By creating different subnets for development, testing, and production, you can assign unique CIDR blocks to each and control traffic flow between them using route tables, network ACLs, and security groups. Multiple VPCs with peering (A) is a heavier solution for segmentation than subnets within a single VPC. Elastic IPs (C) are for static public IPs. Direct Connect (D) is for on-premises connectivity."
  },
  {
    "question": "A company wants to implement a caching layer for its relational database to reduce read load and improve application performance. The cache should support common caching strategies like lazy loading and write-through, and be highly available.\nWhich AWS service is most suitable for this requirement?",
    "options": {
      "A": "Amazon S3",
      "B": "Amazon DynamoDB Accelerator (DAX)",
      "C": "Amazon ElastiCache (using Redis or Memcached)",
      "D": "Amazon CloudFront"
    },
    "correctAnswer": "C",
    "explanation": "Amazon ElastiCache is a web service that makes it easy to deploy, operate, and scale an in-memory cache in the cloud. It supports two open-source in-memory caching engines: Redis and Memcached, which are suitable for implementing caching strategies like lazy loading and write-through for relational databases. S3 (A) is object storage. DAX (B) is a cache specifically for DynamoDB. CloudFront (D) is a CDN for caching content closer to users, primarily for web assets, not typically as a database cache layer."
  },
  {
    "question": "A global company wants to distribute its static web content (images, videos, CSS, JavaScript) to users around the world with low latency. They also want to improve the availability of this content.\nWhich AWS service should they use?",
    "options": {
      "A": "Amazon S3 Transfer Acceleration",
      "B": "AWS Global Accelerator",
      "C": "Amazon CloudFront",
      "D": "Application Load Balancer with instances in multiple regions"
    },
    "correctAnswer": "C",
    "explanation": "Amazon CloudFront is a content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally with low latency and high transfer speeds, all within a developer-friendly environment. It caches content at Edge Locations closer to users, reducing latency. S3 Transfer Acceleration (A) speeds up uploads to S3. AWS Global Accelerator (B) improves availability and performance of global applications using AWS global network, but CloudFront is specifically for content delivery. ALB with multi-region instances (D) is for dynamic application traffic, not primarily static content distribution."
  },
  {
    "question": "A company needs to ensure that IAM users can only perform actions that are explicitly allowed by their IAM policies and that they adhere to the principle of least privilege. They want to set a permissions boundary for certain IAM roles to restrict the maximum permissions these roles can ever have, regardless of their identity-based policies.\nWhat AWS IAM feature should be used to achieve this?",
    "options": {
      "A": "Service Control Policies (SCPs)",
      "B": "IAM Groups",
      "C": "IAM Permissions Boundaries",
      "D": "Resource-based policies"
    },
    "correctAnswer": "C",
    "explanation": "IAM Permissions Boundaries are an advanced feature for using managed policies to set the maximum permissions that an identity-based policy can grant to an IAM entity (user or role). A permissions boundary does not grant permissions on its own; it only sets the limit. SCPs (A) are used in AWS Organizations to manage permissions across accounts. IAM Groups (B) are for organizing users. Resource-based policies (D) are attached to resources."
  },
  {
    "question": "A company needs to run a batch processing job that can be interrupted. The job is not time-critical and can run whenever compute capacity is available at the lowest possible cost. The primary goal is cost optimization.\nWhich EC2 purchasing option is the MOST cost-effective for this scenario?",
    "options": {
      "A": "On-Demand Instances",
      "B": "Reserved Instances",
      "C": "Spot Instances",
      "D": "Dedicated Hosts"
    },
    "correctAnswer": "C",
    "explanation": "Spot Instances offer the largest discounts on EC2 compute capacity (up to 90% off On-Demand prices) by allowing customers to bid on unused EC2 capacity. They are ideal for fault-tolerant, flexible workloads that can be interrupted, such as batch processing jobs, big data analysis, and test/dev environments. On-Demand (A) is flexible but more expensive. Reserved Instances (B) provide savings for long-term, predictable workloads. Dedicated Hosts (D) are for compliance or licensing needs requiring physical server isolation and are the most expensive."
  }
];

export const GEMINI_API_MODEL_TEXT = 'gemini-2.5-pro-preview-05-06';
