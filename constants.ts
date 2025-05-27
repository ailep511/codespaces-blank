import { QuizQuestionData } from './types';

// INITIAL_QUESTIONS is initialized as an empty array.
// The actual initial questions will be loaded from questions.json in App.tsx
// if no questions are found in localStorage.
export const INITIAL_QUESTIONS: QuizQuestionData[] = [
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

export const GEMINI_API_MODEL_TEXT = 'gemini-2.5-flash-preview-05-20';
