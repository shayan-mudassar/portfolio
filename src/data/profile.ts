export const profile = {
  name: "Shayan Mudassar",
  role: "Software Engineer",
  location: "London, UK",
  positioning: "Software Engineer | Full-Stack Developer | Node.js, TypeScript, React, AWS",
  headline: "I build customer-facing web apps, backend APIs, and reliable cloud services.",
  summary:
    "Full-Stack Engineer with experience building customer-facing web applications, backend APIs, internal tools, and cloud-based services.",
  proofPoints:
    "Hands-on across Node.js, TypeScript, React, REST APIs, AWS serverless, databases, testing, debugging, and production issue investigation.",
  heroMetrics: ["Customer-facing workflows", "Production issue investigation", "Cloud-based services"],
  cvPath: "assets/Shayan_Mudassar_CV.pdf",
  workPreference: "London / hybrid / remote",
  email: "shynmudassar@gmail.com",
  phone: "+44 7743 352944",
  links: {
    github: "https://github.com/shayan-mudassar",
    linkedin: "https://www.linkedin.com/in/shayan-mudassar/",
    portfolio: "https://shayanmudassar.co.uk/",
  },
  experience: [
    {
      company: "Fixfirst",
      role: "Backend Engineer",
      period: "Jan 2024 - Present",
      location: "Germany (Remote)",
      impact: "Production backend ownership",
      bullets: [
        "Built and maintained backend services for customer-facing workflows using Node.js, TypeScript, AWS Lambda, SQS, SNS, Cognito, MySQL, and Sequelize.",
        "Developed REST API endpoints and backend logic to support product features, internal workflows, authentication, and asynchronous processing.",
        "Investigated and fixed production issues across Node.js and TypeScript APIs, AWS Lambda functions, SQS/SNS queues, CloudWatch logs, and MySQL records.",
        "Improved reliability through better error handling, retry logic, idempotency checks, structured logging, monitoring, and safer failure handling.",
        "Worked with frontend and product teams to clarify requirements, fix integration issues, and deliver maintainable backend changes.",
      ],
      shipped: [
        "Backend services for customer-facing workflows",
        "REST API endpoints for product and internal workflows",
        "Authentication and asynchronous processing",
      ],
      ranInProd: [
        "Production debugging across APIs, Lambda, queues, logs, and data records",
        "Retry logic, idempotency checks, monitoring, and structured logging",
        "Node.js, TypeScript, AWS Lambda, SQS, SNS, Cognito, MySQL, Sequelize",
      ],
    },
    {
      company: "SMSAMI",
      role: "FlyAwayHub product",
      period: "Jan 2021 - Aug 2023",
      location: "Pakistan",
      impact: "Frontend to backend transition",
      bullets: [
        "Transitioned from frontend to backend engineering after applying internally and completing the company interview process.",
        "Worked on FlyAwayHub, a cloud-based aviation management platform supporting flight school bookings, resources, reporting, and operational workflows.",
      ],
      roles: [
        {
          title: "Backend Engineer",
          period: "Jan 2022 - Aug 2023",
          bullets: [
            "Built and maintained backend APIs using Node.js, TypeScript, REST APIs, DynamoDB/Dynamoose, and cloud-based deployments.",
            "Developed backend features for booking workflows, operational dashboards, internal tools, and business processes.",
            "Debugged and resolved issues across backend APIs, data flows, and frontend API integrations for FlyAwayHub users.",
          ],
          tech: "Node.js, TypeScript, REST APIs, DynamoDB, Dynamoose, Jest, cloud-based deployments",
        },
        {
          title: "Frontend Engineer",
          period: "Jan 2021 - Dec 2021",
          bullets: [
            "Built responsive user interfaces for customer-facing screens, dashboards, forms, and internal workflow pages using React and TypeScript.",
            "Developed reusable frontend components and integrated screens with REST APIs for creating, updating, and managing application data.",
            "Worked on layout improvements, bug fixes, user experience improvements, and API integration issues across the platform.",
          ],
          tech: "React, TypeScript, JavaScript, REST API integration, HTML5, CSS3",
        },
      ],
      shipped: [
        "FlyAwayHub backend APIs and cloud-based deployments",
        "Booking workflows, operational dashboards, and internal tools",
        "Responsive React interfaces and reusable frontend components",
      ],
      ranInProd: [
        "DynamoDB/Dynamoose data flows and API integrations",
        "Frontend-to-backend debugging across customer-facing workflows",
        "React, Node.js, TypeScript, REST APIs, DynamoDB, Jest",
      ],
    },
    {
      company: "AYS Electronics",
      role: "Junior Full-Stack Developer",
      period: "Jun 2019 - Dec 2020",
      location: "Pakistan",
      bullets: [
        "Worked on AYS Online, the company e-commerce website for electronics and home appliances, along with internal business tools.",
        "Built frontend screens and supported backend APIs for product, customer, order, and internal business workflows.",
        "Supported banking and payment-related integrations between the website, internal systems, and external providers.",
        "Collaborated with business users and technical teams to gather requirements, fix issues, test changes, and improve system functionality.",
      ],
      shipped: [
        "AYS Online e-commerce workflows",
        "Frontend screens and backend APIs",
        "Internal business tools and payment-related integrations",
      ],
      ranInProd: [
        "Product, customer, order, and internal workflows",
        "Relational databases and third-party integrations",
        "Python, backend APIs, frontend development, internal tools",
      ],
    },
  ],
  projects: [
    {
      name: "Sentinel Incident Platform",
      description:
        "Event-driven incident workflow platform for alert ingestion, incident correlation, state management, idempotency, retries, logging, and observability.",
      repo: "https://github.com/shayan-mudassar/sentinel-incident-platform",
    },
    {
      name: "Network Anomaly Detection",
      description:
        "Machine learning project for detecting and classifying network traffic anomalies using KDDCUP99, feature engineering, k-means clustering, and Random Forest models.",
      repo: "https://github.com/shayan-mudassar/network-anomaly-detection",
    },
  ],
  skills: [
    {
      title: "Languages",
      items: ["TypeScript", "JavaScript", "Python", "SQL"],
    },
    {
      title: "Backend",
      items: ["Node.js", "REST APIs", "API development", "Authentication", "Production debugging"],
    },
    {
      title: "Frontend",
      items: ["React", "HTML5", "CSS3", "Responsive UI", "REST API integration"],
    },
    {
      title: "Cloud & DevOps",
      items: ["AWS Lambda", "SQS", "SNS", "Cognito", "S3", "CloudWatch", "Docker", "CI/CD", "GitHub Actions"],
    },
    {
      title: "Databases & Testing",
      items: ["MySQL", "PostgreSQL", "DynamoDB", "Sequelize", "Dynamoose", "Jest", "Unit testing", "Debugging"],
    },
    {
      title: "Production Practices",
      items: ["Error handling", "Retry logic", "Idempotency checks", "Structured logging", "Monitoring"],
    },
  ],
  certifications: [
    {
      title: "Certified Ethical Hacker (CEH)",
      issuer: "LearnPentest",
    },
    {
      title: "Data Science & Machine Learning",
      issuer: "Kamyab Jawan Programme",
    },
  ],
  education: [
    {
      title: "MEng Applied Artificial Intelligence",
      issuer: "London South Bank University",
      period: "Oct 2023 - Oct 2024",
      detail: "Relevant coursework: Machine Learning, Industrial Cyber-Physical Systems",
    },
    {
      title: "BSc Computer Science",
      issuer: "University of Agriculture, Peshawar",
      period: "Aug 2016 - Oct 2020",
      detail: "Relevant coursework: Data Structures, Distributed Systems, Databases",
    },
  ],
  architectureNodes: [
    {
      id: "gateway",
      label: "REST APIs",
      detail: "Customer-facing endpoints, authentication, and product workflow contracts.",
    },
    {
      id: "lambda",
      label: "Node.js / Lambda",
      detail: "TypeScript services, AWS Lambda functions, and backend workflow logic.",
    },
    {
      id: "storage",
      label: "MySQL / DynamoDB",
      detail: "Sequelize and Dynamoose-backed records for customer and operational workflows.",
    },
    {
      id: "bus",
      label: "SQS / SNS",
      detail: "Asynchronous processing, retries, and safer handling for backend workflows.",
    },
    {
      id: "obs",
      label: "CloudWatch",
      detail: "Production issue investigation through logs, monitoring, and debugging signals.",
    },
  ],
};
