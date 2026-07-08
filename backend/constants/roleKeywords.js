/**
 * Role-specific keyword dictionaries for ATS scoring.
 *
 * Each role defines:
 *  - required: Skills that are essential for the role (higher scoring weight)
 *  - preferred: Skills that are good to have (standard weight)
 *
 * The `aliases` map at the bottom normalizes common variations so that
 * "react.js", "reactjs", and "react" all resolve to a single canonical form.
 *
 * To add a new role, simply append a new key to ROLE_KEYWORDS following the
 * same { required: [], preferred: [] } structure.
 */

export const ROLE_KEYWORDS = {
  'frontend developer': {
    required: [
      'html', 'css', 'javascript', 'react', 'responsive design',
      'typescript', 'dom', 'web accessibility', 'git'
    ],
    preferred: [
      'next.js', 'vue', 'angular', 'sass', 'tailwind css', 'webpack',
      'vite', 'redux', 'graphql', 'jest', 'cypress', 'figma',
      'performance optimization', 'seo', 'pwa', 'web components',
      'storybook', 'npm', 'rest api', 'agile'
    ]
  },

  'backend developer': {
    required: [
      'node.js', 'python', 'java', 'sql', 'rest api', 'database',
      'git', 'authentication', 'server'
    ],
    preferred: [
      'express', 'django', 'spring boot', 'postgresql', 'mongodb',
      'redis', 'docker', 'kubernetes', 'graphql', 'microservices',
      'message queue', 'rabbitmq', 'kafka', 'nginx', 'linux',
      'ci/cd', 'unit testing', 'orm', 'aws', 'azure', 'agile'
    ]
  },

  'full stack developer': {
    required: [
      'html', 'css', 'javascript', 'react', 'node.js', 'database',
      'rest api', 'git', 'sql'
    ],
    preferred: [
      'typescript', 'next.js', 'express', 'mongodb', 'postgresql',
      'docker', 'aws', 'graphql', 'redis', 'tailwind css', 'redux',
      'ci/cd', 'jest', 'agile', 'responsive design', 'authentication',
      'microservices', 'linux', 'python', 'vue'
    ]
  },

  'software development engineer': {
    required: [
      'data structures', 'algorithms', 'java', 'python', 'javascript',
      'sql', 'git', 'object-oriented programming', 'system design'
    ],
    preferred: [
      'c++', 'go', 'rust', 'docker', 'kubernetes', 'aws', 'linux',
      'microservices', 'ci/cd', 'unit testing', 'design patterns',
      'rest api', 'database', 'agile', 'scrum', 'mongodb',
      'redis', 'distributed systems', 'concurrency', 'typescript'
    ]
  },

  'software engineer': {
    required: [
      'data structures', 'algorithms', 'python', 'javascript', 'java',
      'sql', 'git', 'object-oriented programming', 'system design'
    ],
    preferred: [
      'c++', 'go', 'rust', 'docker', 'kubernetes', 'aws', 'linux',
      'microservices', 'ci/cd', 'unit testing', 'design patterns',
      'rest api', 'database', 'agile', 'scrum', 'mongodb',
      'redis', 'distributed systems', 'concurrency', 'typescript'
    ]
  },

  'data analyst': {
    required: [
      'sql', 'excel', 'python', 'data visualization', 'statistics',
      'data analysis', 'reporting', 'tableau', 'power bi'
    ],
    preferred: [
      'r', 'pandas', 'numpy', 'matplotlib', 'jupyter', 'etl',
      'data warehousing', 'bigquery', 'looker', 'a/b testing',
      'regression', 'hypothesis testing', 'dashboard', 'google analytics',
      'data cleaning', 'pivot tables', 'vba', 'sas', 'agile'
    ]
  },

  'data scientist': {
    required: [
      'python', 'machine learning', 'statistics', 'sql', 'data analysis',
      'pandas', 'numpy', 'scikit-learn', 'data visualization'
    ],
    preferred: [
      'tensorflow', 'pytorch', 'deep learning', 'nlp', 'r',
      'jupyter', 'feature engineering', 'model deployment', 'spark',
      'hadoop', 'a/b testing', 'regression', 'classification',
      'clustering', 'neural networks', 'docker', 'aws', 'git',
      'matplotlib', 'seaborn'
    ]
  },

  'machine learning engineer': {
    required: [
      'python', 'machine learning', 'deep learning', 'tensorflow',
      'pytorch', 'scikit-learn', 'data structures', 'algorithms', 'sql'
    ],
    preferred: [
      'nlp', 'computer vision', 'mlops', 'docker', 'kubernetes',
      'aws', 'gcp', 'model deployment', 'spark', 'feature engineering',
      'data pipelines', 'git', 'linux', 'ci/cd', 'neural networks',
      'transformers', 'reinforcement learning', 'distributed computing',
      'onnx', 'rest api'
    ]
  },

  'ai engineer': {
    required: [
      'python', 'machine learning', 'deep learning', 'neural networks',
      'tensorflow', 'pytorch', 'nlp', 'computer vision', 'algorithms'
    ],
    preferred: [
      'transformers', 'llm', 'generative ai', 'reinforcement learning',
      'mlops', 'docker', 'kubernetes', 'aws', 'gcp', 'model deployment',
      'langchain', 'hugging face', 'rag', 'prompt engineering',
      'vector database', 'fine-tuning', 'data pipelines', 'git',
      'rest api', 'sql'
    ]
  },

  'devops engineer': {
    required: [
      'docker', 'kubernetes', 'ci/cd', 'linux', 'aws', 'git',
      'terraform', 'ansible', 'monitoring', 'scripting'
    ],
    preferred: [
      'jenkins', 'github actions', 'gitlab ci', 'azure', 'gcp',
      'prometheus', 'grafana', 'helm', 'nginx', 'python', 'bash',
      'infrastructure as code', 'cloud formation', 'datadog',
      'elk stack', 'security', 'networking', 'microservices',
      'serverless', 'load balancing'
    ]
  },

  'cloud engineer': {
    required: [
      'aws', 'azure', 'gcp', 'linux', 'networking', 'docker',
      'kubernetes', 'terraform', 'security', 'cloud architecture'
    ],
    preferred: [
      'serverless', 'lambda', 'cloud formation', 'vpc', 'iam',
      's3', 'ec2', 'load balancing', 'ci/cd', 'python', 'bash',
      'monitoring', 'cost optimization', 'database', 'cdn',
      'dns', 'ssl', 'compliance', 'disaster recovery', 'ansible'
    ]
  },

  'cybersecurity analyst': {
    required: [
      'network security', 'vulnerability assessment', 'siem', 'firewalls',
      'incident response', 'threat analysis', 'linux', 'encryption',
      'compliance'
    ],
    preferred: [
      'penetration testing', 'ids', 'ips', 'wireshark', 'nmap',
      'burp suite', 'python', 'bash', 'owasp', 'soc', 'malware analysis',
      'forensics', 'iso 27001', 'gdpr', 'zero trust', 'cloud security',
      'endpoint protection', 'risk assessment', 'security audit',
      'active directory'
    ]
  },

  'mobile app developer': {
    required: [
      'react native', 'flutter', 'swift', 'kotlin', 'mobile ui',
      'rest api', 'git', 'app store', 'responsive design'
    ],
    preferred: [
      'ios', 'android', 'xcode', 'android studio', 'firebase',
      'push notifications', 'sqlite', 'redux', 'typescript',
      'graphql', 'unit testing', 'ci/cd', 'performance optimization',
      'offline storage', 'dart', 'objective-c', 'java', 'expo',
      'app deployment', 'agile'
    ]
  }
};

/**
 * Maps common aliases/variations to their canonical keyword form.
 * Both keys and values must be lowercase.
 */
export const KEYWORD_ALIASES = {
  'js': 'javascript',
  'es6': 'javascript',
  'ecmascript': 'javascript',
  'ts': 'typescript',
  'react.js': 'react',
  'reactjs': 'react',
  'react js': 'react',
  'vue.js': 'vue',
  'vuejs': 'vue',
  'vue js': 'vue',
  'angular.js': 'angular',
  'angularjs': 'angular',
  'node': 'node.js',
  'nodejs': 'node.js',
  'node js': 'node.js',
  'express.js': 'express',
  'expressjs': 'express',
  'next': 'next.js',
  'nextjs': 'next.js',
  'next js': 'next.js',
  'mongo': 'mongodb',
  'mongo db': 'mongodb',
  'postgres': 'postgresql',
  'psql': 'postgresql',
  'mysql': 'sql',
  'mssql': 'sql',
  'tf': 'tensorflow',
  'scikit learn': 'scikit-learn',
  'sklearn': 'scikit-learn',
  'ml': 'machine learning',
  'dl': 'deep learning',
  'ai': 'artificial intelligence',
  'nlp': 'natural language processing',
  'cv': 'computer vision',
  'k8s': 'kubernetes',
  'ci cd': 'ci/cd',
  'cicd': 'ci/cd',
  'continuous integration': 'ci/cd',
  'continuous deployment': 'ci/cd',
  'aws lambda': 'lambda',
  'amazon web services': 'aws',
  'google cloud': 'gcp',
  'google cloud platform': 'gcp',
  'microsoft azure': 'azure',
  'tailwindcss': 'tailwind css',
  'tailwind': 'tailwind css',
  'dsa': 'data structures',
  'data structures and algorithms': 'data structures',
  'oop': 'object-oriented programming',
  'object oriented programming': 'object-oriented programming',
  'github': 'git',
  'gitlab': 'git',
  'bitbucket': 'git',
  'rest': 'rest api',
  'restful': 'rest api',
  'restful api': 'rest api',
  'api development': 'rest api',
  'react native': 'react native',
  'rn': 'react native',
  'objective c': 'objective-c',
  'swift ui': 'swift',
  'swiftui': 'swift',
  'android development': 'android',
  'ios development': 'ios',
  'html5': 'html',
  'css3': 'css',
  'scss': 'sass',
  'less': 'sass',
  'bash scripting': 'bash',
  'shell scripting': 'scripting',
  'shell': 'bash',
  'power bi': 'power bi',
  'powerbi': 'power bi',
  'elastic search': 'elk stack',
  'elasticsearch': 'elk stack',
  'kibana': 'elk stack',
  'logstash': 'elk stack',
  'llms': 'llm',
  'large language models': 'llm',
  'large language model': 'llm',
  'gen ai': 'generative ai',
  'genai': 'generative ai',
  'huggingface': 'hugging face'
};

/**
 * Finds the best matching role key from ROLE_KEYWORDS given a user-supplied
 * target role string.  Uses case-insensitive substring matching and returns
 * the first role whose name is contained within the input (or vice-versa).
 * Falls back to 'software engineer' when nothing matches.
 *
 * @param {string} targetRole - The user's target role text.
 * @returns {string} A key from ROLE_KEYWORDS.
 */
export const resolveRole = (targetRole) => {
  if (!targetRole) return 'software engineer';

  const normalized = targetRole.toLowerCase().trim();

  // Direct match
  if (ROLE_KEYWORDS[normalized]) return normalized;

  // Substring match (role key contained in input or input contained in role key)
  for (const roleKey of Object.keys(ROLE_KEYWORDS)) {
    if (normalized.includes(roleKey) || roleKey.includes(normalized)) {
      return roleKey;
    }
  }

  // Keyword-based fuzzy match
  const words = normalized.split(/\s+/);
  let bestMatch = null;
  let bestOverlap = 0;

  for (const roleKey of Object.keys(ROLE_KEYWORDS)) {
    const roleWords = roleKey.split(/\s+/);
    const overlap = words.filter(w => roleWords.includes(w)).length;
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      bestMatch = roleKey;
    }
  }

  return bestMatch || 'software engineer';
};
