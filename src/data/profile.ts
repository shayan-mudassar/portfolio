export const profile = {
  name: "Shayan Mudassar",
  role: "Backend Engineer",
  location: "London, UK",
  headline: "Backend Engineer building reliable event-driven systems.",
  summary:
    "I design and own backend services end-to-end, from API contracts and data modeling to deployment, observability, and incident response.",
  email: "loren lipsen@shayanmudassar.dev",
  links: {
    github: "https://github.com/shayan-mudassar",
    linkedin: "https://linkedin.com/in/shayan-mudassar",
  },
  experience: [
    {
      company: "Fixfirst",
      role: "Backend Engineer",
      period: "Jan 2024 - Jun 2025",
      location: "Berlin, Germany",
      impact: "MTTR -24%",
      bullets: [
        "Owned incident intake services end-to-end, from API design to production rollouts and on-call support.",
        "Designed event-driven workflows for triage, escalation, and audit trails using queues and topic routing.",
        "Modeled incident data across Postgres and DynamoDB with versioned schemas and migration safety.",
        "Implemented idempotent webhook handling, retries, and outbox patterns to ensure delivery guarantees.",
        "Hardened services with OAuth scopes, fine-grained RBAC, and security posture checks.",
      ],
      shipped: [
        "Incident intake API and webhook gateway",
        "Workflow orchestration and escalation engine",
        "Reliability dashboards and paging rules",
      ],
      ranInProd: [
        "SLO-based alerting and structured logs",
        "DLQ and replay tooling for failed events",
        "Automated CI/CD with safe rollbacks",
      ],
    },
    {
      company: "SMSami",
      role: "Backend Engineer",
      period: "Jan 2021 - Aug 2023",
      location: "Peshawar, Pakistan",
      impact: "p95 latency -38%",
      bullets: [
        "Built high-throughput messaging APIs with rate limits, idempotency keys, and strict validation.",
        "Migrated legacy workflows to async pipelines, reducing latency spikes and improving throughput.",
        "Designed tenant-aware data models and secure access controls for multi-tenant messaging.",
        "Instrumented tracing, dashboards, and alert thresholds for core delivery pipelines.",
      ],
      shipped: [
        "Messaging gateway and delivery receipts",
        "Async campaign processing pipelines",
        "Admin APIs for tenant operations",
      ],
      ranInProd: [
        "Canary deploys and gradual rollouts",
        "Retry + backoff with circuit breakers",
        "Centralized secrets management",
      ],
    },
    {
      company: "AYS Electronics",
      role: "Software Engineer",
      period: "Jun 2019 - Dec 2020",
      location: "Peshawar, Pakistan",
      impact: "Inventory accuracy +18%",
      bullets: [
        "Developed backend services for inventory and order tracking with reliable audit histories.",
        "Modeled product and supplier data with transaction-safe workflows.",
        "Automated nightly reporting and data quality checks.",
      ],
      shipped: [
        "Inventory APIs and order tracking",
        "Automated reporting pipelines",
        "Role-based access controls",
      ],
      ranInProd: [
        "Database backups and restore drills",
        "Operational runbooks for on-call",
        "Monitoring for throughput anomalies",
      ],
    },
  ],
  projects: [
    {
      name: "Sentinel Incident Platform",
      description:
        "Interactive incident simulator for webhook failures, retries, and safe replays.",
      repo: "https://github.com/shayan-mudassar/sentinel-incident-platform",
    },
    {
      name: "Network Anomaly Detection",
      description:
        "Client-side anomaly explorer with model toggles and precision/recall tradeoffs.",
      repo: "https://github.com/shayan-mudassar/network-anomaly-detection",
    },
  ],
  skills: [
    {
      title: "API & Data Modeling",
      items: ["REST design", "Schema versioning", "Postgres", "DynamoDB"],
    },
    {
      title: "Async & Messaging",
      items: ["SQS/SNS", "EventBridge", "Kafka-style patterns", "Queue workers"],
    },
    {
      title: "Reliability Patterns",
      items: ["Retries + backoff", "DLQ", "Outbox", "Idempotency"],
    },
    {
      title: "Security Fundamentals",
      items: ["OAuth2", "RBAC", "Audit trails", "Secrets management"],
    },
    {
      title: "Observability & CI/CD",
      items: ["Tracing", "Metrics + SLOs", "GitHub Actions", "Canary deploys"],
    },
    {
      title: "AWS Serverless",
      items: [
        "Lambda",
        "API Gateway",
        "DynamoDB/RDS",
        "SQS/SNS/EventBridge",
        "Cognito",
        "CloudWatch/X-Ray",
      ],
    },
  ],
  certifications: [
    {
      title: "Certified Ethical Hacker (CEH)",
      issuer: "EC-Council",
    },
    {
      title: "Data Science & Machine Learning",
      issuer: "Professional Certification",
    },
  ],
  education: [
    {
      title: "BEng in Computer Science",
      issuer: "University of Engineering & Technology",
    },
  ],
  architectureNodes: [
    {
      id: "gateway",
      label: "API Gateway",
      detail: "Auth, rate limits, and idempotency tokens at the edge.",
    },
    {
      id: "lambda",
      label: "Lambda",
      detail: "Stateless handlers that orchestrate workflows and retries.",
    },
    {
      id: "storage",
      label: "DynamoDB / RDS",
      detail: "Schema versioning, outbox writes, and safe migrations.",
    },
    {
      id: "bus",
      label: "EventBridge / SQS",
      detail: "Fan-out events, DLQ handling, and replay tooling.",
    },
    {
      id: "obs",
      label: "Observability",
      detail: "Tracing, metrics, and alerts tied to SLOs.",
    },
  ],
};
