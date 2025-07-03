# Cybersecurity Interview API

An AI-powered evaluation system for cybersecurity bootcamp mock interviews using OpenAI GPT-4.

## Features

- **AI-Powered Evaluation**: Uses OpenAI GPT-4 for intelligent answer assessment
- **Detailed Scoring**: Comprehensive breakdown of coverage, technical accuracy, communication quality, and additional insights
- **Role-Based Assessment**: Tailored evaluation based on role and experience level
- **XP System**: Gamified experience points based on performance
- **Error Handling**: Robust error handling with detailed error responses

## API Endpoints

### POST /api/evaluate

Evaluates a user's answer against expert reference answers.

**Request Body:**
\`\`\`json
{
  "question": {
    "question": "Multiple failed login attempts detected from the same IP address. What steps do you take?",
    "answer": [
      "Review SIEM logs for frequency, source IP, and targeted accounts",
      "Check for correlation with successful logins that follow failed attempts",
      "Determine if attempts follow a brute-force pattern or credential stuffing",
      "Investigate whether it's isolated or widespread across the network",
      "Block or monitor the IP address if determined to be malicious",
      "Notify affected users and enforce password resets if necessary",
      "Implement or tune detection rules for future monitoring"
    ],
    "category": "scenario"
  },
  "user_answer": "I would first check the logs to see how many failed attempts there were. Then I would block the IP address if it looks suspicious and maybe reset passwords for affected users.",
  "role": "SOC Analyst",
  "experience_level": "entry_level"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "evaluation": {
    "overall_score": 65,
    "breakdown": {
      "coverage_score": 15,
      "technical_accuracy": 18,
      "communication_quality": 20,
      "additional_insights": 5
    },
    "feedback": {
      "strengths": [
        "Identified the need to check logs as first step",
        "Recognized the importance of blocking suspicious IPs",
        "Mentioned password resets for affected users"
      ],
      "improvements": [
        "Missing detailed SIEM log analysis approach",
        "No mention of correlation with successful logins",
        "Lacks structured incident response methodology",
        "Missing detection rule implementation details"
      ],
      "specific_suggestions": [
        "Study SIEM log correlation techniques for brute force detection",
        "Learn about NIST incident response framework phases",
        "Practice identifying attack patterns (brute-force vs credential stuffing)",
        "Include evidence preservation steps in your response"
      ]
    },
    "expert_reference": [
      "Review SIEM logs for frequency, source IP, and targeted accounts",
      "Check for correlation with successful logins that follow failed attempts",
      "Determine if attempts follow a brute-force pattern or credential stuffing",
      "Investigate whether it's isolated or widespread across the network",
      "Block or monitor the IP address if determined to be malicious",
      "Notify affected users and enforce password resets if necessary",
      "Implement or tune detection rules for future monitoring"
    ],
    "xp_earned": 20
  }
}
\`\`\`

### GET /api/health

Returns the health status of the API.

**Response:**
\`\`\`json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "Cybersecurity Interview API",
  "version": "1.0.0"
}
\`\`\`

## Setup Instructions

1. **Clone and Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Configuration**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Add your OpenAI API key to `.env.local`:
   \`\`\`env
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

3. **Development**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Production Build**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `OPENAI_API_KEY` environment variable in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Railway**: Connect GitHub repo and add environment variables
- **Render**: Deploy from GitHub with environment variables
- **DigitalOcean App Platform**: Deploy from GitHub
- **AWS/Google Cloud**: Use their respective deployment services

## Scoring System

- **Coverage Score (0-30)**: How many key points were covered
- **Technical Accuracy (0-30)**: Correctness of technical information
- **Communication Quality (0-25)**: Clarity, structure, professionalism
- **Additional Insights (0-15)**: Extra knowledge and best practices

### XP Calculation
- 90-100 overall: 35 XP
- 80-89 overall: 30 XP
- 70-79 overall: 25 XP
- 60-69 overall: 20 XP
- 50-59 overall: 15 XP
- Below 50: 10 XP

## Error Handling

The API includes comprehensive error handling for:
- Invalid requests
- OpenAI API rate limits
- API key configuration errors
- Network issues
- Parsing errors

## Integration Example

\`\`\`javascript
// Frontend integration example
const evaluateAnswer = async (payload) => {
  try {
    const response = await fetch('https://your-api-domain.com/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Handle successful evaluation
      console.log('Score:', result.evaluation.overall_score);
      console.log('XP Earned:', result.evaluation.xp_earned);
    } else {
      // Handle error
      console.error('Evaluation failed:', result.error.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
\`\`\`

## Security Considerations

- API key is stored securely in environment variables
- Input validation on all endpoints
- Rate limiting considerations for OpenAI API
- CORS configuration for frontend integration
- Error messages don't expose sensitive information

## Support

For issues or questions, please check the error responses and ensure your OpenAI API key is properly configured.
