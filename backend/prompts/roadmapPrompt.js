/**
 * Builds a professional prompt for the OpenAI-compatible API to generate a personalized career roadmap.
 *
 * @param {Object} userData - User's profile details collected from form.
 * @param {string} userData.name - User's name.
 * @param {Object} userData.education - User's degree, field, university.
 * @param {Array} userData.skills - User's current skills.
 * @param {Object} userData.goal - User's target role, domain, timeline.
 * @param {Object} userData.experience - User's experience level, years, role.
 * @param {number} userData.hoursPerDay - Available study hours per day.
 * @param {string} userData.learningStyle - Primary learning method preferences.
 * @returns {string} The fully compiled LLM system/user prompt.
 */
export const buildRoadmapPrompt = (userData) => {
  const { name, education, skills, goal, experience, hoursPerDay, learningStyle } = userData;

  const skillsList = Array.isArray(skills)
    ? skills.map(s => `${s.name} (${s.level || 'Intermediate'})`).join(', ')
    : skills;

  return `You are an expert Senior Career Mentor and Academic Counselor AI. 
Your goal is to output a personalized, highly structured, professional, and practical career roadmap in JSON format for a user named "${name}".

USER PROFILE:
- Name: ${name}
- Education: ${education?.degree || 'N/A'} in ${education?.fieldOfStudy || 'N/A'} from ${education?.institution || 'N/A'} (Class of ${education?.gradYear || 'N/A'})
- Existing Skills: ${skillsList || 'None listed'}
- Target Career Goal: ${goal?.targetRole || 'Software Engineer'} (Timeline: ${goal?.timeline || '6 months'}, Domain: ${goal?.industry || 'Tech'})
- Experience Level: ${experience?.level || 'Entry-level'} (${experience?.years || 0} years experience, previous role: ${experience?.currentRole || 'N/A'})
- Learning Time: ${hoursPerDay || 2} hours per day
- Learning Preference: ${learningStyle?.primaryStyle || 'Practical & Project-based'}, Pace: ${learningStyle?.pace || 'Moderate'}, Preferred resources: ${learningStyle?.resources?.join(', ') || 'Videos, Docs'}

INSTRUCTIONS:
1. Design a month-by-month career roadmap covering the requested timeline.
2. ALWAYS start the roadmap from the absolute basics and fundamentals of the target field (e.g. for Web Development, start with basic HTML, CSS, and Vanilla JavaScript) if the user's experience is Entry-level/Beginner, or if they lack the foundational pre-requisites for the target role. Never jump straight to frameworks/libraries (like React, Node.js, Next.js) or advanced systems without establishing a solid foundational base in the first month(s).
3. Keep items realistic based on their daily availability of ${hoursPerDay} hours/day.
4. Recommend practical, real-world projects that they can build for their portfolio.
5. Provide high-quality curation of learning resources (written blogs, video paths, documentations) with direct, valid clickable URLs (e.g. direct docs links, or youtube search queries) in the "url" field and certifications that boost hiring chances.
6. Provide expert tips on networking, interview prep, and career strategy.

CRITICAL: Return ONLY a valid, parsable JSON object. Do NOT wrap the JSON in markdown blocks (e.g. \`\`\`json ... \`\`\`), do not write extra introductory or concluding conversational text. Start with "{" and end with "}".

OUTPUT JSON SCHEMA:
{
  "careerGoal": "Clean description of the target career role",
  "estimatedTimeline": "Calculated total study time (e.g., '6 months')",
  "weeklyCommitment": "e.g., '10 hours per week'",
  "monthlyRoadmap": [
    {
      "month": 1,
      "title": "Month focus title",
      "objectives": ["Objective 1", "Objective 2"],
      "weeklyBreakdown": [
        {
          "week": 1,
          "topics": ["Topic A", "Topic B"],
          "tasks": ["Action task 1", "Action task 2"]
        }
      ]
    }
  ],
  "recommendedProjects": [
    {
      "title": "Project Name",
      "difficulty": "Beginner/Intermediate/Advanced",
      "description": "Short overview of what the project is",
      "techStack": ["React", "Node.js", "etc"],
      "learningOutcome": "What skill this project builds"
    }
  ],
  "learningResources": [
    {
      "name": "Resource Title",
      "type": "Documentation/Video/Article/Book",
      "url": "A direct URL to the resource or search query, e.g. 'https://developer.mozilla.org/' or a Youtube search link 'https://www.youtube.com/results?search_query=...'",
      "notes": "Advice on how to study this resource"
    }
  ],
  "recommendedCertifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuer Organization (e.g., AWS, Google, freeCodeCamp)",
      "importance": "High/Medium/Low"
    }
  ],
  "tips": [
    {
      "category": "Networking / Interview Prep / Productivity",
      "advice": "Actionable text advice"
    }
  ]
}`;
};
