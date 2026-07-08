/**
 * Deterministic ATS Scoring Service
 *
 * Evaluates a resume against 6 categories for a total of 100 points.
 * The same inputs always produce the same output — no randomness,
 * no AI model calls, no timestamp-based logic.
 *
 * Categories:
 *   A. Structure & Completeness   — 20 pts
 *   B. Skills & Keyword Match     — 25 pts
 *   C. Experience & Project Relevance — 20 pts
 *   D. ATS Formatting Compatibility   — 15 pts
 *   E. Impact & Content Quality       — 10 pts
 *   F. Grammar & Readability          — 10 pts
 */

import { ROLE_KEYWORDS, KEYWORD_ALIASES, resolveRole } from '../constants/roleKeywords.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Normalize text: lowercase, collapse whitespace, strip trailing punctuation.
 */
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Resolve a keyword through the alias map.  Returns the canonical form.
 */
const resolveAlias = (keyword) => {
  const k = keyword.toLowerCase().trim();
  return KEYWORD_ALIASES[k] || k;
};

/**
 * Check whether `keyword` appears in `text` respecting word boundaries.
 * Special handling for terms containing dots or slashes (e.g. "node.js", "ci/cd").
 */
const keywordPresentInText = (keyword, normalizedText) => {
  // Escape regex-special characters in the keyword
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // For keywords with dots/slashes we relax the trailing boundary
  // because "node.js" won't have a word char after the "s".
  const hasDotOrSlash = /[./]/.test(keyword);
  const pattern = hasDotOrSlash
    ? new RegExp(`(?:^|[\\s,;:()/\\-])${escaped}(?:$|[\\s,;:()/\\-])`)
    : new RegExp(`\\b${escaped}\\b`);

  return pattern.test(normalizedText);
};

/**
 * Extract keywords from a job description string.
 * Finds known technology terms and skills that appear in the text.
 */
const extractJDKeywords = (jobDescription) => {
  if (!jobDescription || jobDescription.trim().length < 20) return null;

  const normalizedJD = normalizeText(jobDescription);
  const found = new Set();

  // Scan all known keywords across every role
  for (const role of Object.values(ROLE_KEYWORDS)) {
    for (const kw of [...role.required, ...role.preferred]) {
      if (keywordPresentInText(kw, normalizedJD)) {
        found.add(kw);
      }
    }
  }

  // Also check alias source forms
  for (const [alias, canonical] of Object.entries(KEYWORD_ALIASES)) {
    if (keywordPresentInText(alias, normalizedJD)) {
      found.add(canonical);
    }
  }

  return found.size > 0 ? [...found] : null;
};

// ─── Section Detection ──────────────────────────────────────────────────────

const SECTION_PATTERNS = {
  contact: [
    /\b(email|phone|mobile|contact|address|linkedin|github\.com|portfolio)\b/i,
    /[\w.-]+@[\w.-]+\.\w{2,}/,  // email pattern
    /(\+?\d[\d\s\-()]{7,})/,     // phone pattern
  ],
  summary: [
    /\b(summary|objective|profile|about\s*me|professional\s*summary|career\s*objective|personal\s*statement)\b/i,
  ],
  education: [
    /\b(education|academic|qualification|university|college|bachelor|master|degree|b\.?tech|m\.?tech|b\.?sc|m\.?sc|b\.?e\b|m\.?e\b|phd|diploma|school|gpa|cgpa)\b/i,
  ],
  skills: [
    /\b(skills|technical\s*skills|technologies|competencies|proficiencies|tech\s*stack|tools|languages\s*(?:and|&)\s*frameworks)\b/i,
  ],
  experience: [
    /\b(experience|work\s*experience|employment|professional\s*experience|work\s*history|internship|intern)\b/i,
  ],
  projects: [
    /\b(projects|personal\s*projects|academic\s*projects|side\s*projects|key\s*projects|notable\s*projects)\b/i,
  ],
  certifications: [
    /\b(certifications?|certificates?|licensed?|accreditation|certified)\b/i,
  ],
  achievements: [
    /\b(achievements?|awards?|honors?|accomplishments?|recognition|hackathon|publications?|research)\b/i,
  ],
};

/**
 * Detect which standard resume sections are present.
 * Returns an object like { contact: true, summary: false, ... }
 */
const detectSections = (text) => {
  const result = {};
  for (const [section, patterns] of Object.entries(SECTION_PATTERNS)) {
    result[section] = patterns.some(p => p.test(text));
  }
  return result;
};

// ─── Action Verbs ───────────────────────────────────────────────────────────

const ACTION_VERBS = [
  'achieved', 'administered', 'analyzed', 'architected', 'automated',
  'built', 'collaborated', 'configured', 'contributed', 'created',
  'debugged', 'delivered', 'deployed', 'designed', 'developed',
  'engineered', 'enhanced', 'established', 'executed', 'fixed',
  'implemented', 'improved', 'increased', 'integrated', 'launched',
  'led', 'maintained', 'managed', 'mentored', 'migrated',
  'monitored', 'optimized', 'orchestrated', 'organized', 'performed',
  'planned', 'published', 'reduced', 'refactored', 'resolved',
  'scaled', 'secured', 'spearheaded', 'streamlined', 'supervised',
  'tested', 'trained', 'transformed', 'upgraded', 'utilized',
];

// ─── Scoring Functions ──────────────────────────────────────────────────────

/**
 * A. Resume Structure & Completeness — max 20 points
 */
const scoreStructure = (text, sections) => {
  let score = 0;
  const details = [];

  // Points per section (total possible = 20 from 8 sections, weighted)
  const sectionWeights = {
    contact: 3,
    summary: 2,
    education: 3,
    skills: 3,
    experience: 3,
    projects: 2.5,
    certifications: 1.5,
    achievements: 2,
  };

  for (const [section, weight] of Object.entries(sectionWeights)) {
    if (sections[section]) {
      score += weight;
      details.push(`✓ ${section} section detected`);
    } else {
      details.push(`✗ ${section} section missing`);
    }
  }

  return { score: Math.min(Math.round(score * 10) / 10, 20), maxScore: 20, details };
};

/**
 * B. Skills & Keyword Match — max 25 points
 */
const scoreKeywords = (normalizedText, targetRole, jdKeywords) => {
  const roleKey = resolveRole(targetRole);
  const roleData = ROLE_KEYWORDS[roleKey] || ROLE_KEYWORDS['software engineer'];

  // Determine the keyword pool to match against
  let requiredPool, preferredPool;

  if (jdKeywords && jdKeywords.length > 0) {
    // When JD is provided, use JD keywords as the primary pool
    // Split into "required" (first 60%) and "preferred" (rest)
    const splitIdx = Math.ceil(jdKeywords.length * 0.6);
    requiredPool = jdKeywords.slice(0, splitIdx);
    preferredPool = jdKeywords.slice(splitIdx);
  } else {
    requiredPool = roleData.required;
    preferredPool = roleData.preferred;
  }

  const matchedKeywords = new Set();
  const allExpected = new Set([...requiredPool, ...preferredPool]);

  // Check each expected keyword against the resume
  for (const kw of allExpected) {
    const canonical = resolveAlias(kw);

    // Check canonical form
    if (keywordPresentInText(canonical, normalizedText)) {
      matchedKeywords.add(canonical);
      continue;
    }

    // Check original form
    if (keywordPresentInText(kw, normalizedText)) {
      matchedKeywords.add(kw);
      continue;
    }

    // Check aliases that map to this canonical form
    for (const [alias, target] of Object.entries(KEYWORD_ALIASES)) {
      if (target === canonical && keywordPresentInText(alias, normalizedText)) {
        matchedKeywords.add(canonical);
        break;
      }
    }
  }

  // Score: required matches worth more
  const requiredMatches = requiredPool.filter(kw => {
    const c = resolveAlias(kw);
    return matchedKeywords.has(c) || matchedKeywords.has(kw);
  }).length;

  const preferredMatches = preferredPool.filter(kw => {
    const c = resolveAlias(kw);
    return matchedKeywords.has(c) || matchedKeywords.has(kw);
  }).length;

  const requiredRatio = requiredPool.length > 0 ? requiredMatches / requiredPool.length : 0;
  const preferredRatio = preferredPool.length > 0 ? preferredMatches / preferredPool.length : 0;

  // Weighted: 60% required, 40% preferred
  const rawScore = (requiredRatio * 0.6 + preferredRatio * 0.4) * 25;

  // Build missing keywords list
  const missingKeywords = [];
  for (const kw of allExpected) {
    const c = resolveAlias(kw);
    if (!matchedKeywords.has(c) && !matchedKeywords.has(kw)) {
      missingKeywords.push(kw);
    }
  }

  return {
    score: Math.min(Math.round(rawScore * 10) / 10, 25),
    maxScore: 25,
    matchedKeywords: [...matchedKeywords],
    missingKeywords: [...new Set(missingKeywords)],
    requiredMatches,
    preferredMatches,
    totalRequired: requiredPool.length,
    totalPreferred: preferredPool.length,
  };
};

/**
 * C. Experience & Project Relevance — max 20 points
 */
const scoreRelevance = (text, normalizedText, targetRole, sections) => {
  let score = 0;
  const details = [];
  const roleKey = resolveRole(targetRole);
  const roleData = ROLE_KEYWORDS[roleKey] || ROLE_KEYWORDS['software engineer'];
  const roleTerms = [...roleData.required, ...roleData.preferred];

  // --- Experience presence (up to 8 points) ---
  const experiencePatterns = [
    /\b(\d+)\s*\+?\s*years?\s*(of\s*)?(experience|working|professional)/i,
    /\b(work(?:ed)?|intern(?:ed)?|employed|freelanc)/i,
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{4}\s*[-–—to]+\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|present|current)/i,
  ];

  let experienceIndicators = 0;
  for (const p of experiencePatterns) {
    if (p.test(text)) experienceIndicators++;
  }

  // Internship/alternative experience for freshers
  const fresherPatterns = [
    /\b(internship|intern|trainee|apprentice)\b/i,
    /\b(hackathon|open[\s-]?source|contributor|freelanc)/i,
    /\b(research\s*(assistant|associate|paper|project)|publication)\b/i,
    /\b(volunteer|teaching\s*assistant|ta\b)/i,
  ];

  let fresherIndicators = 0;
  for (const p of fresherPatterns) {
    if (p.test(text)) fresherIndicators++;
  }

  let baseExperienceScore = 0;
  if (experienceIndicators >= 2) {
    baseExperienceScore = 8;
    // Check actual years of experience to differentiate junior vs senior credit
    const yearsMatch = text.match(/\b(\d+)\s*\+?\s*years?\s*(of\s*)?(experience|working|professional)/i);
    if (yearsMatch) {
      const years = parseInt(yearsMatch[1], 10);
      if (years < 2) {
        baseExperienceScore = 5;
        details.push('Work experience indicators found (approx. 1 year)');
      } else {
        details.push('Strong work experience indicators found (2+ years)');
      }
    } else {
      details.push('Strong work experience indicators found');
    }
  } else if (experienceIndicators === 1) {
    baseExperienceScore = 5;
    details.push('Some work experience indicators found');
  } else if (fresherIndicators >= 2) {
    baseExperienceScore = 6;
    details.push('Good alternative experience (internships/hackathons/open-source)');
  } else if (fresherIndicators === 1) {
    baseExperienceScore = 4;
    details.push('Some alternative experience found');
  } else if (sections.projects) {
    baseExperienceScore = 3;
    details.push('Projects section found but limited experience indicators');
  } else {
    details.push('No meaningful experience or project indicators found');
  }
  score += baseExperienceScore;

  // --- Project quality (up to 6 points) ---
  const projectCount = (text.match(/\b(project|built|developed|created|designed)\b/gi) || []).length;
  const uniqueProjectMentions = Math.min(projectCount, 8); // cap to prevent inflation
  const projectScore = Math.min((uniqueProjectMentions / 4) * 6, 6);
  score += projectScore;
  if (uniqueProjectMentions >= 3) {
    details.push(`Multiple project references found (${uniqueProjectMentions})`);
  }

  // --- Relevance to target role (up to 6 points) ---
  let relevantTermCount = 0;
  const seen = new Set();
  for (const term of roleTerms) {
    const canonical = resolveAlias(term);
    if (seen.has(canonical)) continue;
    seen.add(canonical);
    if (keywordPresentInText(canonical, normalizedText) || keywordPresentInText(term, normalizedText)) {
      relevantTermCount++;
    }
  }
  
  // Use a slightly higher threshold (0.55) for full relevance ratio
  const relevanceRatio = roleTerms.length > 0 ? Math.min(relevantTermCount / (roleTerms.length * 0.55), 1) : 0;
  const relevanceScore = relevanceRatio * 6;
  score += relevanceScore;

  if (relevanceRatio >= 0.7) {
    details.push('Highly relevant to target role');
  } else if (relevanceRatio >= 0.4) {
    details.push('Moderately relevant to target role');
  } else {
    details.push('Low relevance to target role');
  }

  // Scale the experience and projects score based on how relevant they are to the target role
  // If relevanceRatio is 0 (no matching keywords), their experience/projects get heavily penalized.
  const finalScore = score * (0.15 + 0.85 * relevanceRatio);

  return { score: Math.min(Math.round(finalScore * 10) / 10, 20), maxScore: 20, details };
};

/**
 * D. ATS Formatting Compatibility — max 15 points
 */
const scoreFormatting = (text, sections) => {
  let score = 15; // Start with full score and deduct
  const details = [];

  // Check for standard section headings (deduct up to 3 if missing)
  const standardHeadings = ['education', 'experience', 'skills', 'projects'];
  const headingPattern = /^[\s]*[A-Z][A-Za-z\s&]+[\s]*$/gm;
  const headings = text.match(headingPattern) || [];
  const hasStandardHeadings = standardHeadings.filter(h =>
    headings.some(heading => heading.toLowerCase().trim().includes(h))
  ).length;

  if (hasStandardHeadings < 2) {
    score -= 3;
    details.push('Few standard section headings detected');
  } else {
    details.push('Standard section headings present');
  }

  // Check for excessive special characters
  const specialCharCount = (text.match(/[^\w\s.,;:!?@#$%&*()\-+=/'"[\]{}|\\<>~`\n\r]/g) || []).length;
  const textLength = text.length || 1;
  const specialRatio = specialCharCount / textLength;
  if (specialRatio > 0.05) {
    score -= 3;
    details.push('Excessive special characters or unusual Unicode detected');
  } else {
    details.push('Character usage is ATS-compatible');
  }

  // Check for very long paragraphs (lines > 300 chars without breaks)
  const lines = text.split(/\n/);
  const longParagraphs = lines.filter(l => l.trim().length > 300).length;
  if (longParagraphs > 3) {
    score -= 2;
    details.push('Multiple very long paragraphs may affect readability');
  }

  // Check for contact information quality
  const hasEmail = /[\w.-]+@[\w.-]+\.\w{2,}/.test(text);
  const hasPhone = /(\+?\d[\d\s\-()]{7,})/.test(text);
  if (!hasEmail && !hasPhone) {
    score -= 3;
    details.push('No email or phone number detected');
  } else if (!hasEmail || !hasPhone) {
    score -= 1;
    details.push('Partial contact information (missing email or phone)');
  } else {
    details.push('Contact information appears complete');
  }

  // Check for contact location (deduct 1 point if missing)
  const hasLocation = /\b(street|road|drive|ave|avenue|city|state|zip|postal|india|usa|uk|canada|london|york|california|texas|san francisco|seattle|boston|chicago|austin|denver|atlanta|miami|france|paris)\b/i.test(text) || /\b[A-Z][a-z]+,\s*[A-Z]{2}\b/.test(text);
  if (!hasLocation) {
    score -= 1;
    details.push('Missing contact location details');
  } else {
    details.push('Contact location details detected');
  }

  // Check resume length (words)
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount < 100) {
    score -= 3;
    details.push('Resume is very short — may not pass ATS filters');
  } else if (wordCount < 250) {
    score -= 2;
    details.push('Resume is relatively short (under 250 words)');
  } else if (wordCount < 400) {
    score -= 1;
    details.push('Resume is somewhat short (under 400 words)');
  }

  // Check for section organization (multiple sections present)
  const sectionCount = Object.values(sections).filter(Boolean).length;
  if (sectionCount < 3) {
    score -= 2;
    details.push('Poor section organization — too few distinct sections');
  } else {
    details.push('Good section organization');
  }

  return { score: Math.max(Math.min(Math.round(score * 10) / 10, 15), 0), maxScore: 15, details };
};

/**
 * E. Impact & Content Quality — max 10 points
 */
const scoreImpact = (text, normalizedText) => {
  let score = 0;
  const details = [];

  // Count action verbs
  let actionVerbCount = 0;
  const seenVerbs = new Set();
  for (const verb of ACTION_VERBS) {
    if (keywordPresentInText(verb, normalizedText) && !seenVerbs.has(verb)) {
      actionVerbCount++;
      seenVerbs.add(verb);
    }
  }

  // Action verbs: up to 3 points
  if (actionVerbCount >= 8) {
    score += 3;
    details.push(`Strong use of action verbs (${actionVerbCount} found)`);
  } else if (actionVerbCount >= 4) {
    score += 2;
    details.push(`Moderate use of action verbs (${actionVerbCount} found)`);
  } else if (actionVerbCount >= 1) {
    score += 1;
    details.push(`Few action verbs found (${actionVerbCount})`);
  } else {
    details.push('No action verbs detected');
  }

  // Quantified achievements: up to 4 points
  const quantifiedPatterns = [
    /\d+\s*%/g,                                    // percentages
    /\d+\s*\+/g,                                   // 200+
    /\b\d{2,}\s*(users?|customers?|clients?|students?|people|employees?|members?)\b/gi,
    /\b(reduced|improved|increased|decreased|saved|grew|generated|boosted)\b.*?\d+/gi,
    /\$[\d,]+/g,                                   // dollar amounts
    /\b\d+\s*(seconds?|minutes?|hours?|ms|milliseconds?)\b/gi,
  ];

  let quantifiedCount = 0;
  for (const p of quantifiedPatterns) {
    const matches = text.match(p);
    if (matches) quantifiedCount += matches.length;
  }
  quantifiedCount = Math.min(quantifiedCount, 10); // cap

  if (quantifiedCount >= 5) {
    score += 4;
    details.push(`Excellent quantified achievements (${quantifiedCount} metrics found)`);
  } else if (quantifiedCount >= 3) {
    score += 3;
    details.push(`Good quantified achievements (${quantifiedCount} metrics found)`);
  } else if (quantifiedCount >= 1) {
    score += 1.5;
    details.push(`Some quantified achievements (${quantifiedCount} found)`);
  } else {
    details.push('No quantified achievements or metrics found');
  }

  // Bullet-style content: up to 2 points
  const bulletLines = text.split('\n').filter(l => /^\s*[•\-–—*▪▸►]\s/.test(l) || /^\s*\d+[.)]\s/.test(l));
  if (bulletLines.length >= 6) {
    score += 2;
    details.push('Good use of bullet points');
  } else if (bulletLines.length >= 3) {
    score += 1;
    details.push('Some bullet points used');
  } else {
    details.push('Few or no bullet points — consider using bullet format');
  }

  // Vague description penalty: up to -1 point
  const vagueTerms = [
    /\b(responsible for|duties included|helped with|worked on|assisted in|participated in)\b/gi,
  ];
  let vagueCount = 0;
  for (const p of vagueTerms) {
    const m = text.match(p);
    if (m) vagueCount += m.length;
  }
  if (vagueCount >= 4) {
    score -= 1;
    details.push('Multiple vague descriptions detected — use specific action verbs');
  }

  return { score: Math.max(Math.min(Math.round(score * 10) / 10, 10), 0), maxScore: 10, details };
};

/**
 * F. Grammar & Readability — max 10 points
 */
const scoreReadability = (text) => {
  let score = 10; // Start full and deduct
  const details = [];

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const words = text.split(/\s+/).filter(w => w.length > 0);

  if (sentences.length === 0 || words.length === 0) {
    return { score: 0, maxScore: 10, details: ['Insufficient text for readability analysis'] };
  }

  // Average sentence length
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
  if (avgWordsPerSentence > 35) {
    score -= 2;
    details.push('Sentences are too long on average — consider breaking them up');
  } else if (avgWordsPerSentence > 25) {
    score -= 1;
    details.push('Some sentences are quite long');
  } else {
    details.push('Sentence length is appropriate');
  }

  // Repeated phrases (look for 3+ word phrases repeated 3+ times)
  const normalizedSentences = normalizeText(text);
  const threeGrams = {};
  const textWords = normalizedSentences.split(/\s+/);
  for (let i = 0; i < textWords.length - 2; i++) {
    const gram = `${textWords[i]} ${textWords[i + 1]} ${textWords[i + 2]}`;
    // Skip grams that are just common filler
    if (!/^(and|the|of|in|to|for|a|an|is|are|was|were)\b/.test(gram)) {
      threeGrams[gram] = (threeGrams[gram] || 0) + 1;
    }
  }
  const repeatedPhrases = Object.entries(threeGrams).filter(([, count]) => count >= 3);
  if (repeatedPhrases.length >= 3) {
    score -= 2;
    details.push(`Multiple repeated phrases detected (${repeatedPhrases.length} phrases repeated 3+ times)`);
  } else if (repeatedPhrases.length >= 1) {
    score -= 1;
    details.push('Some repeated phrases detected');
  } else {
    details.push('No excessive repetition');
  }

  // Very long sentences (> 50 words)
  const longSentences = sentences.filter(s => s.split(/\s+/).length > 50).length;
  if (longSentences >= 3) {
    score -= 2;
    details.push(`${longSentences} very long sentences detected`);
  } else if (longSentences >= 1) {
    score -= 1;
    details.push('Some overly long sentences');
  }

  // Basic grammar checks — look for common issues
  const grammarIssues = [
    /\bi\b(?![''])/g,   // lowercase "i" not followed by apostrophe (informal)
    /\s{2,}/g,           // double spaces
    /[.!?]{2,}/g,        // repeated punctuation
  ];

  let grammarProblems = 0;
  for (const p of grammarIssues) {
    const m = text.match(p);
    if (m) grammarProblems += Math.min(m.length, 5);
  }

  if (grammarProblems >= 8) {
    score -= 2;
    details.push('Multiple grammar/formatting issues detected');
  } else if (grammarProblems >= 3) {
    score -= 1;
    details.push('Minor grammar/formatting issues');
  } else {
    details.push('Text appears clean and professional');
  }

  // Professional tone check (very basic — presence of unprofessional terms)
  const unprofessional = /\b(lol|gonna|wanna|gotta|kinda|btw|omg|idk)\b/i;
  if (unprofessional.test(text)) {
    score -= 2;
    details.push('Informal/unprofessional language detected');
  }

  return { score: Math.max(Math.min(Math.round(score * 10) / 10, 10), 0), maxScore: 10, details };
};

// ─── Strengths / Weaknesses / Suggestions Generator ─────────────────────────

const generateInsights = (structureResult, keywordResult, relevanceResult, formattingResult, impactResult, readabilityResult, sections) => {
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  // Structure insights
  if (structureResult.score >= 16) {
    strengths.push('Resume has a well-organized structure with most essential sections present.');
  } else if (structureResult.score < 10) {
    weaknesses.push('Resume is missing multiple essential sections — ATS systems may not parse it correctly.');
    suggestions.push('Add missing sections: include Contact Info, Summary, Education, Skills, Experience, and Projects as separate clearly-labeled sections.');
  }

  if (!sections.summary) {
    suggestions.push('Add a Professional Summary or Objective section at the top of your resume.');
  }
  if (!sections.contact) {
    weaknesses.push('Contact information is not clearly identifiable.');
    suggestions.push('Add your email, phone number, LinkedIn, and location in a dedicated Contact section.');
  }

  // Keyword insights
  if (keywordResult.score >= 20) {
    strengths.push(`Strong keyword alignment with target role — ${keywordResult.matchedKeywords.length} relevant skills matched.`);
  } else if (keywordResult.score < 10) {
    weaknesses.push(`Low keyword match for the target role — only ${keywordResult.matchedKeywords.length} relevant skills found.`);
    if (keywordResult.missingKeywords.length > 0) {
      const topMissing = keywordResult.missingKeywords.slice(0, 5).join(', ');
      suggestions.push(`Add missing keywords to your Skills section: ${topMissing}.`);
    }
  }

  // Relevance insights
  if (relevanceResult.score >= 16) {
    strengths.push('Work experience and projects are highly relevant to the target role.');
  } else if (relevanceResult.score < 8) {
    weaknesses.push('Experience and projects show limited relevance to the target role.');
    suggestions.push('Tailor your project descriptions and experience bullet points to highlight skills relevant to your target role.');
  }

  // Formatting insights
  if (formattingResult.score >= 13) {
    strengths.push('Resume formatting is ATS-compatible with clear structure.');
  } else if (formattingResult.score < 8) {
    weaknesses.push('Resume formatting may cause issues with ATS parsing systems.');
    suggestions.push('Use standard section headings (Education, Experience, Skills, Projects), avoid excessive special characters, and keep paragraphs concise.');
  }

  // Impact insights
  if (impactResult.score >= 8) {
    strengths.push('Good use of action verbs and quantified achievements — demonstrates measurable impact.');
  } else if (impactResult.score < 4) {
    weaknesses.push('Resume lacks quantified achievements and measurable impact statements.');
    suggestions.push('Add metrics to your bullet points — e.g., "Improved API response time by 35%", "Built an app used by 200+ students".');
  }

  // Readability insights
  if (readabilityResult.score >= 8) {
    strengths.push('Resume text is clear, professional, and easy to read.');
  } else if (readabilityResult.score < 5) {
    weaknesses.push('Readability issues detected — sentences may be too long or repetitive.');
    suggestions.push('Keep bullet points concise (1-2 lines each), avoid repeated phrases, and use professional language throughout.');
  }

  // Ensure we always have at least 1 item each
  if (strengths.length === 0) {
    strengths.push('Resume has been submitted and parsed successfully.');
  }
  if (weaknesses.length === 0) {
    weaknesses.push('No critical weaknesses detected — focus on optimization.');
  }
  if (suggestions.length === 0) {
    suggestions.push('Continue refining your resume with more quantified achievements and role-specific keywords.');
  }

  return { strengths, weaknesses, suggestions };
};

// ─── Main Scoring Function ──────────────────────────────────────────────────

/**
 * Calculate a deterministic ATS score for the given resume text.
 *
 * @param {string} resumeText - Raw text extracted from the resume PDF.
 * @param {string} targetRole - The user's target career role.
 * @param {string} [jobDescription] - Optional job description text for keyword matching.
 * @returns {Object} Complete ATS analysis result.
 */
export const calculateATSScore = (resumeText, targetRole, jobDescription) => {
  if (!resumeText || resumeText.trim().length < 30) {
    return {
      atsScore: 0,
      scoreBreakdown: {
        structure: { score: 0, maxScore: 20 },
        keywords: { score: 0, maxScore: 25 },
        relevance: { score: 0, maxScore: 20 },
        formatting: { score: 0, maxScore: 15 },
        impact: { score: 0, maxScore: 10 },
        readability: { score: 0, maxScore: 10 },
      },
      matchedKeywords: [],
      missingKeywords: [],
      strengths: ['Resume was submitted.'],
      weaknesses: ['Resume contains insufficient text for a meaningful analysis.'],
      suggestions: ['Please upload a complete resume with all relevant sections for an accurate ATS score.'],
      error: 'Resume text is too short for reliable analysis.',
    };
  }

  const normalizedText = normalizeText(resumeText);
  const sections = detectSections(resumeText);

  // Extract JD keywords if provided
  const jdKeywords = jobDescription ? extractJDKeywords(jobDescription) : null;

  // Calculate each category
  const structureResult = scoreStructure(resumeText, sections);
  const keywordResult = scoreKeywords(normalizedText, targetRole, jdKeywords);
  const relevanceResult = scoreRelevance(resumeText, normalizedText, targetRole, sections);
  const formattingResult = scoreFormatting(resumeText, sections);
  const impactResult = scoreImpact(resumeText, normalizedText);
  const readabilityResult = scoreReadability(resumeText);

  // Total score
  const rawTotal =
    structureResult.score +
    keywordResult.score +
    relevanceResult.score +
    formattingResult.score +
    impactResult.score +
    readabilityResult.score;

  const atsScore = Math.round(Math.max(0, Math.min(100, rawTotal)));

  // Generate insights
  const { strengths, weaknesses, suggestions } = generateInsights(
    structureResult, keywordResult, relevanceResult,
    formattingResult, impactResult, readabilityResult, sections
  );

  // Development logging
  if (process.env.NODE_ENV !== 'production') {
    console.log('[ATS Scoring] ─── Score Breakdown ───');
    console.log(`  Target Role: ${targetRole} → resolved: ${resolveRole(targetRole)}`);
    console.log(`  Structure:   ${structureResult.score}/${structureResult.maxScore}`);
    console.log(`  Keywords:    ${keywordResult.score}/${keywordResult.maxScore}`);
    console.log(`  Relevance:   ${relevanceResult.score}/${relevanceResult.maxScore}`);
    console.log(`  Formatting:  ${formattingResult.score}/${formattingResult.maxScore}`);
    console.log(`  Impact:      ${impactResult.score}/${impactResult.maxScore}`);
    console.log(`  Readability: ${readabilityResult.score}/${readabilityResult.maxScore}`);
    console.log(`  ─── TOTAL ATS SCORE: ${atsScore}/100 ───`);
    console.log(`  Matched Keywords (${keywordResult.matchedKeywords.length}): ${keywordResult.matchedKeywords.join(', ')}`);
    console.log(`  Missing Keywords (${keywordResult.missingKeywords.length}): ${keywordResult.missingKeywords.slice(0, 10).join(', ')}`);
  }

  return {
    atsScore,
    scoreBreakdown: {
      structure: { score: structureResult.score, maxScore: 20 },
      keywords: { score: keywordResult.score, maxScore: 25 },
      relevance: { score: relevanceResult.score, maxScore: 20 },
      formatting: { score: formattingResult.score, maxScore: 15 },
      impact: { score: impactResult.score, maxScore: 10 },
      readability: { score: readabilityResult.score, maxScore: 10 },
    },
    matchedKeywords: keywordResult.matchedKeywords,
    missingKeywords: keywordResult.missingKeywords,
    strengths,
    weaknesses,
    suggestions,
  };
};
