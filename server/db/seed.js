const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('./database');

async function seedDatabase() {
  const db = getDb();
  
  console.log('🌱 Seeding database...');
  
  // Check if already seeded
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count > 0) {
    console.log('⚠ Database already seeded. Skipping...');
    return;
  }
  
  // Hash passwords
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 12);
  const userPasswordHash = await bcrypt.hash('User@123456', 12);
  
  // Create admin user
  const adminId = uuidv4();
  db.prepare(`
    INSERT INTO users (id, email, password_hash, name, role, bio, headline, is_active, email_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    adminId,
    'admin@nexusteam.com',
    adminPasswordHash,
    'Platform Admin',
    'admin',
    'Platform administrator with full system access',
    'Managing the NexusTeam portfolio platform',
    1,
    1
  );
  
  // Create regular users
  const users = [
    {
      name: 'Alex Rivera',
      email: 'alex@example.com',
      headline: 'Full Stack Developer',
      bio: 'Passionate developer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture.',
      location: 'San Francisco, CA',
      website: 'https://alexrivera.dev',
      github: 'https://github.com/alexrivera'
    },
    {
      name: 'Maya Patel',
      email: 'maya@example.com',
      headline: 'UI/UX Designer',
      bio: 'Creative designer focused on creating beautiful, user-centered digital experiences. Expert in design systems and prototyping.',
      location: 'New York, NY',
      website: 'https://mayapatel.design'
    },
    {
      name: 'James Chen',
      email: 'james@example.com',
      headline: 'Data Scientist',
      bio: 'Data scientist specializing in machine learning and predictive analytics. PhD in Computer Science with focus on NLP.',
      location: 'Seattle, WA',
      github: 'https://github.com/jameschen'
    },
    {
      name: 'Sofia Martinez',
      email: 'sofia@example.com',
      headline: 'Interior Designer',
      bio: 'Award-winning interior designer creating sustainable, functional spaces that inspire. Specialized in commercial and residential design.',
      location: 'Miami, FL',
      website: 'https://sofiadesigns.com'
    },
    {
      name: 'Ryan O\'Brien',
      email: 'ryan@example.com',
      headline: 'DevOps Engineer',
      bio: 'Infrastructure engineer passionate about automation, CI/CD, and cloud-native architectures. AWS and Kubernetes certified.',
      location: 'Austin, TX',
      github: 'https://github.com/ryanobrien'
    }
  ];
  
  const userIds = [];
  for (const user of users) {
    const userId = uuidv4();
    userIds.push(userId);
    
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, bio, headline, location, website, github_url, is_active, email_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      user.email,
      userPasswordHash,
      user.name,
      'user',
      user.bio,
      user.headline,
      user.location || null,
      user.website || null,
      user.github || null,
      1,
      1
    );
    
    // Add skills for each user
    const skills = getSkillsForUser(user.headline);
    for (const skill of skills) {
      db.prepare(`
        INSERT INTO skills (id, user_id, name, category, proficiency_level)
        VALUES (?, ?, ?, ?, ?)
      `).run(uuidv4(), userId, skill.name, skill.category, skill.level);
    }
    
    // Add experience
    const experience = getExperienceForUser(user.headline);
    for (const exp of experience) {
      db.prepare(`
        INSERT INTO experience (id, user_id, company, position, description, start_date, end_date, is_current)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        uuidv4(),
        userId,
        exp.company,
        exp.position,
        exp.description,
        exp.startDate,
        exp.endDate,
        exp.isCurrent ? 1 : 0
      );
    }
  }
  
  // Create categories
  const categories = [
    { name: 'Web Development', slug: 'web-development', description: 'Full-stack web applications and websites' },
    { name: 'Mobile Development', slug: 'mobile-development', description: 'iOS, Android, and cross-platform mobile apps' },
    { name: 'UI/UX Design', slug: 'ui-ux-design', description: 'User interface and experience design' },
    { name: 'Data Science', slug: 'data-science', description: 'Machine learning, analytics, and data visualization' },
    { name: 'Interior Design', slug: 'interior-design', description: 'Residential and commercial interior design' },
    { name: 'DevOps', slug: 'devops', description: 'Infrastructure, CI/CD, and cloud architecture' },
    { name: 'Photography', slug: 'photography', description: 'Professional photography and visual arts' },
    { name: 'Graphic Design', slug: 'graphic-design', description: 'Branding, logos, and visual identity' }
  ];
  
  for (const cat of categories) {
    db.prepare(`
      INSERT INTO categories (id, name, slug, description)
      VALUES (?, ?, ?, ?)
    `).run(uuidv4(), cat.name, cat.slug, cat.description);
  }
  
  // Create portfolios for each user
  const portfolios = [
    {
      userId: userIds[0],
      title: 'Alex Rivera - Full Stack Development',
      slug: 'alex-rivera-portfolio',
      description: 'Showcasing my journey in building scalable web applications and distributed systems.',
      category: 'web-development',
      tags: JSON.stringify(['react', 'nodejs', 'typescript', 'aws']),
      isPublished: 1
    },
    {
      userId: userIds[1],
      title: 'Maya Patel - Design Portfolio',
      slug: 'maya-patel-design',
      description: 'A collection of my UI/UX design work, from mobile apps to enterprise dashboards.',
      category: 'ui-ux-design',
      tags: JSON.stringify(['figma', 'sketch', 'design-systems', 'prototyping']),
      isPublished: 1
    },
    {
      userId: userIds[2],
      title: 'James Chen - Data Science Portfolio',
      slug: 'james-chen-data',
      description: 'Machine learning projects, data analysis, and predictive modeling work.',
      category: 'data-science',
      tags: JSON.stringify(['python', 'tensorflow', 'nlp', 'analytics']),
      isPublished: 1
    },
    {
      userId: userIds[3],
      title: 'Sofia Martinez - Interior Design',
      slug: 'sofia-martinez-design',
      description: 'Sustainable and functional interior design for commercial and residential spaces.',
      category: 'interior-design',
      tags: JSON.stringify(['sustainable', 'commercial', 'residential', '3d-modeling']),
      isPublished: 1
    },
    {
      userId: userIds[4],
      title: 'Ryan O\'Brien - DevOps Portfolio',
      slug: 'ryan-obrien-devops',
      description: 'Cloud infrastructure, CI/CD pipelines, and automation solutions.',
      category: 'devops',
      tags: JSON.stringify(['aws', 'kubernetes', 'docker', 'terraform']),
      isPublished: 1
    }
  ];
  
  const portfolioIds = [];
  for (const portfolio of portfolios) {
    const portfolioId = uuidv4();
    portfolioIds.push(portfolioId);
    
    db.prepare(`
      INSERT INTO portfolios (id, user_id, title, slug, description, category, tags, is_published, view_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      portfolioId,
      portfolio.userId,
      portfolio.title,
      portfolio.slug,
      portfolio.description,
      portfolio.category,
      portfolio.tags,
      portfolio.isPublished,
      Math.floor(Math.random() * 500) + 100
    );
    
    // Add projects to each portfolio
    const projects = getProjectsForPortfolio(portfolio.category);
    for (const project of projects) {
      db.prepare(`
        INSERT INTO projects (id, portfolio_id, title, description, short_description, technologies, category, project_url, github_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        uuidv4(),
        portfolioId,
        project.title,
        project.description,
        project.shortDescription,
        JSON.stringify(project.technologies),
        portfolio.category,
        project.projectUrl || null,
        project.githubUrl || null
      );
    }
  }
  
  // Create some favorites
  db.prepare(`
    INSERT INTO favorites (id, user_id, portfolio_id)
    VALUES (?, ?, ?)
  `).run(uuidv4(), userIds[0], portfolioIds[1]);
  
  db.prepare(`
    INSERT INTO favorites (id, user_id, portfolio_id)
    VALUES (?, ?, ?)
  `).run(uuidv4(), userIds[1], portfolioIds[0]);
  
  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('Admin: admin@nexusteam.com / Admin@123456');
  console.log('Users: alex@example.com, maya@example.com, etc. / User@123456');
}

function getSkillsForUser(headline) {
  const skillMap = {
    'Full Stack Developer': [
      { name: 'React', category: 'Frontend', level: 5 },
      { name: 'Node.js', category: 'Backend', level: 5 },
      { name: 'TypeScript', category: 'Language', level: 4 },
      { name: 'PostgreSQL', category: 'Database', level: 4 },
      { name: 'AWS', category: 'Cloud', level: 4 }
    ],
    'UI/UX Designer': [
      { name: 'Figma', category: 'Design', level: 5 },
      { name: 'Sketch', category: 'Design', level: 4 },
      { name: 'Adobe XD', category: 'Design', level: 4 },
      { name: 'Prototyping', category: 'Skill', level: 5 },
      { name: 'User Research', category: 'Skill', level: 4 }
    ],
    'Data Scientist': [
      { name: 'Python', category: 'Language', level: 5 },
      { name: 'TensorFlow', category: 'ML', level: 5 },
      { name: 'Pandas', category: 'Data', level: 5 },
      { name: 'SQL', category: 'Database', level: 4 },
      { name: 'Machine Learning', category: 'Skill', level: 5 }
    ],
    'Interior Designer': [
      { name: 'AutoCAD', category: 'Design', level: 5 },
      { name: 'SketchUp', category: 'Design', level: 5 },
      { name: '3D Modeling', category: 'Skill', level: 4 },
      { name: 'Space Planning', category: 'Skill', level: 5 },
      { name: 'Sustainable Design', category: 'Skill', level: 4 }
    ],
    'DevOps Engineer': [
      { name: 'AWS', category: 'Cloud', level: 5 },
      { name: 'Kubernetes', category: 'Orchestration', level: 5 },
      { name: 'Docker', category: 'Containerization', level: 5 },
      { name: 'Terraform', category: 'IaC', level: 4 },
      { name: 'CI/CD', category: 'Skill', level: 5 }
    ]
  };
  
  return skillMap[headline] || [];
}

function getExperienceForUser(headline) {
  const expMap = {
    'Full Stack Developer': [
      { company: 'TechCorp Inc.', position: 'Senior Full Stack Developer', description: 'Led development of microservices architecture serving 1M+ users', startDate: '2020-01', endDate: null, isCurrent: true },
      { company: 'StartupXYZ', position: 'Full Stack Developer', description: 'Built and scaled web applications from 0 to 100K users', startDate: '2017-06', endDate: '2019-12', isCurrent: false }
    ],
    'UI/UX Designer': [
      { company: 'Design Studio Pro', position: 'Senior UX Designer', description: 'Led design team for enterprise SaaS products', startDate: '2019-03', endDate: null, isCurrent: true },
      { company: 'Creative Agency', position: 'UI Designer', description: 'Designed mobile apps and web interfaces for Fortune 500 clients', startDate: '2016-01', endDate: '2019-02', isCurrent: false }
    ],
    'Data Scientist': [
      { company: 'DataTech Solutions', position: 'Lead Data Scientist', description: 'Built ML models for predictive analytics and NLP applications', startDate: '2018-06', endDate: null, isCurrent: true },
      { company: 'Research Lab', position: 'Data Scientist', description: 'Conducted research in natural language processing', startDate: '2015-09', endDate: '2018-05', isCurrent: false }
    ],
    'Interior Designer': [
      { company: 'Luxury Spaces Design', position: 'Principal Designer', description: 'Led high-end residential and commercial design projects', startDate: '2016-01', endDate: null, isCurrent: true },
      { company: 'Modern Interiors Co.', position: 'Interior Designer', description: 'Designed sustainable commercial spaces', startDate: '2012-03', endDate: '2015-12', isCurrent: false }
    ],
    'DevOps Engineer': [
      { company: 'CloudFirst Inc.', position: 'Senior DevOps Engineer', description: 'Architected and managed AWS infrastructure for 50+ microservices', startDate: '2019-01', endDate: null, isCurrent: true },
      { company: 'TechStartup', position: 'DevOps Engineer', description: 'Implemented CI/CD pipelines and containerization strategy', startDate: '2016-06', endDate: '2018-12', isCurrent: false }
    ]
  };
  
  return expMap[headline] || [];
}

function getProjectsForPortfolio(category) {
  const projectMap = {
    'web-development': [
      {
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with React frontend, Node.js backend, and PostgreSQL database. Features include real-time inventory management, payment processing with Stripe, and admin dashboard.',
        shortDescription: 'Modern e-commerce platform with real-time features',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
        projectUrl: 'https://ecommerce-demo.com',
        githubUrl: 'https://github.com/demo/ecommerce'
      },
      {
        title: 'Task Management App',
        description: 'Collaborative task management application with real-time updates, team workspaces, and advanced filtering. Built with modern web technologies and deployed on AWS.',
        shortDescription: 'Real-time collaborative task management',
        technologies: ['React', 'TypeScript', 'Socket.io', 'MongoDB', 'AWS'],
        projectUrl: 'https://taskapp-demo.com',
        githubUrl: 'https://github.com/demo/taskapp'
      },
      {
        title: 'Social Media Dashboard',
        description: 'Analytics dashboard for social media managers to track engagement, schedule posts, and analyze performance across multiple platforms.',
        shortDescription: 'Social media analytics and management tool',
        technologies: ['Vue.js', 'Python', 'FastAPI', 'PostgreSQL', 'Chart.js']
      }
    ],
    'ui-ux-design': [
      {
        title: 'Banking App Redesign',
        description: 'Complete UX redesign of a mobile banking application, improving user satisfaction by 45%. Conducted user research, created wireframes, and delivered high-fidelity prototypes.',
        shortDescription: 'Mobile banking UX redesign with 45% satisfaction improvement',
        technologies: ['Figma', 'User Research', 'Prototyping', 'Usability Testing']
      },
      {
        title: 'E-Learning Platform',
        description: 'Designed a comprehensive e-learning platform with intuitive navigation, accessible content delivery, and engaging user experience for students and instructors.',
        shortDescription: 'Intuitive e-learning platform design',
        technologies: ['Sketch', 'InVision', 'Design System', 'Accessibility']
      },
      {
        title: 'Healthcare Dashboard',
        description: 'Data visualization dashboard for healthcare providers to monitor patient metrics, appointment schedules, and resource allocation in real-time.',
        shortDescription: 'Healthcare data visualization dashboard',
        technologies: ['Adobe XD', 'Data Visualization', 'Dashboard Design']
      }
    ],
    'data-science': [
      {
        title: 'Customer Churn Prediction',
        description: 'Machine learning model predicting customer churn with 92% accuracy. Used ensemble methods and feature engineering to identify key retention factors.',
        shortDescription: 'ML model for customer churn prediction (92% accuracy)',
        technologies: ['Python', 'Scikit-learn', 'Pandas', 'XGBoost', 'Jupyter'],
        githubUrl: 'https://github.com/demo/churn-prediction'
      },
      {
        title: 'Sentiment Analysis Engine',
        description: 'NLP-based sentiment analysis system processing 10K+ reviews daily. Implemented transformer models and deployed as a REST API for real-time analysis.',
        shortDescription: 'Real-time NLP sentiment analysis system',
        technologies: ['Python', 'TensorFlow', 'BERT', 'FastAPI', 'Docker'],
        githubUrl: 'https://github.com/demo/sentiment-analysis'
      },
      {
        title: 'Sales Forecasting Model',
        description: 'Time series forecasting model for retail sales prediction with seasonal adjustments. Reduced inventory costs by 23% through accurate demand forecasting.',
        shortDescription: 'Time series sales forecasting with 23% cost reduction',
        technologies: ['Python', 'Prophet', 'ARIMA', 'Pandas', 'SQL']
      }
    ],
    'interior-design': [
      {
        title: 'Modern Office Space',
        description: 'Designed a 15,000 sq ft modern office space for a tech startup. Focused on collaborative work areas, natural lighting, and sustainable materials.',
        shortDescription: '15,000 sq ft sustainable tech office design',
        technologies: ['AutoCAD', 'SketchUp', 'Sustainable Materials', 'Space Planning']
      },
      {
        title: 'Luxury Residential Project',
        description: 'Complete interior design for a 4,500 sq ft luxury residence. Created custom furniture designs and integrated smart home technology throughout.',
        shortDescription: 'Luxury 4,500 sq ft residence with smart home integration',
        technologies: ['3D Rendering', 'Custom Furniture', 'Smart Home', 'Lighting Design']
      },
      {
        title: 'Boutique Hotel Renovation',
        description: 'Renovated a 50-room boutique hotel, blending modern aesthetics with local cultural elements. Project completed on time and 10% under budget.',
        shortDescription: '50-room boutique hotel renovation',
        technologies: ['Hospitality Design', 'Cultural Integration', 'Project Management']
      }
    ],
    'devops': [
      {
        title: 'Kubernetes Migration',
        description: 'Led migration of 30+ microservices from EC2 to Kubernetes. Implemented auto-scaling, reduced infrastructure costs by 40%, and improved deployment frequency by 5x.',
        shortDescription: 'Kubernetes migration with 40% cost reduction',
        technologies: ['Kubernetes', 'Helm', 'AWS EKS', 'Terraform', 'Prometheus'],
        githubUrl: 'https://github.com/demo/k8s-migration'
      },
      {
        title: 'CI/CD Pipeline Automation',
        description: 'Built comprehensive CI/CD pipeline reducing deployment time from 2 hours to 15 minutes. Implemented automated testing, security scanning, and blue-green deployments.',
        shortDescription: 'Automated CI/CD reducing deployment time by 87%',
        technologies: ['Jenkins', 'GitHub Actions', 'Docker', 'SonarQube', 'AWS CodeDeploy']
      },
      {
        title: 'Infrastructure as Code',
        description: 'Implemented complete infrastructure as code using Terraform modules. Created reusable components for VPC, EKS, RDS, and monitoring stack.',
        shortDescription: 'Terraform modules for complete AWS infrastructure',
        technologies: ['Terraform', 'AWS', 'Ansible', 'GitOps', 'Monitoring'],
        githubUrl: 'https://github.com/demo/terraform-modules'
      }
    ]
  };
  
  return projectMap[category] || [];
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}

module.exports = { seedDatabase };
