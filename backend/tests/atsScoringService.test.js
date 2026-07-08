/**
 * Comprehensive test suite for the ATS Scoring Engine.
 *
 * Run with:  node --experimental-vm-modules backend/tests/atsScoringService.test.js
 *
 * Uses no external test framework — just plain Node assert + console.
 */

import { calculateATSScore } from '../services/atsScoringService.js';

let passed = 0;
let failed = 0;
const results = [];

function assert(condition, message) {
  if (condition) {
    passed++;
    results.push({ status: 'PASS', message });
  } else {
    failed++;
    results.push({ status: 'FAIL', message });
    console.error(`  ✗ FAIL: ${message}`);
  }
}

function test(name, fn) {
  console.log(`\n─── Test: ${name} ───`);
  try {
    fn();
  } catch (err) {
    failed++;
    results.push({ status: 'ERROR', message: `${name}: ${err.message}` });
    console.error(`  ✗ ERROR: ${err.message}`);
  }
}

// ─── Test Resume Fixtures ───────────────────────────────────────────────────

const EMPTY_RESUME = '';

const VERY_SHORT_RESUME = 'John Doe\njohn@example.com';

const WEAK_RESUME = `
John Smith
Phone: 555-1234

I am looking for a job. I know some things about computers.
I went to school. I like coding.
`;

const AVERAGE_RESUME = `
Jane Doe
Email: jane.doe@email.com
Phone: +1 555-987-6543
LinkedIn: linkedin.com/in/janedoe
GitHub: github.com/janedoe

PROFESSIONAL SUMMARY
Motivated software developer with 1 year of experience building web applications.
Passionate about learning new technologies and solving problems.

EDUCATION
Bachelor of Science in Computer Science
State University — 2023

SKILLS
JavaScript, HTML, CSS, React, Node.js, Git, SQL, MongoDB, Express

WORK EXPERIENCE
Junior Developer — TechCorp (Jan 2023 – Present)
- Developed responsive web interfaces using React and CSS
- Worked on REST API endpoints using Node.js and Express
- Collaborated with a team of 5 developers using Git and Agile methodology

PROJECTS
Personal Portfolio Website
- Built a responsive portfolio website using React and Tailwind CSS
- Deployed on Vercel with CI/CD pipeline

Todo Application
- Created a full-stack todo app with React, Node.js, Express, and MongoDB
- Implemented user authentication with JWT

CERTIFICATIONS
- Meta Front-End Developer Certificate — Coursera
`;

const STRONG_SDE_RESUME = `
Abhay Kumar
Email: abhay.kumar@gmail.com | Phone: +91 98765-43210
LinkedIn: linkedin.com/in/abhaykumar | GitHub: github.com/abhaykumar
Portfolio: abhaykumar.dev

PROFESSIONAL SUMMARY
Results-driven Software Development Engineer with 3+ years of experience building scalable, high-performance
web applications and microservices. Proficient in JavaScript, TypeScript, Python, and Java with deep expertise
in React, Node.js, and cloud-native architectures. Passionate about system design, algorithms, and delivering
measurable business impact through clean, maintainable code.

EDUCATION
Bachelor of Technology in Computer Science and Engineering
Indian Institute of Technology — GPA: 8.9/10 — 2021

SKILLS
Languages: JavaScript, TypeScript, Python, Java, C++, SQL
Frontend: React, Next.js, Redux, Tailwind CSS, HTML5, CSS3, Responsive Design
Backend: Node.js, Express, Django, Spring Boot, GraphQL, REST API
Databases: PostgreSQL, MongoDB, Redis, DynamoDB
DevOps & Cloud: Docker, Kubernetes, AWS (EC2, S3, Lambda, SQS), CI/CD, GitHub Actions, Terraform
Tools: Git, Linux, Webpack, Vite, Jest, Cypress, Datadog, Jira
Concepts: Data Structures, Algorithms, System Design, Object-Oriented Programming, Microservices, Agile

WORK EXPERIENCE
Software Development Engineer II — Amazon (Apr 2023 – Present)
• Architected and deployed a real-time order tracking microservice handling 15,000+ requests/second
• Reduced API latency by 42% by implementing Redis caching and query optimization
• Led migration of legacy monolith to Kubernetes-based microservices, improving deployment frequency by 300%
• Mentored 3 junior engineers through code reviews and pair programming sessions
• Implemented CI/CD pipelines using GitHub Actions reducing build times from 15 minutes to 4 minutes

Software Development Engineer — Flipkart (Jul 2021 – Mar 2023)
• Built a product recommendation engine serving 2 million+ daily active users
• Developed RESTful APIs using Node.js and Express with 99.9% uptime SLA
• Optimized database queries reducing page load time from 4 seconds to 1.8 seconds
• Collaborated with cross-functional teams in Agile sprints to deliver features bi-weekly
• Created comprehensive unit and integration tests achieving 92% code coverage

INTERNSHIP EXPERIENCE
Software Engineering Intern — Google (May 2020 – Jul 2020)
• Developed internal dashboard tool using React and Firebase used by 200+ employees
• Implemented automated testing pipeline reducing regression bugs by 35%

PROJECTS
Distributed Task Scheduler (Open Source)
• Engineered a distributed task scheduling system using Node.js, Redis, and Docker
• Handles 50,000+ scheduled jobs daily with fault-tolerant architecture
• 450+ GitHub stars with active community contributions
• Tech Stack: Node.js, Redis, Docker, PostgreSQL, GitHub Actions

Real-Time Collaboration Platform
• Built a real-time collaborative document editor using WebSockets and CRDT algorithms
• Supports 100+ concurrent users with sub-50ms sync latency
• Tech Stack: React, TypeScript, Node.js, WebSocket, MongoDB

CERTIFICATIONS
• AWS Certified Solutions Architect — Associate (Amazon Web Services)
• Google Professional Cloud Developer (Google Cloud)
• Kubernetes Administrator (CKA) — CNCF

ACHIEVEMENTS
• Won 1st place at HackMIT 2020 among 500+ participants
• Published research paper on distributed systems at IEEE Conference
• Top 1% on LeetCode with 800+ problems solved
• Open source contributor with 1000+ GitHub contributions
`;

const UNRELATED_RESUME = `
Chef Roberto
Email: roberto@kitchen.com
Phone: 555-COOK

PROFESSIONAL SUMMARY
Award-winning Executive Chef with 15 years of experience in fine dining restaurants.
Expert in French and Italian cuisine with a passion for farm-to-table cooking.

EDUCATION
Le Cordon Bleu — Paris, France — Culinary Arts Diploma — 2008

SKILLS
French Cuisine, Italian Cuisine, Pastry Arts, Menu Development, Kitchen Management,
Food Safety, Wine Pairing, Inventory Management, Sous Vide, Molecular Gastronomy

WORK EXPERIENCE
Executive Chef — The Grand Restaurant (2015 – Present)
- Managed a kitchen team of 20 staff members
- Designed seasonal menus featuring locally sourced ingredients
- Increased restaurant revenue by 25% through menu innovation
- Maintained 5-star health inspection rating for 8 consecutive years

Sous Chef — Bella Italia (2010 – 2015)
- Prepared over 200 dishes daily during peak hours
- Trained 15 junior cooks on knife skills and plating techniques

CERTIFICATIONS
- ServSafe Food Manager Certification
- Certified Sommelier — Court of Master Sommeliers

ACHIEVEMENTS
- Named "Best Chef" by City Dining Magazine 2022
- Guest appearance on MasterChef Season 12
`;

const REPEATED_KEYWORDS_RESUME = `
John Developer
Email: john@dev.com | Phone: 555-1234

SKILLS
JavaScript JavaScript JavaScript JavaScript JavaScript JavaScript JavaScript JavaScript
React React React React React React React React React React React React
Node.js Node.js Node.js Node.js Node.js Node.js Node.js Node.js
Python Python Python Python Python Python Python Python

SUMMARY
I know JavaScript. I use JavaScript every day. JavaScript is my favorite language.
I build everything with JavaScript. JavaScript JavaScript JavaScript.

EXPERIENCE
Used JavaScript and React and Node.js to build JavaScript React Node.js applications.
JavaScript React Node.js JavaScript React Node.js JavaScript React Node.js.
`;

const PROJECTS_ONLY_RESUME = `
Sarah Chen
Email: sarah.chen@gmail.com
Phone: +1 555-234-5678
GitHub: github.com/sarahchen

EDUCATION
Bachelor of Computer Science — MIT — Expected 2025

SKILLS
Python, JavaScript, React, Node.js, MongoDB, Git, Docker, Machine Learning, TensorFlow

PROJECTS
AI-Powered Study Planner
- Built a machine learning model using TensorFlow to predict optimal study schedules
- Developed a React frontend with Node.js backend serving 500+ university students
- Achieved 85% prediction accuracy on study pattern analysis
- Tech Stack: Python, TensorFlow, React, Node.js, MongoDB

Open Source Contribution — VS Code Extensions
- Contributed 3 extensions to the VS Code marketplace with 10,000+ combined downloads
- Implemented automated testing with Jest achieving 95% coverage

Hackathon Project — HealthTracker
- Won 2nd place at HackHealth 2024 among 200 teams
- Built a real-time health monitoring dashboard using React and WebSocket
- Integrated with wearable device APIs for live data streaming

CERTIFICATIONS
- Google TensorFlow Developer Certificate
- AWS Cloud Practitioner

ACHIEVEMENTS
- Dean's List — All semesters
- President of Computer Science Club
- Published paper on NLP techniques at undergraduate research conference
`;

// ─── Tests ──────────────────────────────────────────────────────────────────

test('Empty resume returns score 0', () => {
  const result = calculateATSScore(EMPTY_RESUME, 'Software Engineer');
  assert(result.atsScore === 0, `Score should be 0, got ${result.atsScore}`);
  assert(result.error !== undefined, 'Should include error message');
});

test('Very short resume returns very low score', () => {
  const result = calculateATSScore(VERY_SHORT_RESUME, 'Software Engineer');
  assert(result.atsScore <= 20, `Score should be ≤20, got ${result.atsScore}`);
});

test('Weak resume returns low score', () => {
  const result = calculateATSScore(WEAK_RESUME, 'Software Engineer');
  assert(result.atsScore >= 1 && result.atsScore <= 35, `Score should be 1-35, got ${result.atsScore}`);
  console.log(`  Weak resume score: ${result.atsScore}`);
});

test('Average resume returns moderate score', () => {
  const result = calculateATSScore(AVERAGE_RESUME, 'Full Stack Developer');
  assert(result.atsScore >= 35 && result.atsScore <= 75, `Score should be 35-75, got ${result.atsScore}`);
  console.log(`  Average resume score: ${result.atsScore}`);
});

test('Strong SDE resume returns high score', () => {
  const result = calculateATSScore(STRONG_SDE_RESUME, 'Software Development Engineer');
  assert(result.atsScore >= 65, `Score should be ≥65, got ${result.atsScore}`);
  console.log(`  Strong SDE resume score: ${result.atsScore}`);
  console.log(`  Breakdown:`, JSON.stringify(result.scoreBreakdown, null, 2));
});

test('Unrelated resume (chef for SDE role) returns low keyword/relevance score', () => {
  const result = calculateATSScore(UNRELATED_RESUME, 'Software Development Engineer');
  assert(result.scoreBreakdown.keywords.score <= 5, `Keywords score should be ≤5, got ${result.scoreBreakdown.keywords.score}`);
  assert(result.atsScore <= 45, `Total score should be ≤45, got ${result.atsScore}`);
  console.log(`  Chef-as-SDE score: ${result.atsScore}`);
});

test('Repeated keywords do not inflate score', () => {
  const result = calculateATSScore(REPEATED_KEYWORDS_RESUME, 'Full Stack Developer');
  // Should NOT get a perfect keyword score despite massive repetition
  assert(result.scoreBreakdown.keywords.score <= 20, `Keywords should not be inflated, got ${result.scoreBreakdown.keywords.score}/25`);
  // Impact should be low since no real achievements
  assert(result.scoreBreakdown.impact.score <= 5, `Impact should be low, got ${result.scoreBreakdown.impact.score}/10`);
  console.log(`  Repeated keywords resume score: ${result.atsScore}`);
});

test('Resume with missing sections has lower structure score', () => {
  const result = calculateATSScore(WEAK_RESUME, 'Software Engineer');
  assert(result.scoreBreakdown.structure.score <= 10, `Structure should be ≤10, got ${result.scoreBreakdown.structure.score}/20`);
});

test('Projects-only resume (no professional experience) receives reasonable score', () => {
  const result = calculateATSScore(PROJECTS_ONLY_RESUME, 'Software Engineer');
  assert(result.atsScore >= 40, `Score should be ≥40 for strong projects, got ${result.atsScore}`);
  assert(result.atsScore <= 85, `Score should be ≤85 without prof experience, got ${result.atsScore}`);
  console.log(`  Projects-only resume score: ${result.atsScore}`);
});

test('Same resume analyzed multiple times returns identical score (determinism)', () => {
  const score1 = calculateATSScore(AVERAGE_RESUME, 'Full Stack Developer').atsScore;
  const score2 = calculateATSScore(AVERAGE_RESUME, 'Full Stack Developer').atsScore;
  const score3 = calculateATSScore(AVERAGE_RESUME, 'Full Stack Developer').atsScore;
  const score4 = calculateATSScore(AVERAGE_RESUME, 'Full Stack Developer').atsScore;
  const score5 = calculateATSScore(AVERAGE_RESUME, 'Full Stack Developer').atsScore;
  assert(score1 === score2 && score2 === score3 && score3 === score4 && score4 === score5,
    `All 5 runs should produce identical scores: ${score1}, ${score2}, ${score3}, ${score4}, ${score5}`);
});

test('Different resumes produce meaningfully different scores', () => {
  const weakScore = calculateATSScore(WEAK_RESUME, 'Software Engineer').atsScore;
  const avgScore = calculateATSScore(AVERAGE_RESUME, 'Software Engineer').atsScore;
  const strongScore = calculateATSScore(STRONG_SDE_RESUME, 'Software Engineer').atsScore;

  assert(weakScore < avgScore, `Weak (${weakScore}) should be < Average (${avgScore})`);
  assert(avgScore < strongScore, `Average (${avgScore}) should be < Strong (${strongScore})`);
  assert(strongScore - weakScore >= 20, `Difference between strong and weak should be ≥20, got ${strongScore - weakScore}`);
  console.log(`  Score ranking: Weak=${weakScore} < Average=${avgScore} < Strong=${strongScore}`);
});

test('Score never goes below 0 or above 100', () => {
  const testCases = [
    { text: EMPTY_RESUME, role: 'Software Engineer' },
    { text: VERY_SHORT_RESUME, role: 'Software Engineer' },
    { text: WEAK_RESUME, role: 'Data Scientist' },
    { text: AVERAGE_RESUME, role: 'Full Stack Developer' },
    { text: STRONG_SDE_RESUME, role: 'Software Development Engineer' },
    { text: UNRELATED_RESUME, role: 'Machine Learning Engineer' },
    { text: REPEATED_KEYWORDS_RESUME, role: 'Frontend Developer' },
    { text: PROJECTS_ONLY_RESUME, role: 'AI Engineer' },
  ];

  let allValid = true;
  for (const { text, role } of testCases) {
    const result = calculateATSScore(text, role);
    if (result.atsScore < 0 || result.atsScore > 100) {
      allValid = false;
      console.error(`  Out of range: ${result.atsScore} for role "${role}"`);
    }
    // Also check each category
    for (const [key, cat] of Object.entries(result.scoreBreakdown)) {
      if (cat.score < 0 || cat.score > cat.maxScore) {
        allValid = false;
        console.error(`  Category ${key} out of range: ${cat.score}/${cat.maxScore}`);
      }
    }
  }
  assert(allValid, 'All scores are within valid ranges (0–100 total, per-category within max)');
});

test('Result includes all required fields', () => {
  const result = calculateATSScore(AVERAGE_RESUME, 'Full Stack Developer');
  assert(typeof result.atsScore === 'number', 'atsScore should be a number');
  assert(result.scoreBreakdown !== undefined, 'scoreBreakdown should exist');
  assert(Array.isArray(result.matchedKeywords), 'matchedKeywords should be an array');
  assert(Array.isArray(result.missingKeywords), 'missingKeywords should be an array');
  assert(Array.isArray(result.strengths), 'strengths should be an array');
  assert(Array.isArray(result.weaknesses), 'weaknesses should be an array');
  assert(Array.isArray(result.suggestions), 'suggestions should be an array');

  const categories = ['structure', 'keywords', 'relevance', 'formatting', 'impact', 'readability'];
  for (const cat of categories) {
    assert(result.scoreBreakdown[cat] !== undefined, `scoreBreakdown.${cat} should exist`);
    assert(typeof result.scoreBreakdown[cat].score === 'number', `scoreBreakdown.${cat}.score should be a number`);
    assert(typeof result.scoreBreakdown[cat].maxScore === 'number', `scoreBreakdown.${cat}.maxScore should be a number`);
  }
});

test('Job description keyword matching works', () => {
  const jd = `We are looking for a React developer with experience in TypeScript, Node.js, GraphQL, and Docker.
  Must have strong knowledge of CI/CD pipelines and AWS.`;

  const withJD = calculateATSScore(STRONG_SDE_RESUME, 'Frontend Developer', jd);
  const withoutJD = calculateATSScore(STRONG_SDE_RESUME, 'Frontend Developer');

  assert(withJD.matchedKeywords.length > 0, `Should match JD keywords, got ${withJD.matchedKeywords.length}`);
  console.log(`  With JD: matched ${withJD.matchedKeywords.length} keywords, score ${withJD.atsScore}`);
  console.log(`  Without JD: matched ${withoutJD.matchedKeywords.length} keywords, score ${withoutJD.atsScore}`);
});

test('Score breakdown sums to total ATS score', () => {
  const result = calculateATSScore(AVERAGE_RESUME, 'Full Stack Developer');
  const sum =
    result.scoreBreakdown.structure.score +
    result.scoreBreakdown.keywords.score +
    result.scoreBreakdown.relevance.score +
    result.scoreBreakdown.formatting.score +
    result.scoreBreakdown.impact.score +
    result.scoreBreakdown.readability.score;

  const roundedSum = Math.round(sum);
  assert(roundedSum === result.atsScore, `Sum of breakdown (${roundedSum}) should equal atsScore (${result.atsScore})`);
});

// ─── Summary ────────────────────────────────────────────────────────────────

console.log('\n' + '═'.repeat(60));
console.log(`ATS Scoring Engine Test Results: ${passed} PASSED, ${failed} FAILED`);
console.log('═'.repeat(60));

if (failed > 0) {
  console.log('\nFailed tests:');
  results.filter(r => r.status !== 'PASS').forEach(r => {
    console.log(`  ✗ [${r.status}] ${r.message}`);
  });
  process.exit(1);
} else {
  console.log('\n✓ All tests passed!\n');

  // Print score summary for the three key resumes
  console.log('─── Score Summary ───');
  const weak = calculateATSScore(WEAK_RESUME, 'Software Engineer');
  const avg = calculateATSScore(AVERAGE_RESUME, 'Full Stack Developer');
  const strong = calculateATSScore(STRONG_SDE_RESUME, 'Software Development Engineer');

  console.log(`Weak Resume:   ${weak.atsScore}/100`);
  console.log(`Average Resume: ${avg.atsScore}/100`);
  console.log(`Strong Resume:  ${strong.atsScore}/100`);
  process.exit(0);
}
