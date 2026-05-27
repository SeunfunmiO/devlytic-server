const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const generateMatchScore = async ({ developer, job }) => {
    const prompt = `
You are an expert technical recruiter. Analyze how well this developer matches the job and return a JSON response.

DEVELOPER PROFILE:
- Name: ${developer.fullName}
- Bio: ${developer.bio || 'Not provided'}
- Skills: ${developer.skills?.join(', ') || 'Not provided'}
- Availability: ${developer.availabilityStatus}
- GitHub: ${developer.githubUrl || 'Not provided'}
- Portfolio: ${developer.portfolioUrl || 'Not provided'}

JOB DETAILS:
- Title: ${job.title}
- Description: ${job.description}
- Required Skills: ${job.skillsRequired?.join(', ') || 'Not provided'}
- Requirements: ${job.requirements?.join(', ') || 'Not provided'}
- Job Type: ${job.jobType}
- Work Mode: ${job.workMode}
- Location: ${job.location}

Analyze the match and respond with ONLY a valid JSON object in this exact format, no extra text:
{
  "score": <number between 0 and 100>,
  "reason": "<2-3 sentence explanation of the match score>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>"]
}
`;

    const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].text.trim();
    const parsed = JSON.parse(raw);
    return parsed;
};

module.exports = { generateMatchScore };