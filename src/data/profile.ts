export const profile = {
  name: "Shayan Mudassar",
  role: "Senior Full-Stack Engineer",
  location: "London, UK",
  positioning: "Senior Full-Stack Engineer (Product & Platform Focused)",
  headline: "I build product-ready systems that stay reliable under real traffic.",
  summary:
    "End-to-end ownership: UI, APIs, data, deployment. Event-driven systems, reliability patterns, production readiness.",
  proofPoints: "Customer-facing workflows, stakeholder collaboration, measurable improvements.",
  cvPath: "assets/Shayan_Mudassar_CV.pdf",
  workPreference: "London / hybrid / remote",
  email: "info@shayanmudassar.co.uk",
  links: {
    github: "https://github.com/shayan-mudassar",
    linkedin: "https://linkedin.com/in/shayan-mudassar",
  },
  experience: [
    {
      company: "Fixfirst",
      role: "Backend Engineer (Product-Facing Systems)",
      period: "January 2024 - November 2025",
      location: "Germany (remote)",
      impact: "Latency -30%",
      bullets: [
        "Designed and delivered backend services that directly powered customer-facing web workflows used by thousands of users.",
        "Owned API contracts end-to-end, collaborating closely with frontend teams to support evolving product features.",
        "Translated product requirements into scalable services and data models used across multiple user journeys.",
        "Improved customer experience by reducing latency by 30% on critical endpoints and failure rates across critical paths.",
        "Implemented production-ready reliability patterns, security controls, and CI/CD pipelines to support continuous delivery.",
      ],
      shipped: [
        "Customer-facing workflow services and APIs",
        "Shared data models across user journeys",
        "Reliability, security, CI/CD for production delivery",
      ],
      ranInProd: [
        "Latency and failure-rate gains on critical paths",
        "Reliability patterns and safeguards",
        "CI/CD pipelines for continuous releases",
      ],
    },
    {
      company: "SMSami",
      role: "Full-Stack Developer",
      period: "January 2021 - Aug 2023",
      location: "Pakistan",
      bullets: [
        "Owned full-stack features from UI implementation to backend logic and production deployment.",
        "Built and maintained customer-facing dashboards and internal tools used by real users.",
        "Delivered end-to-end solutions covering frontend interfaces, APIs, data storage, and cloud deployment.",
        "Worked directly with stakeholders to refine requirements, iterate on features, and respond to user feedback.",
        "Mentored junior developers and contributed to code reviews and architectural discussions.",
      ],
      shipped: [
        "Customer-facing dashboards and internal tools",
        "End-to-end features across UI, APIs, data",
        "Stakeholder-driven feature iterations",
      ],
      ranInProd: [
        "Production deployments across frontend and backend",
        "Operational support for user-facing workflows",
        "Code review and architecture standards",
      ],
    },
    {
      company: "AYS Electronics",
      role: "Junior Full-Stack Developer",
      period: "June 2019 - Dec 2020",
      location: "Pakistan",
      bullets: [
        "Implemented frontend features and backend endpoints as part of live production systems.",
        "Worked on real customer requirements, bug fixes, and incremental feature delivery.",
        "Gained hands-on experience across UI development, backend services, and database integrations.",
      ],
      shipped: [
        "Frontend features and backend endpoints",
        "Incremental features and bug fixes",
        "Database integrations for production workflows",
      ],
      ranInProd: [
        "Production support and issue fixes",
        "Cross-stack delivery from UI to backend",
        "UI, backend, database integrations",
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
